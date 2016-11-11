import {Rectangle} from 'pixi.js';

export interface IMapObject {
  readonly body: Rectangle;
  readonly type: string;
}
