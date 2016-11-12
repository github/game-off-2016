import {config} from '../../config';
import {
  Point,
  Rectangle,
  Graphics,
  Circle,
  Container
} from 'pixi.js';
import {Game} from '../game';
import {IEntity, IRobot, teamType} from '../types';
import {EnergyBall} from './energyBall';
import {ITimeEvent} from '../game-loop';
import {
  inRange,
  lineOfSight,
  rectToPoint,
  tileToRect,
  tileToCircle
} from '../functional';
import {HackMeter} from '../ui';

export class Ranged implements IRobot {
  get type() { return 'ranged'; }

  private _view: Container;
  private _config: any;
  private _body: Rectangle;
  private _fov: Circle;
  private _state: 'searching' | 'shooting' | 'cooldown';
  private _timer: number;
  private _target: IEntity;
  private _hackMeter: number;
  private _hackMeterView: HackMeter;
  private _team: teamType;
  private _graphics: Graphics;

  get view() { return this._view; }
  get body() { return this._body; }
  get team(): teamType { return this._team; }
  get fov() { return this._fov; }
  get target() { return this._target; }
  get position() { return rectToPoint(this._body); }

  set tile(pos: Point) {
    this._body = tileToRect(pos, this._config.size, this._config.size);
    this._fov = tileToCircle(pos, this._config.radius);
    this._updateView();
  }

  constructor(
    private _game: Game
  ) {
    this._config = Object.assign(config.entities.ranged);
    this._state = 'searching';
    this._team = 'robot';
    this._hackMeter = 0;

    this._graphics = new Graphics();
    this._graphics.beginFill(0xA2A0E5);
    this._graphics.drawCircle( this._config.size / 2, this._config.size / 2, this._config.size / 2 );
    this._view = new Container();
    this._view.addChild(this._graphics);
    this._hackMeterView = new HackMeter();
    this._view.addChild(this._hackMeterView.view);

    this.tile = new Point();
    this._updateView();

    _game.gameLoop$.subscribe(e => this.update(e));
  }

  hack(value: number) {
    this._hackMeter += value;
    if (this._hackMeter >= this._config.hackMeter) {
      this._hackMeter = 0;
      this._team = 'hacker';
      this._state = 'searching';
      this._graphics.clear();
      this._graphics.beginFill(0x63DAE6);
      this._graphics.drawCircle( this._config.size / 2, this._config.size / 2, this._config.size / 2 );
    }
    this._hackMeterView.setProgress(this._hackMeter / this._config.hackMeter);
  }

  hit() {}

  update(time: ITimeEvent) {
    if (this._team !== 'hacker' && this._playerInRange()) {
      this._target = this._game.currentMap.player;
    } else {
      this._target = null;
    }
    if (this._state === 'searching' && this._target) {
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

  private _updateView() {
    this._view.position.x = this._body.x;
    this._view.position.y = this._body.y;
  }

  private _shoot() {
    let shoot = new EnergyBall(this._game);
    shoot.position = this.position;
    shoot.setTarget(this._game.currentMap.player);
    this._game.currentMap.addEntity(shoot);
  }

  private _playerInRange(): boolean {
    return inRange(this._fov, this._game.currentMap.player.body) &&
           lineOfSight(this._game.currentMap,
             this._fov.x, this._fov.y,
             this._game.currentMap.player.position.x,
             this._game.currentMap.player.position.y
           );
  }
}
