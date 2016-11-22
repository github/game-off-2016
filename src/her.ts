import * as Phaser from "phaser";
import * as bullet from "./bullet";

const VELOCITY = 10;

export class Her {

    private fireRate = 200;
    private nextFire: number;

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

    fire() {
        if (this.sprite.game.time.time < this.nextFire) {
            return;
        }

        const bullets = bullet.createDualBullets(this.sprite.game, this.sprite.x, this.sprite.y);
        bullet.moveBullets(bullets);

        this.nextFire = this.sprite.game.time.time + this.fireRate;
    }

    static create(game: Phaser.Game): Her {
        let sprite = game.add.sprite(game.world.centerX, game.world.centerY, "her");
        sprite.anchor.setTo(0.5, 0.5);
        sprite.inputEnabled = true;
        return new Her(sprite);
    }

}
