import {Point, Rectangle, Graphics} from 'pixi.js';
import {IEntity, teamType} from '../types';
import {Game} from '../game';
import {
  tileToRect
} from '../functional';
import {config} from '../../config';


export class Wall implements IEntity {
  get type() { return 'block'; }

  private _body: Rectangle;
  private _view: Graphics;

  get body() { return this._body; }
  get view() { return this._view; }
  get team(): teamType { return 'neutral'; }

  set tile(pos: Point) {
    this._body = tileToRect(pos, config.tileSize, config.tileSize);
    this._updateView();
  }
  set position(tile: Point) {}


  constructor(
    private _game: Game
  ) {
    const graphics = new Graphics();
    graphics.beginFill(0xFFFF88);
    graphics.drawRect( 0, 0, config.tileSize, config.tileSize );
    this._view = graphics;

    this.tile = new Point();
    this._updateView();
  }

  update() {}

  _updateView() {
    this._view.position.x = this._body.x;
    this._view.position.y = this._body.y;
  }
}
