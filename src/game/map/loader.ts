const {Graphics, Container, Texture, Sprite} = PIXI;

export function load(map: string[]) {
  const stage = new Container();
  const graphics = new Graphics();
  stage.addChild(graphics);
  graphics.beginFill(0xFFFF00);
  for (let row = 0; row < map.length; row += 1) {
    for (let tile = 0; tile < map[row].length; tile += 1) {
      if (map[row][tile] === 'X') {
        graphics.drawRect(32 * tile, 32 * row, 32, 32);
      } else if (map[row][tile] === 'P') {
        var texture = Texture.fromImage('assets/basics/nin.png');
        var player = new Sprite(texture);
        player.anchor.x = 0;
        player.anchor.y = 0;
        player.position.x = 32 * tile + (32 - 24) / 2;
        player.position.y = 32 * row + (32 - 24);
        stage.addChild(player);
      }
    }
  }
  return stage;
}
