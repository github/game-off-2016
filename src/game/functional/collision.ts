import {
  IEntity,
  IUnit
} from '../types';
import {Map} from '../map';
import {Rectangle, Circle, Ellipse, Polygon, IHitArea, SHAPES} from 'pixi.js';

export function isOutOfBOunds(map: Map, body: Rectangle): boolean {
  return body.x < 0 || body.y < 0 || body.right > map.width || body.bottom > map.height;
}

export function fixOutOfBOunds(map: Map, body: Rectangle): Rectangle {
  let newBody = body.clone();
  if (newBody.x < 0) { newBody.x = 0; }
  if (newBody.y < 0) { newBody.y = 0; }
  if (newBody.right > map.width) { newBody.x = map.width - newBody.width; }
  if (newBody.bottom > map.height) { newBody.y = map.height - newBody.height; }
  return newBody;
}

export function wallAt(map: Map, x: number, y: number, rangedAsWalls = false): IEntity {
  let tile = map.tileAt(x, y);
  if (tile && !rangedAsWalls && tile.type !== 'block') {
    tile = null;
  }
  return tile;
}

export function wallCollision(map: Map, body: Rectangle, rangedAsWalls = false): IEntity {
  return wallAt(map, body.right, body.bottom, rangedAsWalls) ||
         wallAt(map, body.left, body.bottom, rangedAsWalls) ||
         wallAt(map, body.right, body.top, rangedAsWalls) ||
         wallAt(map, body.left, body.top, rangedAsWalls);
}

export function enemyCollision(map: Map, entity: IEntity): IUnit {
  let playerBody = map.player.body;
  return rectsCollide(<Rectangle>entity.body, playerBody) ? map.player : null;
}

export function moveBody(map: Map, body: Rectangle, dx: number, dy: number): Rectangle {
  let newBody = body.clone();
  let tile;

  // Y movement
  newBody.y += dy;
  tile = wallCollision(map, newBody, true);
  if (tile !== null) {
    let tileBody = <Rectangle>tile.body;
    if (dy > 0) {
      newBody.y = tileBody.y - newBody.height - 1;
    } else {
      newBody.y = tileBody.y + tileBody.height + 1;
    }
  }
  // X movement
  newBody.x += dx;
  tile = wallCollision(map, newBody, true);
  if (tile !== null) {
    let tileBody = <Rectangle>tile.body;
    if (dx > 0) {
      newBody.x = tileBody.x - newBody.width - 1;
    } else {
      newBody.x = tileBody.x + tileBody.width + 1;
    }
  }
  return fixOutOfBOunds(map, newBody);
}

function _rectsCollide(rect1: Rectangle, rect2: Rectangle): boolean {
  return rect1.contains(rect2.left, rect2.top) ||
         rect1.contains(rect2.left, rect2.bottom) ||
         rect1.contains(rect2.right, rect2.top) ||
         rect1.contains(rect2.right, rect2.bottom);
}

export function rectsCollide(rect1: Rectangle, rect2: Rectangle): boolean {
  return _rectsCollide(rect1, rect2) || _rectsCollide(rect2, rect1);
}

export function rectCircCollide(rect: Rectangle, circ: Circle): boolean {
  return circ.contains(rect.left, rect.bottom) ||
         circ.contains(rect.right, rect.bottom) ||
         circ.contains(rect.left, rect.top) ||
         circ.contains(rect.right, rect.top);
}

export function rectPolyCollide(rect: Rectangle, poly: Polygon): boolean {
  return poly.contains(rect.left, rect.top) ||
         poly.contains(rect.left, rect.bottom) ||
         poly.contains(rect.right, rect.top) ||
         poly.contains(rect.right, rect.bottom);
}

export function circsCollide(circ1: Circle, circ2: Circle): boolean {
  return true;
}

export function circPolyCollide(circ: Circle, poly: Polygon): boolean {
  return true;
}

export function polysCollide(poly1: Polygon, poly2: Polygon): boolean {
  return true;
}

export function getDistance(e1: IEntity, e2: IEntity): number {
  return Math.sqrt((e1.position.x-e2.position.x)^2 + (e1.position.y-e2.position.y)^2);
}

export function collide(a: IHitArea, b: IHitArea): boolean {
  switch(a.type){
    case SHAPES.RECT : return rectCollide(<Rectangle> a, b)
    case SHAPES.CIRC : return circCollide(<Circle> a, b)
    case SHAPES.POLY : return polyCollide(<Polygon> a, b)
  }
}

export function rectCollide(rect: Rectangle, b: IHitArea): boolean {
  switch(b.type) {
    case SHAPES.RECT : return rectsCollide(rect, <Rectangle> b)
    case SHAPES.CIRC : return rectCircCollide(rect, <Circle> b)
    case SHAPES.POLY : return rectPolyCollide(rect, <Polygon> b)
  }
}

export function circCollide(circ: Circle, b: IHitArea): boolean {
  switch(b.type){
    case SHAPES.RECT : return rectCircCollide(<Rectangle> b, circ)
    case SHAPES.CIRC : return circsCollide(circ, <Circle> b)
    case SHAPES.POLY : return circPolyCollide(circ, <Polygon> b)
  }
}

export function polyCollide(poly: Polygon, b: IHitArea): boolean {
  switch(b.type){
    case SHAPES.RECT : return rectPolyCollide(<Rectangle> b, poly)
    case SHAPES.CIRC : return circPolyCollide(<Circle> b, poly)
    case SHAPES.POLY : return polysCollide(poly, <Polygon> b)
  }
}

export function isInLOS(map: Map, x0: number, y0: number, x1: number, y1: number): boolean {
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

class Rect {
  constructor(
    private _x = 0,
    private _y = 0
  ) {}

  get x() { return this._x; }
  get y() { return this._y; }

  set(values: {x?: number, y?: number}) {
    return new Rect(
      values.x || this._x,
      values.y || this._y
    );
  }
}

let a = new Rect();

a = a.set({x: 5});
