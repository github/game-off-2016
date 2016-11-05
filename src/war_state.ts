import * as Phaser from "phaser";
import { Her } from "./her";

export class WarState extends Phaser.State {

    private her: Her;

    preload() {
        this.game.load.image("her", "assets/spritesheets/main_char.png");
    }

    create() {
        this.her = Her.create(this.game);
    }

    update() {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) {
            this.her.moveRight();
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) {
            this.her.moveLeft();
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) {
            this.her.moveUp();
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) {
            this.her.moveDown();
        }
    }

}
