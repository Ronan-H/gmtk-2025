import Phaser from "phaser";
import { HALF_GAME_HEIGHT, HALF_GAME_WIDTH, PALETTE } from "../../config";
import buzzPath from '../assets/buzz.wav';
import click1 from '../assets/click-1.wav';
import synth from '../assets/synth.wav';
import { FeedbackData, generateFeedbackSequence } from "../logic/cracking";
import { DIAL_ARC_LENGTH, DIAL_STARTING_ANGLE } from "../../game-constants";

export class Game extends Phaser.Scene {
    arc: Phaser.GameObjects.Arc;
    dialObjects: Phaser.GameObjects.Arc[];
    leftArrow: Phaser.Input.Keyboard.Key;
    rightArrow: Phaser.Input.Keyboard.Key;
    clickKeys: string[];
    feedbackArr: FeedbackData[];
    inputEnabled: boolean;

    constructor() {
        super('Game');
    }

    preload() {
        this.load.audio('buzz', buzzPath)
        this.clickKeys = [
            'click1',
        ];

        this.load.audio('click1', click1);

        this.load.audio('synth', synth);
    }

    create() {
        const margin = 30;
        const radius = HALF_GAME_WIDTH - margin;
        const thickness = 10;

        this.dialObjects = [];

        this.dialObjects.push(
            this.add.circle(HALF_GAME_WIDTH, HALF_GAME_HEIGHT, radius, PALETTE.dark)
        );

        this.dialObjects.push(
            this.arc = this.add.arc(HALF_GAME_WIDTH, HALF_GAME_HEIGHT, radius, 0, DIAL_ARC_LENGTH, false, PALETTE.lightest)
        );
        this.arc.angle = DIAL_STARTING_ANGLE;

        this.dialObjects.push(
            this.add.circle(HALF_GAME_WIDTH, HALF_GAME_HEIGHT, radius - thickness, PALETTE.darkest)
        );

        this.leftArrow = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)!;
        this.rightArrow = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)!;
        this.inputEnabled = true;

        this.feedbackArr = generateFeedbackSequence(3);
    }

    update() {
        if (!this.inputEnabled) {
            return;
        }

        if (this.leftArrow.isDown) {
            this.arc.angle -= 4;
        }
        if (this.rightArrow.isDown) {
            this.arc.angle += 4;
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
        const clickSound = this.sound.add(clickKey);
        clickSound.play({
            detune: Phaser.Math.Between(-300, 300),
        });

        return clickSound;
    }

    nextStage(clickSound: Phaser.Sound.BaseSound) {
        this.inputEnabled = false;

        clickSound.once('complete', () => {
            this.sound.stopAll();

            this.time.delayedCall(200, () => {
                this.dialObjects.forEach(obj => {
                    this.tweens.add({
                        targets: obj,
                        angle: '+= 120',
                        ease: 'Cubic.easeIn',
                        duration: 500,
                        onComplete: () => {
                            this.time.delayedCall(100, () => this.sound.play('synth', { volume: 0.1 }));

                            this.tweens.add({
                                targets: obj,
                                scale: { from: 1, to: 4 },
                                ease: 'Cubic.easeIn',
                                duration: 500,
                            });
                        }
                    });
                }); 
            });
        });
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
            const clickSound = this.playRandomClick();
            feedback.active = true;

            if (!this.feedbackArr.some(f => !f.active)) {
                this.nextStage(clickSound);
            }
        }
    }
}
