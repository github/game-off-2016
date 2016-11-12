import {IUnit} from './unit';


export interface IRobot extends IUnit {
  hack: (value: number) => void;
}
