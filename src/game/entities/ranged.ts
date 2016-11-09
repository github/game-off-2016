import {config} from '../../config';
import {Point, Rectangle, Graphics, Circle} from 'pixi.js';
import {Game} from '../game';
import {
  inRange,
  lineOfSight
} from '../functional';

export class Ranged {
  private _view: Graphics;
  private config: any;
  private _body: Rectangle;
  private _range: Circle;
  private _connectLine: Graphics;

  get view() { return this._view; }

  private _playerInRange(): boolean {
    return inRange(this._range, this._game.currentMap.player.body) &&
           lineOfSight(this._game.currentMap,
             this._range.x, this._range.y,
             this._game.currentMap.player.body.x + this._game.currentMap.player.body.width / 2,
             this._game.currentMap.player.body.y + this._game.currentMap.player.body.height / 2
           );
  }

  set tile(pos: Point) {
    this._body.x = config.tileSize * pos.x + (config.tileSize) / 2;
    this._body.y = config.tileSize * pos.y + (config.tileSize) / 2;
    this._view.position.x = this._body.x;
    this._view.position.y = this._body.y;
    this._range.x = this._body.x;
    this._range.y = this._body.y;
  }

  update(time) {
    if (this._playerInRange()) {
    console.log('updating tower');
      let player = this._game.currentMap.player.body;
      this._connectLine.clear();
      this._connectLine.lineStyle(1, 0x00FF00, 1);
      this._connectLine.moveTo(this._body.x, this._body.y);
      this._connectLine.lineTo(player.x + player.width / 2, player.y  + player.height / 2);
      this._connectLine.lineWidth = 3;
      this._game.currentMap.view.addChild(this._connectLine);
    } else {
      this._game.currentMap.view.removeChild(this._connectLine);
    }
  }

  constructor(
    private _game: Game
  ) {
    this.config = Object.assign(config.entities.ranged);
    this._body = new Rectangle(0, 0, this.config.size, this.config.size);
    this._range = new Circle(0, 0, config.tileSize * this.config.radius );
    this._connectLine = new Graphics();
    const graphics = new Graphics();
    graphics.beginFill(0x00FF00, 0.2);
    graphics.drawCircle( 0, 0, config.tileSize * this.config.radius );
    graphics.beginFill(0xFF8888);
    graphics.drawCircle( 0, 0, config.tileSize / 2 );

    this._view = graphics;
    this._view.position.x = this._body.x;
    this._view.position.y = this._body.y;

    this.update = this.update.bind(this);
    _game.gameLoop$.subscribe(this.update);
  }
}
