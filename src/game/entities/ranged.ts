import {config} from '../../config';
import {Point, Rectangle, Graphics, Circle} from 'pixi.js';
import {Game} from '../game';
import {IEntity} from '../types';
import {EnergyBall} from './energyBall';
import {ITimeEvent} from '../game-loop';
import {
  inRange,
  lineOfSight
} from '../functional';

export class Ranged implements IEntity {
  private _view: Graphics;
  private config: any;
  private _body: Rectangle;
  private _range: Circle;
  private _connectLine: Graphics;
  private _state: 'searching' | 'shooting' | 'cooldown';
  private _timer: number;

  get view() { return this._view; }
  get body() { return this._body; }
  get type() { return 'ranged'; }

  set tile(pos: Point) {
    this._body.x = config.tileSize * pos.x;
    this._body.y = config.tileSize * pos.y;
    this._view.position.x = this._body.x + (config.tileSize) / 2;
    this._view.position.y = this._body.y + (config.tileSize) / 2;
    this._range.x = this._body.x + (config.tileSize) / 2;
    this._range.y = this._body.y + (config.tileSize) / 2;
  }

  get position() {
    return new Point(
      this._body.x + this._body.width / 2,
      this._body.y + this._body.height / 2
    );
  }

  constructor(
    private _game: Game
  ) {
    this._state = 'searching';
    this.config = Object.assign(config.entities.ranged);
    this._body = new Rectangle(0, 0, this.config.size, this.config.size);
    this._range = new Circle(0, 0, config.tileSize * this.config.radius );
    this._connectLine = new Graphics();
    const graphics = new Graphics();
    graphics.beginFill(0x00FF00, 0.2);
    graphics.drawCircle( 0, 0, config.tileSize * this.config.radius );
    graphics.beginFill(0xFF8888);
    graphics.drawCircle( 0, 0, config.tileSize / 2 );

    this._view = graphics;
    this._view.position.x = this._body.x;
    this._view.position.y = this._body.y;

    this.update = this.update.bind(this);
    _game.gameLoop$.subscribe(this.update);
  }

  hit() {}

  update(time: ITimeEvent) {
    if (this._playerInRange()) {
      let player = this._game.currentMap.player.body;
      this._connectLine.clear();
      this._connectLine.lineStyle(1, 0x00FF00, 1);
      this._connectLine.moveTo(
        this._body.x + this._body.width / 2,
        this._body.y + this._body.height / 2
      );
      this._connectLine.lineTo(player.x + player.width / 2, player.y  + player.height / 2);
      this._connectLine.lineWidth = 3;
      this._game.currentMap.view.addChild(this._connectLine);
    } else {
      this._game.currentMap.view.removeChild(this._connectLine);
    }
    if (this._state === 'searching' && this._playerInRange()) {
      this._state = 'shooting';
      this._timer = this.config.shootDelay;
    }
    if (this._state === 'shooting' && this._timer < 0) {
        this._state = 'cooldown';
        this._timer = this.config.shootCooldown;
        this._shoot();
    }
    if (this._state === 'cooldown' && this._timer < 0) {
        this._state = 'searching';
    }
    this._timer -= time.delta;
  }

  private _shoot() {
    let shoot = new EnergyBall(this._game);
    shoot.position = new Point(
      this._body.x + this._body.width / 2,
      this._body.y + this._body.height / 2
    );
    shoot.setTarget(this._game.currentMap.player);
    this._game.currentMap.view.addChild(shoot.view);
  }

  private _playerInRange(): boolean {
    return inRange(this._range, this._game.currentMap.player.body) &&
           lineOfSight(this._game.currentMap,
             this._range.x, this._range.y,
             this._game.currentMap.player.body.x + this._game.currentMap.player.body.width / 2,
             this._game.currentMap.player.body.y + this._game.currentMap.player.body.height / 2
           );
  }
}
