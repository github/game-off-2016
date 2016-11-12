import level1 from './levels/level-01';

import {GameLoop} from './game-loop';
import {GameCanvas} from './game-canvas';
import {Keyboard} from './keyboard';
import {Map} from './map';

export class Game {
  private _gameLoop: GameLoop;
  private _canvas: GameCanvas;
  private _keyboard: Keyboard;
  private _map: Map;

  get mainLoop$() { return this._gameLoop.main$; }
  get gameLoop$() { return this._gameLoop.game$; }
  get preRenderLoop$() { return this._gameLoop.preRender$; }
  get renderLoop$() { return this._gameLoop.render$; }
  get keyPress$() { return this._keyboard.keyPress$; }

  get view() { return this._canvas.renderer.view; }
  get currentMap() { return this._map; }

  pause() {
    this._gameLoop.pause();
  }

  unpause() {
    this._gameLoop.unpause();
  }

  constructor() {
    this._gameLoop = new GameLoop();
    this._canvas = new GameCanvas();
    this._keyboard = new Keyboard();
    this._map = new Map(this);
    this._map.loadLevel(level1);
    this._canvas.stage.addChild(this._map.view);
  }

  start() {
    this._gameLoop.render$.subscribe(e => this._canvas.render());
  }
}
