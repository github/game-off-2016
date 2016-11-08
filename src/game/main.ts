import {load} from './map/loader';
import level1 from './levels/level-01';

import {GameLoop} from './util/game-loop';
import {GameCanvas} from './util/game-canvas';

let gameLoop = new GameLoop();
let canvas = new GameCanvas();


canvas.stage.addChild(load(level1.map));

gameLoop.main$.subscribe(() => canvas.paint());
