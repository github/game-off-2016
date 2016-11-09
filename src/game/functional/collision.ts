import {Map} from '../map';
import {Rectangle, Circle} from 'pixi.js';

export function fixOutOfBOunds(map: Map, body: Rectangle) {
  let newBody = body.clone();
  if (newBody.x < 0) { newBody.x = 0; }
  if (newBody.y < 0) { newBody.y = 0; }
  if (newBody.right > map.width) { newBody.x = map.width - newBody.width; }
  if (newBody.bottom > map.height) { newBody.y = map.height - newBody.height; }
  return newBody;
}

export function wallCollision(map: Map, body: Rectangle) {
  return map.tileAt(body.right, body.bottom) ||
         map.tileAt(body.left, body.bottom) ||
         map.tileAt(body.right, body.top) ||
         map.tileAt(body.left, body.top);
}

export function moveBody(map: Map, body: Rectangle, dx: number, dy: number) {
  let newBody = body.clone();
  let tile;
  // Y movement
  newBody.y += dy;
  tile = wallCollision(map, newBody);
  if (tile !== null) {
    if (dy > 0) {
      newBody.y = tile.y - newBody.height - 1;
    } else {
      newBody.y = tile.y + tile.height + 1;
    }
  }
  // X movement
  newBody.x += dx;
  tile = wallCollision(map, newBody);
  if (tile !== null) {
    if (dx > 0) {
      newBody.x = tile.x - newBody.width - 1;
    } else {
      newBody.x = tile.x + tile.width + 1;
    }
  }
  return fixOutOfBOunds(map, newBody);
}

export function inRange(range: Circle, body: Rectangle) {
  return range.contains(body.left, body.bottom) ||
         range.contains(body.right, body.bottom) ||
         range.contains(body.left, body.top) ||
         range.contains(body.right, body.top);
}

export function lineOfSight(map: Map, x0: number, y0: number, x1: number, y1: number): boolean {
  let los = true;
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  let x = x0;
  let y = y0;
  let n = 1 + dx + dy;
  let xInc = (x1 > x0) ? 1 : -1;
  let yInc = (y1 > y0) ? 1 : -1;
  let error = dx - dy;
  dx *= 2;
  dy *= 2;
  for (; n > 0; --n) {
    let tile = map.tileAt(x, y);
    if (tile !== null && !tile.contains(x0, y0) && !tile.contains(x1, y1)) {
      los = false;
      break;
    }
    if (error > 0) {
      x += xInc;
      error -= dy;
    } else if (error < 0) {
      y += yInc;
      error += dx;
    } else {
      x += xInc;
      y += yInc;
      n--;
    }
  }
  return los;
}
