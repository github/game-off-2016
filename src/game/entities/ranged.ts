import {config} from '../../config';
import {
  Point,
  Rectangle,
  Graphics,
  Circle
} from 'pixi.js';
import {Game} from '../game';
import {IRobot, teamType} from '../types';
import {EnergyBall} from './energyBall';
import {ITimeEvent} from '../game-loop';
import {
  inRange,
  lineOfSight,
  rectToPoint,
  tileToRect,
  tileToCircle
} from '../functional';

export class Ranged implements IRobot {
  get type() { return 'ranged'; }

  private _view: Graphics;
  private _config: any;
  private _body: Rectangle;
  private _range: Circle;
  private _connectLine: Graphics;
  private _state: 'searching' | 'shooting' | 'cooldown';
  private _timer: number;

  get view() { return this._view; }
  get body() { return this._body; }
  get team(): teamType { return 'robot'; }
  get position() { return rectToPoint(this._body); }

  set tile(pos: Point) {
    this._body = tileToRect(pos, this._config.size, this._config.size);
    this._range = tileToCircle(pos, this._config.radius);
    this._updateView();
  }

  constructor(
    private _game: Game
  ) {
    this._config = Object.assign(config.entities.ranged);
    this._state = 'searching';

    this._connectLine = new Graphics();
    const graphics = new Graphics();
    graphics.beginFill(0x00FF00, 0.2);
    graphics.drawCircle( this._config.size / 2, this._config.size / 2, this._config.radius );
    graphics.beginFill(0xFF8888);
    graphics.drawCircle( this._config.size / 2, this._config.size / 2, this._config.size / 2 );
    this._view = graphics;
    this._game.currentMap.view.addChild(this._connectLine);

    this.tile = new Point();
    this._updateView();

    _game.gameLoop$.subscribe(e => this.update(e));
  }

  hack() {}
  hit() {}

  update(time: ITimeEvent) {
    if (this._playerInRange()) {
      let player = this._game.currentMap.player;
      this._connectLine.clear();
      this._connectLine.lineStyle(1, 0x00FF00, 1);
      this._connectLine.moveTo(
        this.position.x,
        this.position.y
      );
      this._connectLine.lineTo(player.position.x, player.position.y);
      this._connectLine.lineWidth = 3;
    } else {
      this._connectLine.clear();
    }
    if (this._state === 'searching' && this._playerInRange()) {
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
    this._game.currentMap.view.addChild(shoot.view);
  }

  private _playerInRange(): boolean {
    return inRange(this._range, this._game.currentMap.player.body) &&
           lineOfSight(this._game.currentMap,
             this._range.x, this._range.y,
             this._game.currentMap.player.position.x,
             this._game.currentMap.player.position.y
           );
  }
}
