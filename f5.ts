/// <reference path="./typings/index.d.ts"/>

import * as Phaser from "phaser";

const GAME_WIDTH = 1920;
const GAME_HEIGHT = 1080;
const GAME_ID = "f5-game";

class F5 {

    private game: Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(
            GAME_WIDTH,
            GAME_HEIGHT,
            Phaser.AUTO,
            GAME_ID,
            {
                preload: this.preload,
                create: this.create,
            }
        );
    }

    preload() {
    }

    create() {
    }
}

window.onload = () => new F5();
