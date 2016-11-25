import {
  DisplayObject,
  Container,
  IHitArea,
  Point
} from 'pixi.js';

import {
  collide,
  isInLOS,
  getDistance,
  pointToCircle
} from '../functional';

import {Unit} from './unit';
import {HackMeter} from '../ui';
import {config} from '../../config';
import {IEntity} from '../types';

export abstract class Robot extends Unit {
  protected abstract _hackResistence(): number;
  protected abstract _changeTeam(): void;

  protected _fov: IHitArea;
  protected _target: IEntity;

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

  get fov() { return this._fov; }
  get target() { return this._target; }

  protected _getClosestEnemy(): IEntity {
    let target = <IEntity> this._game.currentMap.robots
    .filter(rob => this.team !== rob.team && collide(this._fov, rob.body))
    .sort(rob => getDistance(this, rob))
    .find(rob => isInLOS(this._game.currentMap, this._fov.x, this._fov.y ,rob.position.x, rob.position.y))

    if(target === undefined) {
      let player = this._game.currentMap.player;
      if( this.team !== player.team &&
        collide(this._fov, player.body) &&
        isInLOS(this._game.currentMap, this._fov.x, this._fov.y , player.position.x, player.position.y)) {
          target = player;
        }
      }

      return target;
    }
}
