import {config} from '../../config';
import {Point, Texture, Sprite, Rectangle} from 'pixi.js';
import {Game} from '../game';
import {moveBody} from '../functional';

export class Player {
  private xSpeed: number;
  private ySpeed: number;
  private keyState: {[key: string]: boolean};
  private keyMap: {[key: number]: string};
  private _view: Sprite;
  private config: any;
  private _body: Rectangle;

  private _moveBody: (body: Rectangle, dx: number, dy: number) => Rectangle;

  get view() { return this._view; }

  set tile(pos: Point) {
    this._body.x = config.tileSize * pos.x + (config.tileSize - this.config.size - 1) / 2;
    this._body.y = config.tileSize * pos.y + (config.tileSize - this.config.size - 1);
    this._view.position.x = this._body.x;
    this._view.position.y = this._body.y;
  }

  update(time) {
    this._body = this._moveBody(this._body, this.xSpeed * this.config.speed, this.ySpeed * this.config.speed);
    this._view.position.x = this._body.x;
    this._view.position.y = this._body.y;
  }

  constructor(
    private _game: Game
  ) {
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.keyState = {};
    this.config = Object.assign(config.entities.player);
    this._body = new Rectangle(0, 0, this.config.size, this.config.size);
    this._moveBody = moveBody.bind(null, _game.currentMap);

    _game.keyPress$.subscribe(e => this.updateStateFromKeyboard(e));

    const texture = Texture.fromImage('assets/basics/nin.png');
    this._view = new Sprite(texture);
    this._view.anchor.x = 0;
    this._view.anchor.y = 0;
    this._view.position.x = this._body.x;
    this._view.position.y = this._body.y;

    this.update = this.update.bind(this);
    _game.gameLoop$.subscribe(this.update);

    this.keyMap = Object.keys(config.keys).reduce((ret, key) => {
      ret[config.keys[key]] = key;
      return ret;
    }, {});
  }

  updateStateFromKeyboard(e: KeyboardEvent) {
    let value = e.type === 'keydown';
    let key = this.keyMap[e.which];
    if (!key) { return; }
    this.keyState[key] = value;

    if (this.keyState['up']) {
      this.ySpeed = -1;
    } else if (this.keyState['down']) {
      this.ySpeed = 1;
    } else {
      this.ySpeed = 0;
    }

    if (this.keyState['left']) {
      this.xSpeed = -1;
    } else if (this.keyState['right']) {
      this.xSpeed = 1;
    } else {
      this.xSpeed = 0;
    }

    if (this.xSpeed !== 0 && this.ySpeed !== 0) {
      this.xSpeed *= 0.7;
      this.ySpeed *= 0.7;
    }

  }
}
