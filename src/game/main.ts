import {Subject} from 'rxjs/subject';

let a = new Subject();

debugger;
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
PIXI.DEFAULT_RENDER_OPTIONS.antialias = false;
PIXI.DEFAULT_RENDER_OPTIONS.roundPixels = true;

var renderer = PIXI.autoDetectRenderer(800, 600, {backgroundColor : 0x1099bb});
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();

// create a texture from an image path
var texture = PIXI.Texture.fromImage('assets/basics/nin.png');
// create a new Sprite using the texture
var bunny = new PIXI.Sprite(texture);

// center the sprite's anchor point
bunny.anchor.x = 0;
bunny.anchor.y = 0;

// move the sprite to the center of the screen
bunny.position.x = 200;
bunny.position.y = 150;
bunny.scale.x = 1;
bunny.scale.y = 1;

stage.addChild(bunny);

// start animating
animate();
function animate() {
    requestAnimationFrame(animate);

    // just for fun, let's rotate mr rabbit a little
    // bunny.rotation += 0.1;

    // render the container
    renderer.render(stage);
}
