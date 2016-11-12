import {config} from '../config';
import {
  SCALE_MODES,
  DEFAULT_RENDER_OPTIONS,
  WebGLRenderer,
  CanvasRenderer,
  Container,
  autoDetectRenderer,
  Graphics
} from 'pixi.js';

SCALE_MODES.DEFAULT = SCALE_MODES.NEAREST;
DEFAULT_RENDER_OPTIONS.antialias = false;
DEFAULT_RENDER_OPTIONS.roundPixels = true;


export class GameCanvas {
  scale: number;
  renderer: WebGLRenderer | CanvasRenderer;
  stage: Container;
  private _width: number;
  private _height: number;

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  resizeCanvas() {
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight || e.clientHeight || g.clientHeight;
    this.renderer.resize(x, y);
    this.scale = Math.min(x / this.width, y / this.height);
    if (config.roundScale) {
      let scale = Math.ceil(this.scale);
      let spacing = config.tileSize * scale;
      if (scale * this.width - spacing < x && scale * this.height - spacing < y) {
        this.scale = scale;
      } else {
        this.scale = Math.floor(this.scale);
      }
    }

    if (this.scale < config.minScale) {
      this.scale = config.minScale;
    }

    this.stage.x = (this.renderer.width - this.width * this.scale) / 2;
    this.stage.y = (this.renderer.height - this.height * this.scale) / 2;
    this.stage.scale.x = this.scale;
    this.stage.scale.y = this.scale;
  }

  render() {
    this.renderer.render(this.stage);
  }

  constructor() {
    this.scale = 1;
    this._width = config.tileSize * config.gridWidth;
    this._height = config.tileSize * config.gridHeight;

    this.renderer = autoDetectRenderer(0, 0, {backgroundColor : 0});

    this.stage = new Container();
    this.stage.scale.x = this.scale;
    this.stage.scale.y = this.scale;
    const graphics = new Graphics();
    this.stage.addChild(graphics);
    graphics.beginFill(0x538247);
    graphics.drawRect(0, 0, this.width, this.height);

    this.resizeCanvas();

    window.addEventListener('resize', () => this.resizeCanvas());
  }
}
