import * as Phaser from "phaser";

const VELOCITY = 10;

export class Her {

    constructor(private sprite: Phaser.Sprite) { }

    moveRight() {
        this.sprite.x += VELOCITY;
    }

    moveLeft() {
        this.sprite.x -= VELOCITY;
    }

    moveUp() {
        this.sprite.y -= VELOCITY;
    }

    moveDown() {
        this.sprite.y += VELOCITY;
    }

    static create(game: Phaser.Game): Her {
        let sprite = game.add.sprite(game.world.centerX, game.world.centerY, "her");
        sprite.anchor.setTo(0.5, 0.5);
        sprite.inputEnabled = true;
        return new Her(sprite);
    }

}
