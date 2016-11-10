import { Point } from 'pixi.js';

export function normalizeVector(x, y) {
  let ratio = 1 / Math.sqrt(x * x + y * y);
  return new Point(x * ratio, y * ratio);
}
