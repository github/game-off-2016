import Phaser from 'phaser'

const OVER_INDICATION_COLOR = 0x444444
const BORDER_SIZE = 5
export const BASE_SERVER_SIZE = 35
export const SERVER_SIZE = BASE_SERVER_SIZE + BORDER_SIZE

export default class extends Phaser.Graphics {
  constructor ({ game, x, y, logic, clickSignal }) {
    super(game, x, y);

    this.game = game;
    this.logic = logic;
    this.anchor.setTo(0.5);

    this.beginFill(0x000000);
    this.drawCircle(0, 0, SERVER_SIZE);
    this.endFill();
    this.color();

    const textStyle = { font: "16px Arial", fill: "#000000", align: "center" }
    this.packetsCountText = this.game.add.text(0, SERVER_SIZE, "", textStyle);
    this.packetsCountText.anchor.set(0.5)
    this.addChild(this.packetsCountText)

    this.inputEnabled = true;
    this.input.enableDrag();
    this.input.useHandCursor = true;

    // override drag method to prevent server from actually moving
    this.input.updateDrag = (pointer) => {
      clickSignal.dispatch(this, 'dragUpdate', pointer);
    };

    this.dataCountText = this.game.add.text(0, -SERVER_SIZE, "", textStyle);
    this.dataCountText.anchor.set(0.5)
    this.addChild(this.dataCountText)

    this.events.onInputOver.add((game, pointer) => {
      this.tint = OVER_INDICATION_COLOR
    });

    this.events.onInputOut.add((game, pointer) => {
      this.removeIndicators()
    });

    this.events.onInputDown.add((game, pointer) => {
    });

    this.events.onDragStart.add((game, pointer) => {
      clickSignal.dispatch(this, 'dragStart', pointer);
    });

    this.events.onDragStop.add((game, pointer) => {
      clickSignal.dispatch(this, 'dragStop', pointer);
    });
  }

  update () {
    const dt = this.game.time.elapsed
    this.logic.updateTimers(dt)
    if (this.logic.isPacketCreator()) {
      const additionalPackets = this.logic.getPacketsToBeCreated()
      if (additionalPackets > 0) this.createPackets(additionalPackets)
    }

    if (this.logic.packets > 0 || this.logic.isPacketCreator()) {
      this.packetsCountText.text = this.logic.packets
    } else {
      this.packetsCountText.text = ""
    }

    if (this.logic.data > 0 || this.logic.isEnemy()) {
      this.dataCountText.text = this.logic.data
    }
  }

  createPackets(packets) {
    this.logic.addPackets(packets)
    this.game.add.tween(this.scale).to({ x: 1.1, y: 1.1 }, 100, 'Linear', true, 0, 0, true)
  }

  snapIndication() {
    this.tint = OVER_INDICATION_COLOR;
  }

  removeIndicators() {
    this.tint = 0xFFFFFF;
  }

  hit() {
    this.logic.hit();
    this.color()
  }

  color() {
    this.beginFill(this.logic.color());
    this.drawCircle(0, 0, SERVER_SIZE - BORDER_SIZE);
    this.endFill();
  }

  canSendPacket() {
    return this.logic.canSendPacket();
  }

}
