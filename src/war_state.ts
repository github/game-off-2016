import * as Phaser from "phaser";

export class WarState extends Phaser.State {

    private her: Her;

    preload() {
        this.game.load.image("her", "assets/spritesheets/main_char.png");
    }

    create() {
        this.her = Her.create(this.game);
    }

}

class Her {

    constructor(private sprite: Phaser.Sprite) { }

    static create(game: Phaser.Game): Her {
        let sprite = game.add.sprite(game.world.centerX, game.world.centerY, "her");
        sprite.anchor.setTo(0.5, 0.5);
        return new Her(sprite);
    }

}
