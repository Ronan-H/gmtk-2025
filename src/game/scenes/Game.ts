import Phaser from "phaser";
import { HALF_GAME_HEIGHT, HALF_GAME_WIDTH, PALETTE } from "../../config";
import buzzPath from '../assets/buzz.wav';

export class Game extends Phaser.Scene {
    arc: Phaser.GameObjects.Arc;
    leftArrow: Phaser.Input.Keyboard.Key;
    rightArrow: Phaser.Input.Keyboard.Key;
    buzz: Phaser.Loader.LoaderPlugin;

    constructor() {
        super('Game');
    }

    preload() {
        this.buzz = this.load.audio('buzz', buzzPath)
    }

    create() {
        const margin = 20;
        const radius = HALF_GAME_WIDTH - margin;
        const thickness = 5;

        this.add.circle(HALF_GAME_WIDTH, HALF_GAME_HEIGHT, radius, PALETTE.dark)

        this.arc = this.add.arc(HALF_GAME_WIDTH, HALF_GAME_HEIGHT, radius, 0, 90, false, PALETTE.light)
        this.arc.angle = 225;

        this.add.circle(HALF_GAME_WIDTH, HALF_GAME_HEIGHT, radius - thickness, PALETTE.darkest)

        this.leftArrow = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)!;
        this.rightArrow = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)!;
    }

    update() {
        if (this.leftArrow.isDown) {
            this.arc.angle -= 3;
        }
        if (this.rightArrow.isDown) {
            this.arc.angle += 3;
        }

        const isRotating = this.leftArrow.isDown !== this.rightArrow.isDown;

        if (isRotating) {
            if (!this.sound.isPlaying('buzz')) {
                this.sound.play('buzz', {
                    loop: true,
                    volume: 0.1,
                    // detune: 0, // Pitch can be changed here!
            });
            }
        } else {
            this.sound.stopAll();
        }
    }
}
