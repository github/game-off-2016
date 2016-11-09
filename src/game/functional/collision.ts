import {Map} from '../map';
import {Rectangle} from 'pixi.js';
export function moveBody(map: Map, body: Rectangle, dx: number, dy: number) {
  let newBody = body.clone();
  newBody.y += dy;
  if (dy > 0) {
    let tile = map.tileAt(newBody.right, newBody.bottom) || map.tileAt(newBody.left, newBody.bottom);
    if (tile) {
      newBody.y = tile.y - newBody.height - 1;
    }
  }

  if (dy < 0) {
    let tile = map.tileAt(newBody.left, newBody.top) || map.tileAt(newBody.right, newBody.top);
    if (tile) {
      newBody.y = tile.y + tile.height + 1;
    }
  }

  newBody.x += dx;
  if (dx > 0) {
    let tile = map.tileAt(newBody.right, newBody.top) || map.tileAt(newBody.right, newBody.bottom);
    if (tile) {
      newBody.x = tile.x - newBody.width - 1;
    }
  }

  if (dx < 0) {
    let tile = map.tileAt(newBody.left, newBody.top) || map.tileAt(newBody.left, newBody.bottom);
    if (tile) {
      newBody.x = tile.x + tile.width + 1;
    }
  }


  // fix out of bounds
  if (newBody.x < 0) { newBody.x = 0; }
  if (newBody.y < 0) { newBody.y = 0; }
  if (newBody.right > map.width) { newBody.x = map.width - newBody.width; }
  if (newBody.bottom > map.height) { newBody.y = map.height - newBody.height; }

  return newBody;
}
