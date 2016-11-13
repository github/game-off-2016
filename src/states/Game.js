/* globals __DEV__ */
import _ from 'lodash'
import Phaser from 'phaser'
import Target from '../sprites/Target'
import Packet from '../sprites/Packet'
import Server, { BASE_SERVER_SIZE } from '../sprites/Server'
import EnemyPacket from '../sprites/EnemyPacket'
import {default as Grid, SIMPLE, CAPTURED, ENEMY as ENEMY_EDGE} from '../sprites/Grid'
import {default as ServerLogic, BASE, NEUTRAL, ENEMY} from '../logic/Server'
import Graphlib from "graphlib"
import { distance, doLinesIntersect, doesLineIntersectsWithCircle } from '../utils'
import times from 'times-loop'

const GRID_COLS = 3
const GRID_ROW = 4
const SERVER_PADDING = 25
const STAGE_PADDING = 75
const SNAP_RANGE = 3

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
    const enemyPacket = new EnemyPacket({game, src: enemyServers[0], grid: this.grid})
    game.add.existing(enemyPacket);
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

  handleServerDragStart(server, pointer) {
    if (server.canSendPacket()) {
      this.currentServer = server
    }
  }

  handleServerDragUpdate(origin, target) {
    if (!this.currentServer) return
    let intersections
    this.servers.forEach((server) => { if (server !== origin) server.removeIndicators() })
    const snappedServer = this.findClosestSnappedServer(origin, target)
    if (snappedServer) {
      if (this.networkGraph.hasEdge(origin.logic.uuid, snappedServer.logic.uuid)) {
        this.mode = 'deploy'
      } else { // BUILD
        intersections = this.doesEdgeIntersectWithOthers(origin.x, origin.y, target.x, target.y)
        if (intersections.length === 0) {
          this.mode = 'build'
        }
      }
      snappedServer.snapIndication()
      this.currentTarget = target = snappedServer
    } else {
      this.mode = null
      this.currentTarget = null
    }

    this.grid.render({
      drag: { origin, target },
      intersections: intersections || [],
      mode: this.mode
    })
  }

  handleServerDragStop(server, pointer) {
    this.grid.render()
    let path, packet, pointPath;
    if (this.mode === 'build') {
      path = [this.currentTarget.logic.uuid]
      path.reduce((last, current) => {
        let e = this.networkGraph.edge({v: last, w: current});
        this.networkGraph.setEdge(last, current, {...e, type: CAPTURED});
        return current;
      }, this.currentServer.logic.uuid);
      this.grid.render();
      this.sendPacketOnPath(this.currentServer, path, this.mode)
    } else if (this.mode === 'deploy' && server.canSendPacket() && this.currentTarget) {
      this.sendPacketOnPath(this.currentServer, [this.currentTarget.logic.uuid], this.mode)
    }
    this.mode = this.currentServer = this.currentTarget = undefined
    this.grid.render()
  }

  sendPacketOnPath(originServer, path, type = 'deploy') {
    let packet = new Packet({game: this.game, src: originServer});
    this.game.add.existing(packet);
    var pointPath = this.grid.pointPath(path);
    originServer.logic.subtractPackets(1)
    packet.sendAlongPath(pointPath, this.networkGraph.node(path[0]).server, type);
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
      return doesLineIntersectsWithCircle(origin, target, server, (BASE_SERVER_SIZE + SNAP_RANGE) / window.devicePixelRatio) && (server !== origin)
    })
    return _.min(snappedServers, (server) => {
      return distance(server, origin)
    })
  }
}
