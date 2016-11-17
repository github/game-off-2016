import {Graphics, Rectangle, Point} from 'pixi.js';
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

  _preInit() {
    this._config = config.entities.melee;
    this._state = 'idle';
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

  private _getRandomPoint() {
    return new Point(
      this.position.x + (-this._config.walkDistance + 2 * this._config.walkDistance * Math.random()),
      this.position.y + (-this._config.walkDistance + 2 * this._config.walkDistance * Math.random())
    );
  }

  // moveToLocation(pos: Point) {
  //   let position = this.position;
  //   let targetPosition = entity.position;
  //   this._speed = normalizeVector(
  //     targetPosition.x - position.x,
  //     targetPosition.y - position.y
  //   );
  //   this._speed.x = this._speed.x * this._config.speed;
  //   this._speed.y = this._speed.y * this._config.speed;
  // }
  //
  // update(time: ITimeEvent) {
  //   let enemy = enemyCollision(this._game.currentMap, this);
  //   if (
  //     isOutOfBOunds(this._game.currentMap, this.body) ||
  //     wallCollision(this._game.currentMap, this.body) ||
  //     enemy !== null
  //   ) {
  //     if (enemy) {
  //       enemy.hit(this._config.damage);
  //     }
  //     this.destroy();
  //   } else if (this._speed) {
  //     this.position = new Point(
  //       this.position.x + this._speed.x,
  //       this.position.y + this._speed.y,
  //     );
  //   }
  // }

}
