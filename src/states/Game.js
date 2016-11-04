/* globals __DEV__ */
import Phaser from 'phaser'
import Target from '../sprites/Target'
import Packet from '../sprites/Packet'
import Server from '../sprites/Server'
import {default as ServerLogic, BASE, NEUTRAL, ENEMY} from '../logic/Server'
import times from 'times-loop'

let serverPadding = 20;
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

    this.createServers(1, BASE, clickSignal);
    this.createServers(8, NEUTRAL, clickSignal);
    this.createServers(2, ENEMY, clickSignal);

  }

  createServers(count, type, clickSignal) {
    times(count, () => {
      let serverN = new ServerLogic(type);
      let s = new Server({
        game: this.game,
        logic: serverN,
        clickSignal,
        ...this.randomLocation()
      });
      this.game.add.existing(s);
    });
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
