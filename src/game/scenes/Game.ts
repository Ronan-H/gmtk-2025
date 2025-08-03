import Phaser from "phaser";
import buzzPath from '../assets/buzz.wav';
import click from '../assets/click.wav';
import synth from '../assets/synth.wav';
import wompPath from '../assets/womp.wav';
import { CrackConfig, FeedbackData } from "../logic/cracking";
import { Safe } from "../gameObjects/Safe";

export class Game extends Phaser.Scene {
    leftArrow: Phaser.Input.Keyboard.Key;
    rightArrow: Phaser.Input.Keyboard.Key;
    clickKeys: string[];
    feedbackArr: FeedbackData[];
    inputEnabled: boolean;
    safes: Safe[];
    clickInc: number;

    constructor() {
        super('Game');
    }

    preload() {
        this.load.audio('click', click);
        this.load.audio('synth', synth);
        this.load.audio('buzz', buzzPath)
        this.load.audio('womp', wompPath)
    }

    newSafe() {
        const crackConfig: CrackConfig = {
            numClicks: this.clickInc++,
        };

        return new Safe(this, () => this.onSafeCracked(), () => this.onSafeExited(), crackConfig);
    }

    onSafeCracked() {
        this.safes.push(this.newSafe());
    }

    onSafeExited() {
        const [firstSafe] = this.safes;
        firstSafe.destroy();
        this.safes.slice(1);
    }
    create() {
        this.clickInc = 1;
        this.safes = [this.newSafe()];

        this.leftArrow = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)!;
        this.rightArrow = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)!;
        this.inputEnabled = true;
    }

    update() {
        if (!this.inputEnabled) {
            return;
        }

        this.safes.forEach(safe => safe.updateWithInput({
            leftDown: this.leftArrow.isDown,
            rightDown: this.rightArrow.isDown,
        }));
    }
}
