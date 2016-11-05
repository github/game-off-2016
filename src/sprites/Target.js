import Phaser from 'phaser'

const width = 3;
const defaultColor = 0x00FF00;
const defaultAlpha = 0.5;
export default class extends Phaser.Graphics {

  constructor ({ game, source, color }) {
    super(game, 0,0);
    this.game = game;
    this.anchor.setTo(0);
    this.source = source;

    this.lineStyle(width, color || defaultColor, defaultAlpha);
  }

  update() {
    this.clear();
    this.moveTo(this.source.x, this.source.y);
    this.lineTo(this.game.input.x, this.game.input.y);
  }

}
