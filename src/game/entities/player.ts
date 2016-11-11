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
import {moveBody} from '../functional';
import {IUnit, teamType} from '../types';

export class Player implements IUnit {
  get type() { return 'hacker'; }
  get team(): teamType { return 'hacker'; }

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

  get position() {
    return new Point(
      this._body.x + this._body.width / 2,
      this._body.y + this._body.height / 2
    );
  }

  set tile(pos: Point) {
    this._body.x = config.tileSize * pos.x + (config.tileSize - this._config.size - 1) / 2;
    this._body.y = config.tileSize * pos.y + (config.tileSize - this._config.size - 1);
    this._view.position.x = this._body.x;
    this._view.position.y = this._body.y;
    let point = this.position;
    this._hackingPoint = new Point(point.x + this._hackingPointX, point.y + this._hackingPointY);
  }

  constructor(
    private _game: Game
  ) {
    this._xSpeed = 0;
    this._ySpeed = 0;
    this._keyState = {};
    this._config = Object.assign(config.entities.player);

    this._body = new Rectangle(0, 0, this._config.size, this._config.size);
    this._hackingPointX = 0;
    this._hackingPointY = -config.tileSize;
    let point = this.position;
    this._hackingPoint = new Point(point.x + this._hackingPointX, point.y + this._hackingPointY);

    const texture = Texture.fromImage('assets/basics/nin.png');
    const sprite = new Sprite(texture);
    sprite.anchor.x = 0;
    sprite.anchor.y = 0;
    sprite.position.x = this._body.x;
    sprite.position.y = this._body.y;
    this._view = new Container();
    this._view.addChild(sprite);

    this._hackingView = new Graphics();
    this._hackingView.beginFill(0xFF0000, 0.8);
    this._hackingView.drawCircle(0, 0, 3);
    this._hackingView.x = this._hackingPointX + this._body.width / 2;
    this._hackingView.y = this._hackingPointY + this._body.width / 2;
    this._view.addChild(this._hackingView);

    _game.keyPress$.subscribe(e => this._updateStateFromKeyboard(e));
    this.update = this.update.bind(this);
    _game.gameLoop$.subscribe(this.update);

    this._keyMap = Object.keys(config.keys).reduce((ret, key) => {
      ret[config.keys[key]] = key;
      return ret;
    }, {});
  }

  hit(damage: number) {
    console.log(damage);
  }

  update(time: ITimeEvent) {
    this._body = this._moveBody(this._body, this._xSpeed * this._config.speed, this._ySpeed * this._config.speed);
    this._view.position.x = this._body.x;
    this._view.position.y = this._body.y;
    let point = this.position;
    this._hackingPoint = new Point(point.x + this._hackingPointX, point.y + this._hackingPointY);
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
      this._hackingPointX = 0;
      this._hackingPointY = -this._config.hackDistance;
    } else if (this._keyState['down']) {
      this._ySpeed = 1;
      this._hackingPointX = 0;
      this._hackingPointY = this._config.hackDistance;
    } else {
      this._ySpeed = 0;
    }

    if (this._keyState['left']) {
      this._xSpeed = -1;
      this._hackingPointX = -this._config.hackDistance;
      this._hackingPointY = 0;
    } else if (this._keyState['right']) {
      this._xSpeed = 1;
      this._hackingPointX = this._config.hackDistance;
      this._hackingPointY = 0;
    } else {
      this._xSpeed = 0;
    }

    if (this._xSpeed !== 0 && this._ySpeed !== 0) {
      this._xSpeed *= 0.7;
      this._ySpeed *= 0.7;
    }

  }
}
