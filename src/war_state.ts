import * as Phaser from "phaser";
import { Her } from "./her";
import { SmallFish } from "./small_fish";

const SPRITESHEETS_PATH = "assets/spritesheets";

export class WarState extends Phaser.State {

    private her: Her;

    preload() {
        this.game.load.image("her", `${SPRITESHEETS_PATH}/main_char.png`);
        this.game.load.image("small_fish", `${SPRITESHEETS_PATH}/small_fish.png`);
    }

    create() {
        this.her = Her.create(this.game);
        SmallFish.create(this.game);
    }

    update() {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.her.moveRight();
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.her.moveLeft();
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            this.her.moveUp();
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            this.her.moveDown();
        }
    }

}
