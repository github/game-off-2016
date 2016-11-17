import {
  IHitArea,
  DisplayObject,
  Point
} from 'pixi.js';

import {ITimeEvent} from '../game-loop';

// Anything with a body on the map
// Entities can collide with other units

export type teamType = 'neutral' | 'hacker' | 'robot';
export interface IEntity {
  team: teamType;
  tile: Point;
  position: Point;
  update(time: ITimeEvent): void;
  readonly type: string;
  readonly body: IHitArea;
  readonly view: DisplayObject;
}
