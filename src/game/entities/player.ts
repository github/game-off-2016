import {Keyboard} from '../util/keyboard';
import {config} from '../config';
import {Point, Texture, Sprite} from 'pixi.js';
import {GameLoop} from '../util/game-loop';

export class Player {
  private keyboard: Keyboard;
  private xSpeed: number;
  private ySpeed: number;
  private keyState: {[key: string]: boolean};
  private keyMap: {[key: number]: string};
  private _view: Sprite;
  private config: any;


  get view() { return this._view; }

  set tile(pos: Point) {
    this._view.position.x = config.tileSize * pos.x + (config.tileSize - this.config.size) / 2;
    this._view.position.y = config.tileSize * pos.y + (config.tileSize - this.config.size);
  }

  update(time) {
    this._view.position.x += this.xSpeed * this.config.speed;
    this._view.position.y += this.ySpeed * this.config.speed;
  }

  constructor(gl: GameLoop) {
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.keyState = {};
    this.keyboard = new Keyboard();
    this.config = Object.assign(config.entities.player);
    this.keyboard.keyPress$.subscribe(e => this.updateStateFromKeyboard(e));

    const texture = Texture.fromImage('assets/basics/nin.png');
    this._view = new Sprite(texture);
    this._view.anchor.x = 0;
    this._view.anchor.y = 0;
    this._view.position.x = 0;
    this._view.position.y = 0;

    this.update = this.update.bind(this);
    gl.game$.subscribe(this.update);

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
