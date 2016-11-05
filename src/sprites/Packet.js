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

  sendTo (dst) {
    this.game.add.tween(this).to(
      {
        x: dst.x,
        y: dst.y
      },
      500, // TODO: (yon) Need to calc time based on distance / speed
      Phaser.Easing.Linear.None,
      true
    ).onComplete.add(() => {
      dst.hit();
      this.destroy();
    });
  }

  sendAlongPath(pointPath) {
    let points = pointPath.reduce((hash, point) => {
      hash.x.push(point.x);
      hash.y.push(point.y);
      return hash;
    }, {x: [], y: []});
    console.log(pointPath, points);
    let tween = this.game.add.tween(this).to(points, 500,Phaser.Easing.Linear.None,true).onComplete.add(() => this.destroy());
  }

  update () {
  }

}
