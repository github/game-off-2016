import Phaser from 'phaser'

let width = 5;
export default class extends Phaser.Graphics {

  constructor ({ game, source, color }) {
    super(game, source.x, source.y);
    this.game = game;
    this.anchor.setTo(0.5);
    this.source = source;

    this.lineStyle(width, color || 0x000000, 1);
    this.lineTo(10,10);
  }


  update () {
  }

}
