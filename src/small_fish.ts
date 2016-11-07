import * as Phaser from "phaser";

export class SmallFish {
    static create(game: Phaser.Game) {
        let sprite = game.add.sprite(game.world.centerX, game.world.centerY - 300, "small_fish");
        sprite.anchor.setTo(0.5);
    }
}
