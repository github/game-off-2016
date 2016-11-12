import {
  Graphics,
  Container,
  Point,
  Rectangle
} from 'pixi.js';
import {
  Player,
  Ranged
} from './entities';
import {Game} from './game';
import {config} from '../config';
import {
  IEntity,
  IUnit
} from './types';

export class Map {
  private _mapConfig: string[];
  private _map: IEntity[][];
  private _player: Player;
  private _ranged: Ranged[];
  private _entities: IEntity[];

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

  unitAt(x: number, y: number): IEntity {
    for (let ranged of this._ranged) {
      if (ranged.body.contains(x, y)) {
        return ranged;
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
        this._bodyLayer.beginFill(0xAA7722, 0.2);
        this._bodyLayer.lineStyle(1, 0xAA7722, 0.8);
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
        this._bodyLayer.moveTo(
          entity.position.x,
          entity.position.y
        );
        this._bodyLayer.lineTo(target.position.x, target.position.y);
      }
    }
  }

  addEntity(entity: IEntity) {
    this._viewLayer.addChild(entity.view);
    this._entities.push(entity);
  }

  removeEntity(entity: IEntity) {
    this._viewLayer.removeChild(entity.view);
    const index = this._entities.indexOf(entity);
    if (index > -1) {
      this._entities.splice(index, 1);
    }
  }

  loadLevel(level: any) {
    this._mapConfig = level.map;
    this._map = Array.apply(null, Array(config.gridHeight)).map(() => []);
    this._ranged = [];
    this._entities = [];

    this._stage = new Container();
    const graphics = new Graphics();
    graphics.beginFill(0xFFFF88);
    if (config.drawView) {
      this._viewLayer = new Container();
      this._stage.addChild(this._viewLayer);
      this._viewLayer.addChild(graphics);
    }

    if (config.drawBodies) {
      this._bodyLayer = new Graphics();
      this._stage.addChild(this._bodyLayer);
    }

    for (let row = 0; row < this._mapConfig.length; row += 1) {
      for (let tile = 0; tile < this._mapConfig[row].length; tile += 1) {
        if (this._mapConfig[row][tile] === 'X') {
          graphics.drawRect(config.tileSize * tile, config.tileSize * row, config.tileSize, config.tileSize);
          this._map[row][tile] = {
            type: 'block',
            team: 'neutral',
            set tile(v) {},
            set position(v) {},
            update() {},
            view: null,
            body: new Rectangle(config.tileSize * tile, config.tileSize * row, config.tileSize, config.tileSize)
          };
        }

        if (this._mapConfig[row][tile] === 'T') {
          const ranged = new Ranged(this._game);
          ranged.tile = new Point(tile, row);
          this._ranged.push(ranged);
          this._map[row][tile] = ranged;
          this._entities.push(ranged);
          if (config.drawView) {
            this._viewLayer.addChild(ranged.view);
          }
        } else if (this._mapConfig[row][tile] === 'P') {
          const player = new Player(this._game);
          player.tile = new Point(tile, row);
          this._player = player;
          this._entities.push(player);
          if (config.drawView) {
            this._viewLayer.addChild(player.view);
          }
        }
      }
    }
  }
}
