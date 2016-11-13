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

    setTimeout(this.patrol.bind(this), 2500) // doesnt work on construction.
  }

  chooseTarget() {
    this.target = this.grid.randomNode(this.currentlyAt);
  }

  patrol() {
    this.chooseTarget();
    const path = this.grid.shortestPath(this.currentlyAt, this.target);
    console.log(path);
    if (path) {
      const pointPath = this.grid.pointPath(path);
      this.sendAlongPath(pointPath).onComplete.add(() => {
        this.currentlyAt = this.target;
        this.target = null;
        this.patrol();
      });
    }
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
