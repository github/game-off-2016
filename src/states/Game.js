/* globals __DEV__ */
import Phaser from 'phaser'
import Target from '../sprites/Target'
import Packet from '../sprites/Packet'
import Server from '../sprites/Server'
import {default as Grid, SIMPLE, CAPTURED, ENEMY as ENEMY_EDGE} from '../sprites/Grid'
import {default as ServerLogic, BASE, NEUTRAL, ENEMY} from '../logic/Server'
import Graphlib from "graphlib"
import { distance, doLinesIntersect } from '../utils'
import times from 'times-loop'

const GRID_COLS = 3
const GRID_ROW = 4
const SERVER_PADDING = 25
const STAGE_PADDING = 75

const BASE_SERVERS = 1
const ENEMY_SERVERS = 3

const MODES = {
  build: 'BUILD',
  deploy: 'DEPLOY'
}

export default class extends Phaser.State {
  init () {}
  preload () {
    this.networkGraph = new Graphlib.Graph({directed: false});
    window.networkGraph = this.networkGraph;
    window.Graphlib = Graphlib;
  }

  create () {
    this.mode = MODES.build
    this.grid = new Grid({ game, networkGraph: this.networkGraph })
    this.game.add.existing(this.grid)
    this.currentServer = null
    this.currentTarget = null
    window.g = this.grid;

    let clickSignal = new Phaser.Signal();
    clickSignal.add((server, eventType) => {
      switch (eventType) {
        case 'click': return this.handleServerClick(server)
        case 'over': return this.handleServerOver(server)
        case 'out': return this.handleServerOut(server)
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

  handleServerClick(server) {
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
        if (this.mode === MODES.build) { // BUILD MODE
          // COLOR EDGES AS CAPTURED
          const intersection = this.doesEdgeIntersectWithAnother(this.currentServer, server)
          if (intersection) {
            console.log(intersection)
          } else {
            path.reduce((last, current) => {
              let e = this.networkGraph.edge({v: last, w: current});
              this.networkGraph.setEdge(last, current, {...e, type: CAPTURED});
              return current;
            }, this.currentServer.logic.uuid);
            this.grid.render();
            [packet, pointPath] = this.sendPacketOnPath(this.currentServer, path)
          }
        } else if ((this.mode === MODES.deploy) && (this.networkGraph.hasEdge(server, this.currentServer))) { // DEPLOY MODE
          [packet, pointPath] = this.sendPacketOnPath(this.currentServer, path)
        }
        if (packet) { // SEND PACKET IF POSSIBLE
          packet.sendAlongPath(pointPath, server);
        }
      }
      this.currentServer = null; // DESELECT AFTER CLICK (TODO (shay): determine if this is the behavior we want)
      this.currentTarget.kill();
    }
  }

  handleServerOver(server) {

  }

  handleServerOut(server) {

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

  doesEdgeIntersectWithAnother(origin, target) {
    let x0 = origin.x
    let y0 = origin.y
    let x1 = target.x
    let y1 = target.y
    return this.networkGraph.edges().find((edge) => {
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

  render () {
  }
}
