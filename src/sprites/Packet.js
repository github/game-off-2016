import Phaser from 'phaser'

const size = 5;
export default class extends Phaser.Graphics {

  constructor ({ game, src, color  }) {
    super(game, src.x, src.y);

    this.game = game;
    this.anchor.setTo(0.5);
    this.src = src;

    this.beginFill(color || 0x000000);
    this.drawCircle(0, 0, size);
    this.endFill();
  }

  sendAlongPath(pointPath, server) {
    let points = pointPath.reduce((hash, point) => {
      hash.x.push(point.x);
      hash.y.push(point.y);
      return hash;
    }, {x: [], y: []});
    let t = this.game.add.tween(this).to(points, 500 * pointPath.length ,Phaser.Easing.Linear.None,true);
    t.onComplete.add(() => {
      server.hit();
      this.destroy();
    });
  }

  update () {
  }

}
