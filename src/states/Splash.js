import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg');
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar');
    centerGameObjects([this.loaderBg, this.loaderBar]);

    let banner = this.add.text(this.game.world.centerX, this.game.world.centerY - 64, 'Console Cowboys!');
    banner.font = 'Nunito';
    banner.fontSize = 64;
    banner.fill = '#77BFA3';
    banner.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.loaderBar);
    //
    // load your assets
    //
    // this.load.image('mushroom6', 'assets/images/mushroom2.png');
  }

  create () {
    this.state.start('Game')
  }

}
