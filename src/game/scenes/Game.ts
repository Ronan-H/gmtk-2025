import Phaser from "phaser";
import { GAME_WIDTH, HALF_GAME_HEIGHT, HALF_GAME_WIDTH, PALETTE } from "../../config";

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
    }

    create() {
        const margin = 20;
        const radius = HALF_GAME_WIDTH - margin;
        const thickness = 5;

        this.add.circle(HALF_GAME_WIDTH, HALF_GAME_HEIGHT, radius, PALETTE.dark)
        this.add.circle(HALF_GAME_WIDTH, HALF_GAME_HEIGHT, radius - thickness, PALETTE.darkest)
        // const arc = this.add.arc(10, 10, 10, 0, 360, false, 0x00aaff)
    }

    update() {
        
    }
}
