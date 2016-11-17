import {
  Point,
  IHitArea,
  Rectangle,
  DisplayObject
} from 'pixi.js';
import {Subscription} from 'rxjs/Rx';

import {
  IUnit,
  teamType
} from '../types';

import {
  tileToPoint,
  pointToRect
} from '../functional';
import {ITimeEvent} from '../game-loop';
import {Game} from '../game';

export abstract class Unit implements IUnit {
  abstract get type(): string;
  abstract get team(): teamType;
  protected abstract _initBody(): Rectangle;
  protected abstract _initView(): DisplayObject;

  private _body: Rectangle;
  private _hitbox: IHitArea;
  private _view: DisplayObject;
  private _subscription: Subscription;
  private _position: Point;

  get view() { return this._view; }
  get body() { return this._body; }
  get hitbox() { return this._hitbox; }
  set tile(pos: Point) { this.position = tileToPoint(pos); }
  public get position() { return this._position; }
  public set position(pos: Point) { this._setPosition(pos); }

  constructor(protected _game: Game) {
    this._preInit(_game);
    this._body = this._initBody();
    this._view = this._initView();
    this._subscription = _game.gameLoop$.subscribe(e => this.update(e));
    this._postInit(_game);
  }

  hit(damage: number) {}
  update(time: ITimeEvent) {}
  protected _preInit(game: Game) {}
  protected _postInit(game: Game) {}

  protected _updateView() {
    this._view.position = this.position.clone();
  }

  protected _setPosition(pos: Point) {
    this._position = pos.clone();
    this._body = pointToRect(pos, this._body.width, this._body.height);
    this._updateView();
  }

  destroy() {
    this._game.currentMap.removeEntity(this);
    this._view.destroy();
    this._subscription.unsubscribe();
  }
}
