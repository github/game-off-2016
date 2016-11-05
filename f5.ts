/// <reference path="./typings/index.d.ts"/>

import * as Phaser from 'phaser';

class F5 {

    private game: Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(
            1920,
            1080,
            Phaser.AUTO,
            'f5-game',
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
