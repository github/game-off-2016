import {Graphics, Container, Point} from 'pixi.js';
import {Player} from './entities/player';
import {Game} from './game';

export class Map {
  private _stage: Container;

  constructor(
    private _game: Game
  ) { }

  get view() { return this._stage; }

  loadLevel(config: any) {
    let map = config.map;
    this._stage = new Container();
    const graphics = new Graphics();
    this._stage.addChild(graphics);
    graphics.beginFill(0xFFFF00);
    for (let row = 0; row < map.length; row += 1) {
      for (let tile = 0; tile < map[row].length; tile += 1) {
        if (map[row][tile] === 'X') {
          graphics.drawRect(32 * tile, 32 * row, 32, 32);
        } else if (map[row][tile] === 'P') {
          const player = new Player(this._game);
          player.tile = new Point(tile, row);
          this._stage.addChild(player.view);
        }
      }
    }
  }
}
