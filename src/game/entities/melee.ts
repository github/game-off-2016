import {Graphics,
        Rectangle,
        Point,
      } from 'pixi.js';
import {Game} from '../game';
import {IEntity, IUnit, teamType} from '../types';
import {ITimeEvent} from '../game-loop';
import {
  normalizeVector,
  isOutOfBOunds,
  wallCollision,
  enemyCollision,
  rectToPoint,
  pointToRect
} from '../functional';

import {Robot} from './robot';
import {config} from '../../config';

export class Melee extends Robot {
  get type() { return 'melee'; }
  get team(): teamType { return 'robot'; }

  _hackResistence() { return 10; }

  private _config: any;
  private _state: 'idle' | 'moving';
  private _speed: Point;
  private _destiny: Point;
  protected _fov: Rectangle;

  _preInit() {
    this._config = config.entities.melee;
    this._state = 'idle';
    this._fov = new Rectangle(0,0,32*4,32*4);
  }

  _changeTeam() {}

  _initBody() {
    return new Rectangle(0, 0, 32, 32);
  }

  _initView() {
    const halfTile = this._config.size / 2;
    return this._addView(new Graphics()
      .beginFill(0xA2A0E5)
      .drawPolygon([
        new Point(0, -halfTile),
        new Point(-halfTile, halfTile),
        new Point(halfTile, halfTile)
      ]));
  }

  _setPosition(pos: Point) {
    this._fov = new Rectangle(pos.x, pos.y, 32*4, 32*4);
    super._setPosition(pos);
  }


  update(time: ITimeEvent) {
    let enemy = enemyCollision(this._game.currentMap, this);

    if (enemy) {
      enemy.hit(this._config.damage);
    } else {
        this._point(this._getDestiny());
        this._setPosition(new Point(
                this.position.x + this._speed.x,
                this.position.y + this._speed.y
              ));
    }
  }

  private _point(pos: Point) {
    let position = this.position;
    this._destiny = pos;

    this._speed = normalizeVector(
      pos.x - position.x,
      pos.y - position.y
    );
    this._speed.x = this._speed.x * this._config.speed;
    this._speed.y = this._speed.y * this._config.speed;
  }

  private _hasDestiny(): boolean {
    return this._destiny &&
           !this._isInDestiny() &&
           !isOutOfBOunds(this._game.currentMap, this.body) &&
           wallCollision(this._game.currentMap, this.body) === null
  }

  private _isInDestiny(): boolean {
    return Math.abs(this._destiny.x - this.position.x) <  Math.abs(this._speed.x) &&
           Math.abs(this._destiny.y - this.position.y) <  Math.abs(this._speed.y)
  }

  private _getDestiny(): Point {
    let destiny;

    this._target = this._getClosestEnemy();

    if (this._target)             destiny = this._target.position;
    else if (!this._hasDestiny()) destiny = this._getRandomDestiny();
    else                          destiny = this._destiny;

    return destiny;
  }

  private _getRandomDestiny() {
    let radius = Math.random()*(this._config.maxWalkDistance - this._config.minWalkDistance) + this._config.minWalkDistance;
    let angle  = Math.random()*2*Math.PI;

    let dX = Math.cos(angle)*radius;
    let dY = Math.sin(angle)*radius;

    return new Point(this.position.x + dX, this.position.y + dY);
  }
}
