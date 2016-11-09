import level1 from './levels/level-01';

import {GameLoop} from './game-loop';
import {GameCanvas} from './game-canvas';
import {Keyboard} from './keyboard';
import {Map} from './map';

export class Game {
  private gameLoop: GameLoop;
  private canvas: GameCanvas;
  private keyboard: Keyboard;

  get mainLoop$() { return this.gameLoop.main$; }
  get gameLoop$() { return this.gameLoop.game$; }
  get renderLoop$() { return this.gameLoop.render$; }
  get keyPress$() { return this.keyboard.keyPress$; }

  get view() { return this.canvas.renderer.view; }

  constructor() {
    this.gameLoop = new GameLoop();
    this.canvas = new GameCanvas();
    this.keyboard = new Keyboard();
    const map = new Map(this);
    map.loadLevel(level1);
    this.canvas.stage.addChild(map.view);
  }

  start() {
    this.gameLoop.render$.subscribe(e => this.canvas.paint());
  }
}
