import Phaser from 'phaser'

let borderSize = 5;
let size = 35 + borderSize;
export default class extends Phaser.Graphics {

  constructor ({ game, x, y, logic, clickSignal  }) {
    super(game, x, y);

    this.game = game;
    this.logic = logic;
    this.anchor.setTo(0.5);

    this.beginFill(0x000000);
    this.drawCircle(0, 0, size);
    this.endFill();
    this.color();
    this.inputEnabled = true;
    this.input.useHandCursor = true;

    this.events.onInputOver.add((game, pointer) => {
      this.tint = 0xCCCCCC;
    });

    this.events.onInputOut.add((game, pointer) => {
      this.tint = 0xFFFFFF;
    });

    this.events.onInputDown.add(() => {
      clickSignal.dispatch(this);
    });
  }

  update () {

  }

  hit() {
    this.logic.hit();
    this.color()
  }

  color() {
    this.beginFill(this.logic.color());
    this.drawCircle(0, 0, size - borderSize);
    this.endFill();
  }

  canSendPacket() {
    return this.logic.canSendPacket();
  }

}
