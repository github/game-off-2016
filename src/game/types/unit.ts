import {IEntity} from './Entity';

// Units can take hits

export interface IUnit extends IEntity {
  hit: (damage: number) => void;
}
