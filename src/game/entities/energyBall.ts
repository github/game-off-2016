import {Graphics, Rectangle, Point} from 'pixi.js';
import {Game} from '../game';
import {IEntity, teamType} from '../types';
import {ITimeEvent} from '../game-loop';
import {config} from '../../config';
import {
  normalizeVector,
  isOutOfBOunds,
  wallCollision,
  enemyCollision,
  rectToPoint,
  pointToRect
} from '../functional';
import {Subscription} from 'rxjs/Rx';

export class EnergyBall implements IEntity {
  get type() { return 'energyBall'; }

  private _speed: Point;
  private _body: Rectangle;
  private _view: Graphics;
  private _config: any;
  private _subscription: Subscription;

  get view() { return this._view; }
  get body() { return this._body; }
  get team(): teamType { return 'robot'; }
  get position() { return rectToPoint(this._body); }

  set tile(pos: Point) { }
  set position(pos: Point) {
    this._body = pointToRect(pos, this._config.size, this._config.size);
    this._updateView();
  }

  constructor(private _game: Game) {
    this._config = Object.assign(config.entities.energyBall);

    const graphics = new Graphics();
    graphics.beginFill(0xFFFFFF);
    graphics.drawCircle( this._config.size / 2, this._config.size / 2, this._config.size / 2 );
    this._view = graphics;

    this.position = new Point();
    this._updateView();

    this._subscription = _game.gameLoop$.subscribe(e => this.update(e));
  }

  hit() {}

  update(time: ITimeEvent) {
    let enemy = enemyCollision(this._game.currentMap, this);
    if (
      isOutOfBOunds(this._game.currentMap, this._body) ||
      wallCollision(this._game.currentMap, this._body) ||
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

  setTarget(entity: IEntity) {
    let position = this.position;
    let targetPosition = entity.position;
    this._speed = normalizeVector(
      targetPosition.x - position.x,
      targetPosition.y - position.y
    );
    this._speed.x = this._speed.x * this._config.speed;
    this._speed.y = this._speed.y * this._config.speed;
  }

  destroy() {
    this._game.currentMap.removeEntity(this);
    this._view.destroy();
    this._subscription.unsubscribe();
  }

  private _updateView() {
    this._view.position.x = this._body.x;
    this._view.position.y = this._body.y;
  }
}
