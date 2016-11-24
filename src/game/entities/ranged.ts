import {config} from '../../config';
import {
  Point,
  Rectangle,
  Graphics,
  Circle
} from 'pixi.js';
import {IEntity, teamType} from '../types';
import {EnergyBall} from './energyBall';
import {ITimeEvent} from '../game-loop';
import {
  collide,
  isInLOS,
  getDistance,
  pointToCircle
} from '../functional';

import {Robot} from './robot';

export class Ranged extends Robot {
  get type() { return 'ranged'; }
  get team(): teamType { return this._team; }

  private _config: any;
  private _fov: Circle;
  private _state: 'searching' | 'shooting' | 'cooldown';
  private _timer: number;
  private _target: IEntity;
  private _targetPosition: Point;
  private _team: teamType;
  private _graphics: Graphics;

  _hackResistence() { return this._config.hackMeter; }

  _changeTeam() {
    this._team = 'hacker';
    this._state = 'searching';
    this._graphics.clear();
    this._graphics.beginFill(0x63DAE6);
    this._graphics.drawCircle( 0, 0, this._config.size / 2 );
  }

  get fov() { return this._fov; }
  get target() { return this._target; }

  _preInit() {
    this._config = Object.assign({}, config.entities.ranged);
    this._state = 'searching';
    this._team = 'robot';
    this._fov = pointToCircle(new Point(0, 0), this._config.radius);
  }

  _initBody() {
    return new Rectangle(0, 0, this._config.size, this._config.size);
  }

  _initView() {
    this._graphics = new Graphics();
    this._graphics.beginFill(0xA2A0E5);
    this._graphics.drawCircle( 0, 0, this._config.size / 2 );
    return this._addView(this._graphics);
  }

  _setPosition(pos: Point) {
    this._fov = pointToCircle(pos, this._config.radius);
    super._setPosition(pos);
  }

  update(time: ITimeEvent) {
    this._target = this._getClosestEnemy();

    if (this._state === 'searching' && this._target) {
      this._targetPosition = this._target.position;
      this._state = 'shooting';
      this._timer = this._config.shootDelay;
    }
    if (this._state === 'shooting' && this._timer < 0) {
        this._state = 'cooldown';
        this._timer = this._config.shootCooldown;
        this._shoot();
    }
    if (this._state === 'cooldown' && this._timer < 0) {
        this._state = 'searching';
    }
    this._timer -= time.delta;
  }

  private _shoot() {
    let shoot = new EnergyBall(this._game);
    shoot.position = this.position;
    shoot.setTarget(this._targetPosition);
    this._game.currentMap.addEntity(shoot);
  }

  private _getClosestEnemy(): IEntity {
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
