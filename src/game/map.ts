import {Graphics, Container, Point, Rectangle} from 'pixi.js';
import {
  Player,
  Ranged
} from './entities';
import {Game} from './game';
import {config} from '../config';

export class Map {
  private _stage: Container;
  private _map: string[];
  private _player: Player;
  private _ranged: Ranged[];

  constructor(
    private _game: Game
  ) { }

  get view() { return this._stage; }
  get width() { return config.tileSize * config.gridWidth; }
  get height() { return config.tileSize * config.gridHeight; }
  get player() { return this._player; }

  tileAt(x: number, y: number) {
    x = Math.floor(x / config.tileSize);
    y = Math.floor(y / config.tileSize);
    if (this._map[y] && (this._map[y][x] === 'X' || this._map[y][x] === 'T')) {
      return new Rectangle(x * config.tileSize, y * config.tileSize, config.tileSize, config.tileSize);
    } else {
      return null;
    }
  }

  loadLevel(level: any) {
    this._map = level.map;
    this._ranged = [];
    this._stage = new Container();
    const graphics = new Graphics();
    this._stage.addChild(graphics);
    graphics.beginFill(0xFFFF88);
    for (let row = 0; row < this._map.length; row += 1) {
      for (let tile = 0; tile < this._map[row].length; tile += 1) {
        if (this._map[row][tile] === 'X') {
          graphics.drawRect(config.tileSize * tile, config.tileSize * row, config.tileSize, config.tileSize);
        }

        if (this._map[row][tile] === 'T') {
          const ranged = new Ranged(this._game);
          ranged.tile = new Point(tile, row);
          this._stage.addChild(ranged.view);
          this._ranged.push(ranged);
        } else if (this._map[row][tile] === 'P') {
          const player = new Player(this._game);
          player.tile = new Point(tile, row);
          this._stage.addChild(player.view);
          this._player = player;
        }
      }
    }
  }
}
