import Phaser from "phaser";
import { HALF_GAME_HEIGHT, HALF_GAME_WIDTH, PALETTE } from "../../config";
import buzzPath from '../assets/buzz.wav';
import click1 from '../assets/click-1.wav';
import click2 from '../assets/click-2.wav';
import click3 from '../assets/click-3.wav';
import { FeedbackData, generateFeedbackSequence } from "../logic/cracking";
import { DIAL_ARC_LENGTH, DIAL_STARTING_ANGLE } from "../../game-constants";

export class Game extends Phaser.Scene {
    arc: Phaser.GameObjects.Arc;
    leftArrow: Phaser.Input.Keyboard.Key;
    rightArrow: Phaser.Input.Keyboard.Key;
    clickKeys: string[];
    feedbackArr: FeedbackData[];

    constructor() {
        super('Game');
    }

    preload() {
        this.load.audio('buzz', buzzPath)
        this.clickKeys = [
            'click1',
            'click2',
            'click3',
        ];

        this.load.audio('click1', click1);
        this.load.audio('click2', click2);
        this.load.audio('click3', click3);
    }

    create() {
        const margin = 20;
        const radius = HALF_GAME_WIDTH - margin;
        const thickness = 5;

        this.add.circle(HALF_GAME_WIDTH, HALF_GAME_HEIGHT, radius, PALETTE.dark)

        this.arc = this.add.arc(HALF_GAME_WIDTH, HALF_GAME_HEIGHT, radius, 0, DIAL_ARC_LENGTH, false, PALETTE.light)
        this.arc.angle = DIAL_STARTING_ANGLE;

        this.add.circle(HALF_GAME_WIDTH, HALF_GAME_HEIGHT, radius - thickness, PALETTE.darkest)

        this.leftArrow = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)!;
        this.rightArrow = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)!;

        this.feedbackArr = generateFeedbackSequence(3);
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
                    volume: 0.01,
                });
            }
        } else {
            this.sound.stopAll();
        }

        this.updateFeedback();
    }

    playRandomClick() {
        const clickKey = Phaser.Math.RND.pick(this.clickKeys);
        this.sound.play(clickKey);
    }

    updateFeedback() {
        const feedback = this.feedbackArr.find(f => !f.active);

        if (!feedback) {
            return;
        }

        const { angle: feedbackAngle, threshold } = feedback;
        
        const angleDiff = Math.abs(
            Phaser.Math.Angle.ShortestBetween(this.arc.angle + DIAL_ARC_LENGTH, feedbackAngle)
        );

        if (angleDiff < threshold) {
            this.playRandomClick();
            feedback.active = true;
        }
    }
}
