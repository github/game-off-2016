import {Graphics, Container, Point, Rectangle} from 'pixi.js';
import {
  Player,
  Ranged
} from './entities';
import {Game} from './game';
import {config} from '../config';
import {
  IEntity
} from './types';

export class Map {
  private _stage: Container;
  private _mapConfig: string[];
  private _map: IEntity[][];
  private _player: Player;
  private _ranged: Ranged[];

  constructor(
    private _game: Game
  ) { }

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

  loadLevel(level: any) {
    this._mapConfig = level.map;
    this._ranged = [];
    this._stage = new Container();
    const graphics = new Graphics();
    this._stage.addChild(graphics);
    this._map = Array.apply(null, Array(config.gridHeight)).map(() => []);
    graphics.beginFill(0xFFFF88);
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
          this._stage.addChild(ranged.view);
          this._ranged.push(ranged);
          this._map[row][tile] = ranged;
        } else if (this._mapConfig[row][tile] === 'P') {
          const player = new Player(this._game);
          player.tile = new Point(tile, row);
          this._stage.addChild(player.view);
          this._player = player;
        }
      }
    }
  }
}
