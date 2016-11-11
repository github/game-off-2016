import {config} from '../../config';
import {
  Point,
  Texture,
  Sprite,
  Rectangle,
  Container,
  Graphics
} from 'pixi.js';
import {Game} from '../game';
import {ITimeEvent} from '../game-loop';
import {
  moveBody,
  rectToPoint,
  tileToRect,
  reverseKeys
} from '../functional';
import {IUnit, teamType} from '../types';

export class Player implements IUnit {
  get type() { return 'hacker'; }

  private _xSpeed: number;
  private _ySpeed: number;
  private _keyState: {[key: string]: boolean};
  private _keyMap: {[key: number]: string};
  private _view: Container;
  private _config: any;
  private _body: Rectangle;
  private _hackingPoint: Point;
  private _hackingPointX: number;
  private _hackingPointY: number;
  private _hackingView: Graphics;

  get view() { return this._view; }
  get body() { return this._body; }
  get team(): teamType { return 'hacker'; }
  get position() { return rectToPoint(this._body); }

  set tile(pos: Point) {
    this._body = tileToRect(pos, this._config.size, this._config.size);
    this._hackingPoint = new Point(pos.x + this._hackingPointX, pos.y + this._hackingPointY);
    this._updateView();
  }

  constructor(
    private _game: Game
  ) {
    this._config = Object.assign(config.entities.player);
    this._xSpeed = 0;
    this._ySpeed = 0;
    this._keyState = {};
    this._view = new Container();
    const sprite = new Sprite(Texture.fromImage('assets/basics/nin.png'));
    this._view.addChild(sprite);
    this._keyMap = reverseKeys(config.keys);

    this._hackingView = new Graphics();
    this._hackingView.beginFill(0xFF0000, 0.8);
    this._hackingView.drawCircle(0, 0, 3);
    this._view.addChild(this._hackingView);

    this.tile = new Point();

    _game.keyPress$.subscribe(e => this._updateStateFromKeyboard(e));
    _game.gameLoop$.subscribe(e => this.update(e));
  }

  hit(damage: number) {
    console.log(damage);
  }

  update(time: ITimeEvent) {
    this._body = this._moveBody(this._body, this._xSpeed * this._config.speed, this._ySpeed * this._config.speed);
    let point = this.position;
    this._hackingPoint = new Point(point.x + this._hackingPointX, point.y + this._hackingPointY);
    this._updateView();
  }

  private _updateView() {
    this._view.position.x = this._body.x;
    this._view.position.y = this._body.y;
    this._hackingView.x = this._hackingPointX + this._body.width / 2;
    this._hackingView.y = this._hackingPointY + this._body.height / 2;
  }

  private _moveBody(body: Rectangle, dx: number, dy: number): Rectangle {
    return moveBody(this._game.currentMap, body, dx, dy);
  }

  private _updateStateFromKeyboard(e: KeyboardEvent) {
    let value = e.type === 'keydown';
    let key = this._keyMap[e.which];
    if (!key) { return; }
    this._keyState[key] = value;

    if (this._keyState['up']) {
      this._ySpeed = -1;
    } else if (this._keyState['down']) {
      this._ySpeed = 1;
    } else {
      this._ySpeed = 0;
    }

    if (this._keyState['left']) {
      this._xSpeed = -1;
    } else if (this._keyState['right']) {
      this._xSpeed = 1;
    } else {
      this._xSpeed = 0;
    }

    if ((this._xSpeed !== 0 || this._ySpeed !== 0) && (this._xSpeed === 0 || this._ySpeed === 0)) {
      this._hackingPointX = this._xSpeed * this._config.hackDistance;
      this._hackingPointY = this._ySpeed * this._config.hackDistance;
    }

    if (this._xSpeed !== 0 && this._ySpeed !== 0) {
      this._xSpeed *= 0.7;
      this._ySpeed *= 0.7;
    }

  }
}
