import {
  DisplayObject,
  Container
} from 'pixi.js';

import {Unit} from './unit';
import {HackMeter} from '../ui';
import {config} from '../../config';

export abstract class Robot extends Unit {
  protected abstract _hackResistence(): number;
  protected abstract _changeTeam(): void;

  private _hackMeter: number;
  private _hackMeterView: HackMeter;

  protected _addView(dO: DisplayObject) {
    let container = new Container();
    this._hackMeterView = new HackMeter();
    this._hackMeterView.view.position.x = -config.tileSize / 2;
    this._hackMeterView.view.position.y = -config.tileSize / 2;
    container.addChild(dO);
    container.addChild(this._hackMeterView.view);
    return container;
  }

  constructor(game: any) {
    super(game);
    this._hackMeter = 0;
  }

  hack(value: number) {
    this._hackMeter += value;
    if (this._hackMeter >= this._hackResistence() ) {
      this._hackMeter = 0;
      this._changeTeam();
    }
    this._hackMeterView.setProgress(this._hackMeter / this._hackResistence());
  }
}
