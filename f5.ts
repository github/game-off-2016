/// <reference path="./typings/index.d.ts"/>

import * as Phaser from "phaser";
import { WarState } from "./src/war_state";

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
                create: this.create,
            }
        );
    }

    create() {
        this.game.state.add("war", WarState, false);
        this.game.state.start("war");
    }

}


window.onload = () => new F5();
