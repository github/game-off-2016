/* globals __DEV__ */
import Phaser from 'phaser'
import Target from '../sprites/Target'
import Packet from '../sprites/Packet'
import Server, { BASE_SERVER_SIZE } from '../sprites/Server'
import {default as Grid, SIMPLE, CAPTURED, ENEMY as ENEMY_EDGE} from '../sprites/Grid'
import {default as ServerLogic, BASE, NEUTRAL, ENEMY} from '../logic/Server'
import Graphlib from "graphlib"
import { distance, doLinesIntersect, doesLineIntersectsWithCircle } from '../utils'
import times from 'times-loop'

const GRID_COLS = 3
const GRID_ROW = 4
const SERVER_PADDING = 25
const STAGE_PADDING = 75

const BASE_SERVERS = 1
const ENEMY_SERVERS = 3

export default class extends Phaser.State {
  preload () {
    this.networkGraph = new Graphlib.Graph({directed: false});
    window.networkGraph = this.networkGraph;
    window.Graphlib = Graphlib;
  }

  create () {
    this.grid = new Grid({ game, networkGraph: this.networkGraph })
    this.game.add.existing(this.grid)
    this.currentServer = null
    this.currentTarget = null
    window.g = this.grid;

    let clickSignal = new Phaser.Signal();
    clickSignal.add((server, eventType, pointer) => {
      switch (eventType) {
        case 'click': return this.handleServerClick(server, pointer)
        case 'over': return this.handleServerOver(server, pointer)
        case 'out': return this.handleServerOut(server, pointer)
        case 'dragStart': return this.handleServerDragStart(server, pointer)
        case 'dragUpdate': return this.handleServerDragUpdate(server, pointer)
        case 'dragStop': return this.handleServerDragStop(server, pointer)
      }
    });

    const locations = this.createServerLocationsInGrid(GRID_COLS, GRID_ROW, { cellPadding: SERVER_PADDING });
    this.servers = [];
    locations.forEach((location, idx) => {
      let type
      if (idx <= BASE_SERVERS - 1) {
        type = BASE
      } else if (idx >= locations.length - ENEMY_SERVERS) {
        type = ENEMY
      } else {
        type = NEUTRAL
      }
      let server = this.createServer(type, location, clickSignal);
      if (server) {
        this.servers.push(server);
        this.networkGraph.setNode(server.logic.uuid, {server: server, logic: server.logic});
      }
    });

    const enemyServers = this.filterServerByTypes(ENEMY)
    enemyServers.forEach((source) => {
      enemyServers.forEach((target) => {
        if (target.logic.uuid != source.logic.uuid) {
          this.networkGraph.setEdge(source.logic.uuid, target.logic.uuid, {
            distance: distance(source, target)
          });
        }
      });
    });
    this.grid.render();
  }

  createServerLocationsInGrid(gridCols, gridRows, { cellPadding } = { cellPadding: 0 }) {
    const locations = []
    const cellW = (this.game.world.width - (STAGE_PADDING * 2)) / gridCols
    const cellH = (this.game.world.height - (STAGE_PADDING * 2)) / gridRows
    for (let col = 0; col < gridCols; col++) {
      for (let row = 0; row < gridRows; row++) {
        locations.push({
          x: STAGE_PADDING + this.game.rnd.integerInRange(cellW * col + cellPadding, cellW * (col+1) - cellPadding),
          y: STAGE_PADDING + this.game.rnd.integerInRange(cellH * row + cellPadding, cellH * (row+1) - cellPadding),
          c: col,
          r: row
        })
      }
    }
    return locations;
  }

  createServer(type, location, clickSignal) {
    let serverN = new ServerLogic(type);
    let s = new Server({
      game: this.game,
      logic: serverN,
      clickSignal,
      ...location
    });
    this.game.add.existing(s);
    return s;
  }

  filterServerByTypes(...types) {
    return this.servers.filter((server) => {
      return types.includes(server.logic.type)
    })
  }

  handleServerClick(server, pointer) {
    if (this.currentServer == null) { // PICK ORIGIN
      if (server.canSendPacket()){
        this.currentServer = server;
        this.currentTarget = new Target({
          game,
          source: server
        });
        game.add.existing(this.currentTarget);
      }
    } else {
      if (server != this.currentServer) { // PICK TARGET (origin already selected)
        let path = [server.logic.uuid]
        let packet, pointPath
        if (this.networkGraph.hasEdge(server, this.currentServer)) { // DEPLOY MODE
          [packet, pointPath] = this.sendPacketOnPath(this.currentServer, path)
          packet.sendAlongPath(pointPath, server);
        }
      }
      this.currentServer = null; // DESELECT AFTER CLICK (TODO (shay): determine if this is the behavior we want)
      this.currentTarget.kill();
    }
  }

  handleServerOver(server, pointer) {

  }

  handleServerOut(server, pointer) {

  }

  handleServerDragStart(server, pointer) {
    this.currentServer = server
  }

  handleServerDragUpdate(origin, target) {
    this.servers.forEach((server) => { if (server !== origin) server.removeIndicators() })
    const snappedServer = this.findClosestSnappedServer(origin, target)
    if (snappedServer) {
      this.snappedServer = target = snappedServer
      snappedServer.snapIndication()
    }
    const intersections = this.doesEdgeIntersectWithOthers(origin.x, origin.y, target.x, target.y)
    this.grid.render({
      drag: { origin, target },
      intersections,
    })
  }

  handleServerDragStop(server, pointer) {
    this.grid.render()
    // const intersection = this.doesEdgeIntersectWithAnother(this.currentServer, server)
    // if (intersection) {
    //   // TODO: handle
    // } else {
    //   // TODO: make sure there's no edge already.
    //   path.reduce((last, current) => {
    //     let e = this.networkGraph.edge({v: last, w: current});
    //     this.networkGraph.setEdge(last, current, {...e, type: CAPTURED});
    //     return current;
    //   }, this.currentServer.logic.uuid);
    //   this.grid.render();
    //   [packet, pointPath] = this.sendPacketOnPath(this.currentServer, path)
    // }
    // packet.sendAlongPath(pointPath, server);
  }


  sendPacketOnPath(originServer, path) {
    let packet = new Packet({game: this.game, src: originServer});
    this.game.add.existing(packet);
    var pointPath = path.map((uuid) => {
      let s = this.networkGraph.node(uuid).server;
      return {
        x: s.x,
        y: s.y
      }
    });
    originServer.logic.subtractPackets(1)
    return [packet, pointPath]
  }

  doesEdgeIntersectWithOthers(x0, y0, x1, y1) {
    return this.networkGraph.edges().filter((edge) => {
      let v = this.networkGraph.node(edge.v).server
      let w = this.networkGraph.node(edge.w).server
      let edgeX0 = v.x
      let edgeY0 = v.y
      let edgeX1 = w.x
      let edgeY1 = w.y
      let intersection = doLinesIntersect(x0, y0, x1, y1, edgeX0, edgeY0, edgeX1, edgeY1)
      if (intersection) {
        return edge
      } else {
        return false
      }
    })
  }

  findClosestSnappedServer(origin, target) {
    const snappedServers = this.servers.filter((server) => {
        return doesLineIntersectsWithCircle(origin, target, server, BASE_SERVER_SIZE) && (server !== origin)
    })
    return snappedServers[0]
  }
}
