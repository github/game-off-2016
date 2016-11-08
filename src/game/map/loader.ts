const {Graphics, Container, Texture, Sprite} = PIXI;
import {Player} from '../entities/player';
import {GameLoop} from '../util/game-loop';

export function load(map: string[], gl: GameLoop) {
  const stage = new Container();
  const graphics = new Graphics();
  stage.addChild(graphics);
  graphics.beginFill(0xFFFF00);
  for (let row = 0; row < map.length; row += 1) {
    for (let tile = 0; tile < map[row].length; tile += 1) {
      if (map[row][tile] === 'X') {
        graphics.drawRect(32 * tile, 32 * row, 32, 32);
      } else if (map[row][tile] === 'P') {
        const player = new Player(gl);
        player.tile = new PIXI.Point(tile, row);
        stage.addChild(player.view);
      }
    }
  }
  return stage;
}
