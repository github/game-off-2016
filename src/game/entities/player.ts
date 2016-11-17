import {config} from '../../config';
import {
  Point,
  Texture,
  Sprite,
  Rectangle,
  Container,
  Circle
} from 'pixi.js';
import {Game} from '../game';
import {ITimeEvent} from '../game-loop';
import {
  moveBody,
  rectToPoint,
  pointToRect,
  reverseKeys
} from '../functional';
import {IRobot, IUnit, teamType} from '../types';

import {Unit} from './unit';

export class Player extends Unit {
  get type() { return 'hacker'; }
  get team(): teamType { return 'hacker'; }

  private _xSpeed: number;
  private _ySpeed: number;
  private _config: any;
  private _keyState: {[key: string]: boolean};
  private _keyMap: {[key: number]: string};
  private _hackingPoint: Point;
  private _hackingPointX: number;
  private _hackingPointY: number;

  get hitbox() { return new Circle(this._hackingPoint.x, this._hackingPoint.y, 3); }

  _preInit(game: Game) {
    this._xSpeed = 0;
    this._ySpeed = 0;
    this._keyState = {};
    this._keyMap = reverseKeys(config.keys);
    this._config = Object.assign({}, config.entities.player);
  }

  _postInit(game: Game) {
    game.keyPress$.subscribe(e => this._updateStateFromKeyboard(e));
  }

  _initBody() {
    return new Rectangle(0, 0, this._config.size, this._config.size);
  }

  _initView() {
    let container = new Container();
    const sprite = new Sprite(Texture.fromImage('assets/basics/nin.png'));
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    container.addChild(sprite);
    return container;
  }

  _setPosition(pos: Point) {
    this._hackingPoint = new Point(pos.x + this._hackingPointX, pos.y + this._hackingPointY);
    super._setPosition(pos);
  }

  update(time: ITimeEvent) {
    let position = this._moveBody(this.body, this._xSpeed * this._config.speed, this._ySpeed * this._config.speed);
    this.position = rectToPoint(position);
    let robot = this._game.currentMap.unitAt(this._hackingPoint, 'robot');
    if (robot && (robot.type === 'ranged' || robot.type === 'melee')) {
      debugger;
      (<IRobot>robot).hack(this._config.hackSpeed * time.delta / 1000);
    }
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
