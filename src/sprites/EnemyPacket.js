import Phaser from 'phaser'

const size = 5;
export default class extends Phaser.Graphics {

  constructor({ game, src, grid, color }) {
    super(game, src.x, src.y);

    this.game = game;
    this.anchor.setTo(0.5);
    this.currentlyAt = src;
    this.grid = grid;

    this.beginFill(color || 0xFF0000);
    this.drawCircle(0, 0, size);
    this.endFill();

    this.patrol();

  }

  chooseTarget() {
    this.target = this.grid.randomNode(this.currentlyAt.logic.uuid);
  }

  patrol() {
    this.chooseTarget();
    console.log(this.target);
    const path = this.grid.shortestPath(this.currentlyAt.logic.uuid, this.target);
    console.log(path);
    pointPath = this.grid.pointPath(path);

    sendAlongPath(pointPath).onComplete.add(() => {
      this.currentlyAt = this.target;
      this.target = null;
      this.patrol();
    });
  }

  sendAlongPath(pointPath) {
    let points = pointPath.reduce((hash, point) => {
      hash.x.push(point.x);
      hash.y.push(point.y);
      return hash;
    }, {x: [], y: []});
    let t = this.game.add.tween(this).to(points, 500 * pointPath.length ,Phaser.Easing.Linear.None,true);
    return t;
  }

  update() {
  }

}
