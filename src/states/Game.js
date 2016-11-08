/* globals __DEV__ */
import Phaser from 'phaser'
import Target from '../sprites/Target'
import Packet from '../sprites/Packet'
import Server from '../sprites/Server'
import {default as Grid, SIMPLE, CAPTURED, ENEMY as ENEMY_EDGE} from '../sprites/Grid'
import {default as ServerLogic, BASE, NEUTRAL, ENEMY} from '../logic/Server'
import Graphlib from "graphlib"
import {distance} from '../utils'
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
    this.grid = new Grid({game, networkGraph: this.networkGraph});
    this.game.add.existing(this.grid);
    window.g = this.grid;

    let clickSignal = new Phaser.Signal();
    var currentServer = null;
    var target = null;
    clickSignal.add((server) => {
      if (currentServer == null) { // PICK ORIGIN
        if (server.canSendPacket()){
          currentServer = server;
          target = new Target({
            game,
            source: server
          });
          game.add.existing(target);
        }
      } else {
        if (server != currentServer) { // PICK TARGET (origin already selected)
          // let path = this.grid.shortestPath(currentServer.logic.uuid, server.logic.uuid);
          let path = [server.logic.uuid]
          let packet, pointPath
          if (this.mode === MODES.build) { // BUILD MODE
            // COLOR EDGES AS CAPTURED
            path.reduce((last, current) => {
              let e = this.networkGraph.edge({v: last, w: current});
              this.networkGraph.setEdge(last, current, {...e, type: CAPTURED});
              return current;
            }, currentServer.logic.uuid);
            this.grid.render();
            [packet, pointPath] = this.sendPacketOnPath(currentServer, path)
          } else if ((this.mode === MODES.deploy) && (this.networkGraph.hasEdge(server, currentServer))) { // DEPLOY MODE
            [packet, pointPath] = this.sendPacketOnPath(currentServer, path)
          }
          if (packet) { // SEND PACKET IF POSSIBLE
            packet.sendAlongPath(pointPath, server);
          }
        }
        currentServer = null; // DESELECT AFTER CLICK (TODO (shay): determine if this is the behavior we want)
        target.kill();
      }
    });


    const locations = this.createServerLocationsInGrid(GRID_COLS, GRID_ROW, { cellPadding: SERVER_PADDING });
    const servers = [];
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
        servers.push(server);
        this.networkGraph.setNode(server.logic.uuid, {server: server, logic: server.logic});
      }
    });

    servers.forEach((source) => {
      servers.forEach((target) => {
        if (target.logic.uuid != source.logic.uuid) {
          let type = (target.logic.isEnemy() && source.logic.isEnemy()) ? ENEMY_EDGE : SIMPLE;
          this.networkGraph.setEdge(source.logic.uuid, target.logic.uuid, {
            type,
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

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }

  randomLocation() {
    return {
      x: this.game.rnd.integerInRange(serverPadding, this.game.world.width - serverPadding),
      y: this.game.rnd.integerInRange(serverPadding, this.game.world.height - serverPadding)
    }
  }


}
