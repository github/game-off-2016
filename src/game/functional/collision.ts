import {Map} from '../map';
import {Rectangle, Circle} from 'pixi.js';

export function isOutOfBOunds(map: Map, body: Rectangle) {
  return body.x < 0 || body.y < 0 || body.right > map.width || body.bottom > map.height;
}

export function fixOutOfBOunds(map: Map, body: Rectangle) {
  let newBody = body.clone();
  if (newBody.x < 0) { newBody.x = 0; }
  if (newBody.y < 0) { newBody.y = 0; }
  if (newBody.right > map.width) { newBody.x = map.width - newBody.width; }
  if (newBody.bottom > map.height) { newBody.y = map.height - newBody.height; }
  return newBody;
}

export function wallAt(map: Map, x, y) {
  let tile = map.tileAt(x, y);
  if (tile && tile.type !== 'block') {
    tile = null;
  }
  return tile;
}

export function wallCollision(map: Map, body: Rectangle) {
  return wallAt(map, body.right, body.bottom) ||
         wallAt(map, body.left, body.bottom) ||
         wallAt(map, body.right, body.top) ||
         wallAt(map, body.left, body.top);
}

export function moveBody(map: Map, body: Rectangle, dx: number, dy: number) {
  let newBody = body.clone();
  let tile;

  // Y movement
  newBody.y += dy;
  tile = wallCollision(map, newBody);
  if (tile !== null) {
    let tileBody = tile.body;
    if (dy > 0) {
      newBody.y = tileBody.y - newBody.height - 1;
    } else {
      newBody.y = tileBody.y + tileBody.height + 1;
    }
  }
  // X movement
  newBody.x += dx;
  tile = wallCollision(map, newBody);
  if (tile !== null) {
    let tileBody = tile.body;
    if (dx > 0) {
      newBody.x = tileBody.x - newBody.width - 1;
    } else {
      newBody.x = tileBody.x + tileBody.width + 1;
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
    if (tile !== null && tile.type === 'block' && !tile.body.contains(x0, y0) && !tile.body.contains(x1, y1)) {
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
