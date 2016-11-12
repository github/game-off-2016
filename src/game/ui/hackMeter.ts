import {Graphics} from 'pixi.js';
import {config} from '../../config';

export class HackMeter {
  private _view: Graphics;
  get view() { return this._view; }

  constructor() {
    this._view = new Graphics();
  }

  setProgress(progress: number) {
    this._view.clear();
    this._view.beginFill(0x00FF00);
    this._view.drawRect(0, 0, config.tileSize * progress, 3);
  }
}
