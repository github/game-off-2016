import {DisplayObject, Rectangle, Point} from 'pixi.js';
import {ITimeEvent} from '../game-loop';

export interface IEntity {
  update: (time: ITimeEvent) => void;
  tile: Point;
  position: Point;
  hit: (damage: number) => void;
  readonly view: DisplayObject;
  readonly body: Rectangle;
}
