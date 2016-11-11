import {Graphics, Rectangle, Point} from 'pixi.js';
import {Game} from '../game';
import {IEntity} from '../types';
import {ITimeEvent} from '../game-loop';
import {config} from '../../config';
import {
  normalizeVector,
  isOutOfBOunds,
  wallCollision,
  enemyCollision
} from '../functional';
import {Subscription} from 'rxjs/Rx';

export class EnergyBall implements IEntity {
  private _speed: Point;
  private _body: Rectangle;
  private _view: Graphics;
  private config: any;
  private _subscription: Subscription;

  set tile(pos: Point) { }
  set position(pos: Point) {
    this._body.x = pos.x - this._body.width / 2;
    this._body.y = pos.y - this._body.height / 2;
    this._view.position.x = this._body.x;
    this._view.position.y = this._body.y;
  }

  get position() {
    return new Point(
      this._body.x + this._body.width / 2,
      this._body.y + this._body.height / 2
    );
  }

  get view() { return this._view; }
  get body() { return this._body; }
  setTarget(entity: IEntity) {
    let position = this.position;
    let targetPosition = entity.position;
    let vectorX = targetPosition.x - position.x;
    let vectorY = targetPosition.y - position.y;
    this._speed = normalizeVector(vectorX, vectorY);
    this._speed.x = this._speed.x * this.config.speed;
    this._speed.y = this._speed.y * this.config.speed;
  }

  constructor(private _game: Game) {
    this.config = Object.assign(config.entities.energyBall);
    this._body = new Rectangle(0, 0, this.config.size, this.config.size);
    const graphics = new Graphics();
    graphics.beginFill(0xFFFFFF);
    graphics.drawCircle( this.config.size / 2, this.config.size / 2, this.config.size / 2 );
    this._view = graphics;
    this._view.position.x = this._body.x;
    this._view.position.y = this._body.y;

    this.update = this.update.bind(this);
    this._subscription = _game.gameLoop$.subscribe(this.update);
  }

  hit() {}

  update(time: ITimeEvent) {
    let enemy = enemyCollision(this._game.currentMap, this);
    if (
      isOutOfBOunds(this._game.currentMap, this._body) ||
      wallCollision(this._game.currentMap, this._body) ||
      enemy
    ) {
      if (enemy) {
        enemy.hit(this.config.damage);
      }
      this._view.destroy();
      this._subscription.unsubscribe();
    } else if (this._speed) {
      this._body.x = this._body.x + this._speed.x;
      this._body.y = this._body.y + this._speed.y;
      this._view.position.x = this._body.x;
      this._view.position.y = this._body.y;
    }
  }
}
