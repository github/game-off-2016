import {load} from './map/loader';
import level1 from './levels/level-01';

// Config PIXI
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
PIXI.DEFAULT_RENDER_OPTIONS.antialias = false;
PIXI.DEFAULT_RENDER_OPTIONS.roundPixels = true;


const scale = 1;

var renderer = PIXI.autoDetectRenderer(32 * 20 * scale, 32 * 15 * scale, {backgroundColor : 0x1099bb});
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();

stage.addChild(load(level1.map));

stage.scale.x = scale;
stage.scale.y = scale;

// start animating
animate(0);
function animate(time?) {
  requestAnimationFrame(animate);
  renderer.render(stage);
}
