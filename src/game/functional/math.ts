import {
  Circle,
  Rectangle,
  Point
} from 'pixi.js';

import {config} from '../../config';

export function normalizeVector(x, y) {
  let ratio = 1 / Math.sqrt(x * x + y * y);
  return new Point(x * ratio, y * ratio);
}

export function rectToPoint(rect: Rectangle): Point {
  return new Point(
    rect.x + rect.width / 2,
    rect.y + rect.height / 2
  );
}

export function pointToRect(point: Point, width: number, height: number): Rectangle {
  return new Rectangle(
    point.x - width / 2,
    point.y - height / 2,
    width,
    height
  );
}

export function pointToCircle(point: Point, radius: number): Circle {
  return new Circle(
    point.x,
    point.y,
    radius
  );
}

export function tileToPoint(tile: Point): Point {
  return new Point(
    tile.x * config.tileSize + config.tileSize / 2,
    tile.y * config.tileSize + config.tileSize / 2,
  );
}

export function tileToRect(tile: Point, width: number, height: number): Rectangle {
  const point = tileToPoint(tile);
  return new Rectangle(
    point.x - width / 2,
    point.y - height / 2,
    width,
    height
  );
}

export function tileToCircle(tile: Point, radius: number): Circle {
  const point = tileToPoint(tile);
  return new Circle(
    point.x,
    point.y,
    radius
  );
}
