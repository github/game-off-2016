import {Graphics, Rectangle, Point} from 'pixi.js';
import {IEntity, teamType} from '../types';
import {ITimeEvent} from '../game-loop';
import {config} from '../../config';
import {
  normalizeVector,
  isOutOfBOunds,
  wallCollision,
  enemyCollision
} from '../functional';


import {Unit} from './unit';

export class EnergyBall extends Unit {
  get type() { return 'energyBall'; }
  get team(): teamType { return 'robot'; }

  private _speed: Point;
  private _config: any;
  get hitbox() { return this.body; }

  _initBody() {
    return new Rectangle(0, 0, this._config.size, this._config.size);
  }

  _initView() {
    return new Graphics()
      .beginFill(0xFFFFFF)
      .drawCircle( 0, 0, this._config.size / 2);
  }

  _preInit() {
    this._config = Object.assign(config.entities.energyBall);
  }

  update(time: ITimeEvent) {
    let enemy = enemyCollision(this._game.currentMap, this);
    if (
      isOutOfBOunds(this._game.currentMap, this.body) ||
      wallCollision(this._game.currentMap, this.body) ||
      enemy !== null
    ) {
      if (enemy) {
        enemy.hit(this._config.damage);
      }
      this.destroy();
    } else if (this._speed) {
      this.position = new Point(
        this.position.x + this._speed.x,
        this.position.y + this._speed.y,
      );
    }
  }

  setTarget(targetPosition: Point) {
    let position = this.position;
    this._speed = normalizeVector(
      targetPosition.x - position.x,
      targetPosition.y - position.y
    );
    this._speed.x = this._speed.x * this._config.speed;
    this._speed.y = this._speed.y * this._config.speed;
  }
}
