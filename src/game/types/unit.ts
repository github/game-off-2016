import {IShape} from 'pixi.js';
import {IEntity} from './Entity';

// Units can take hits

export interface IUnit extends IEntity {
  hit: (damage: number) => void;
  fov?: IShape;
  hitbox?: IShape;
  target?: IEntity;
}
