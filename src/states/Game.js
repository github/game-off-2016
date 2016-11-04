/* globals __DEV__ */
import Phaser from 'phaser'
import Target from '../sprites/Target'
import Packet from '../sprites/Packet'
import Server from '../sprites/Server'
import {default as ServerLogic, BASE, NEUTRAL, ENEMY} from '../logic/Server'
import times from 'times-loop'

const GRID_COLS = 3
const GRID_ROW = 4
const SERVER_PADDING = 25
const STAGE_PADDING = 75

const BASE_SERVERS = 1
const ENEMY_SERVERS = 2

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    let clickSignal = new Phaser.Signal();
    var currentServer = null;
    clickSignal.add((server) => {
      if (currentServer == null) {
        if (server.canSendPacket()){
          currentServer = server;
        }
      } else {
        if (server != currentServer) {
          let packet = new Packet({game, src: currentServer});
          this.game.add.existing(packet);
          packet.sendTo(server);
          currentServer = null;
        }
      }
    });

    const locations = this.createServerLocationsInGrid(GRID_COLS, GRID_ROW, { cellPadding: SERVER_PADDING })
    const servers = locations.forEach((location, idx) => {
      let type
      if (idx <= BASE_SERVERS - 1) {
        type = BASE
      } else if (idx >= locations.length - ENEMY_SERVERS) {
        type = ENEMY
      } else {
        type = NEUTRAL
      }
      this.createServer(type, location, clickSignal)
    })
  }

  createServerLocationsInGrid(gridCols, gridRows, { cellPadding } = { cellPadding: 0 }) {
    const locations = []
    const cellW = (this.game.world.width - (STAGE_PADDING * 2)) / gridCols
    const cellH = (this.game.world.height - (STAGE_PADDING * 2)) / gridRows
    for (let col = 0; col < gridCols; col++) {
      for (let row = 0; row < gridRows; row++) {
        locations.push({
          x: STAGE_PADDING + this.game.rnd.integerInRange(cellW * col + cellPadding, cellW * (col+1) - cellPadding),
          y: STAGE_PADDING + this.game.rnd.integerInRange(cellH * row + cellPadding, cellH * (row+1) - cellPadding)
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
