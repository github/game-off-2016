import {Graphics, Container, Point, Rectangle} from 'pixi.js';
import {Player} from './entities/player';
import {Game} from './game';
import {config} from '../config';

export class Map {
  private _stage: Container;
  private _map: string[];

  constructor(
    private _game: Game
  ) { }

  get view() { return this._stage; }
  get width() { return config.tileSize * config.gridWidth; }
  get height() { return config.tileSize * config.gridHeight; }

  tileAt(x: number, y: number) {
    x = Math.floor(x / config.tileSize);
    y = Math.floor(y / config.tileSize);
    if (this._map[y][x] === 'X') {
      return new Rectangle(x * config.tileSize, y * config.tileSize, config.tileSize, config.tileSize);
    } else {
      return null;
    }
  }

  loadLevel(level: any) {
    this._map = level.map;
    this._stage = new Container();
    const graphics = new Graphics();
    this._stage.addChild(graphics);
    graphics.beginFill(0xFFFF00);
    for (let row = 0; row < this._map.length; row += 1) {
      for (let tile = 0; tile < this._map[row].length; tile += 1) {
        if (this._map[row][tile] === 'X') {
          graphics.drawRect(config.tileSize * tile, config.tileSize * row, config.tileSize, config.tileSize);
        } else if (this._map[row][tile] === 'P') {
          const player = new Player(this._game);
          player.tile = new Point(tile, row);
          this._stage.addChild(player.view);
        }
      }
    }
  }
}
