import {Keyboard} from '../util/keyboard';
import {config} from '../config';
const {Graphics, Container, Texture, Sprite} = PIXI;
import {GameLoop} from '../util/game-loop';

export class Player {
  private keyboard: Keyboard;
  private xSpeed: number;
  private ySpeed: number;
  private keyState: {[key: string]: boolean};
  private keyMap: {[key: number]: string};
  private _view: PIXI.Sprite;

  get view() { return this._view; }

  set tile(pos: PIXI.Point) {
    this._view.position.x = 32 * pos.x + (32 - 24) / 2;
    this._view.position.y = 32 * pos.y + (32 - 24);
  }

  update(time) {
    this._view.position.x += this.xSpeed;
    this._view.position.y += this.ySpeed;
  }

  constructor(gl: GameLoop) {
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.keyState = {};
    this.keyboard = new Keyboard();
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
