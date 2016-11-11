import {Point, Rectangle, Graphics} from 'pixi.js';
import {IEntity, teamType} from '../types';
import {Game} from '../game';


export class Wall implements IEntity {
  get type() { return 'block'; }
  get team(): teamType { return 'neutral'; }

  _body: Rectangle;
  _view: Graphics;
  set tile(tile: Point) {}
  set position(tile: Point) {}
  get body() { return this._body; }
  get view() { return this._view; }

  constructor(
    private _game: Game
  ) {}

  update() {}
}
