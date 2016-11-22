import * as Phaser from "phaser";

export class WarState extends Phaser.State {

    private her: Phaser.Sprite;

    preload() {
        this.game.load.image("her", "assets/spritesheets/main_char.png");
    }

    create() {
        this.her = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "her");
        this.her.anchor.setTo(0.5, 0.5);
    }

}
