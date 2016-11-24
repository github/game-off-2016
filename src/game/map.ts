import {
  Graphics,
  Container,
  Point
} from 'pixi.js';
import {
  Player,
  Ranged,
  Melee,
  Wall
} from './entities';
import {Game} from './game';
import {config} from '../config';
import {
  IEntity,
  IUnit
} from './types';
import {Robot} from './entities/robot';

export class Map {
  private _mapConfig: string[];
  private _map: IEntity[][];
  private _player: Player;
  private _entities: IEntity[];
  private _robots: Robot[];

  private _stage: Container;
  private _viewLayer: Container;
  private _bodyLayer: Graphics;

  constructor(
    private _game: Game
  ) {
    if (config.drawBodies) {
      _game.preRenderLoop$.subscribe(e => this.update(e));
    }
  }

  get view() { return this._stage; }
  get width() { return config.tileSize * config.gridWidth; }
  get height() { return config.tileSize * config.gridHeight; }
  get player() { return this._player; }
  get robots() { return this._robots; }

  unitAt(point: Point, team?: string): IEntity {
    for (let unit of this._robots) {
      if (unit.body.contains(point.x, point.y) && (!team || unit.team === team)) {
        return unit;
      }
    }
    return null;
  }

  tileAt(x: number, y: number) {
    x = Math.floor(x / config.tileSize);
    y = Math.floor(y / config.tileSize);
    return (this._map[y] ? this._map[y][x] : null) || null;
  }

  update(time) {
    this._bodyLayer.clear();
    for (let entity of this._entities) {
      let fov = (<IUnit>entity).fov;
      if (fov) {
        this._bodyLayer.beginFill(0xFFFF00, 0.2);
        this._bodyLayer.lineStyle(1, 0xFFFF00, 0.8);
        this._bodyLayer.drawShape(fov);
      }
    }
    for (let entity of this._entities) {
      let body = entity.body;
      if (body) {
        this._bodyLayer.beginFill(0x00FF00, 0.2);
        this._bodyLayer.lineStyle(1, 0x00FF00, 0.8);
        this._bodyLayer.drawShape(body);
      }
    }

    for (let entity of this._entities) {
      let target = (<IUnit>entity).target;
      if (target) {
        this._bodyLayer.lineStyle(1, 0x00FFFF, 0.8);
        this._bodyLayer.moveTo(entity.position.x, entity.position.y);
        this._bodyLayer.lineTo(target.position.x, target.position.y);
      }
    }
    for (let entity of this._entities) {
      let hitbox = (<IUnit>entity).hitbox;
      if (hitbox) {
        this._bodyLayer.beginFill(0xFF2222, 0.2);
        this._bodyLayer.lineStyle(1, 0xFF2222, 0.8);
        this._bodyLayer.drawShape(hitbox);
      }
    }
  }

  addEntity(entity: IEntity) {
    this._entities.push(entity);
    if (config.drawView) {
      this._viewLayer.addChild(entity.view);
    }
    if (entity instanceof Robot) {
      this._robots.push(entity);
    }
  }

  removeEntity(entity: IEntity) {
    const index = this._entities.indexOf(entity);
    if (index > -1) {
      this._entities.splice(index, 1);
    }
    if (config.drawView) {
      this._viewLayer.removeChild(entity.view);
    }
  }

  loadLevel(level: any) {
    this._mapConfig = level.map;
    this._map = Array.apply(null, Array(config.gridHeight)).map(() => []);
    this._entities = [];
    this._robots = [];

    this._stage = new Container();
    if (config.drawView) {
      this._viewLayer = new Container();
      this._stage.addChild(this._viewLayer);
    }

    if (config.drawBodies) {
      this._bodyLayer = new Graphics();
      this._stage.addChild(this._bodyLayer);
    }

    for (let row = 0; row < this._mapConfig.length; row += 1) {
      for (let tile = 0; tile < this._mapConfig[row].length; tile += 1) {
        let entity: IEntity = null;
        if (this._mapConfig[row][tile] === 'X') {
          entity = new Wall(this._game);
          this._map[row][tile] = entity;
        } else if (this._mapConfig[row][tile] === 'T') {
          entity = new Ranged(this._game);
          this._map[row][tile] = entity;
        } else if (this._mapConfig[row][tile] === 'P') {
          entity = new Player(this._game);
          this._player = <Player>entity;
        } else if (this._mapConfig[row][tile] === 'M') {
          entity = new Melee(this._game);
        }
        if (entity) {
          entity.tile = new Point(tile, row);
          this.addEntity(entity);
        }
      }
    }
  }

}
