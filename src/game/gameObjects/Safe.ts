import Phaser from "phaser";
import { HALF_GAME_HEIGHT, HALF_GAME_WIDTH, PALETTE } from "../../config";
import { FeedbackData, generateFeedbackSequence } from "../logic/cracking";
import { DIAL_ARC_LENGTH, DIAL_STARTING_ANGLE } from "../../game-constants";

export class Safe {
    arc: Phaser.GameObjects.Arc;
    dialObjects: Phaser.GameObjects.Arc[];
    clickKeys: string[];
    feedbackArr: FeedbackData[];
    inputEnabled: boolean;
    scene: Phaser.Scene;
    onCracked: Function;

    constructor(scene: Phaser.Scene, onCracked: Function) {
        this.scene = scene;
        this.onCracked = onCracked;
        this.create();
    }

    create() {
        const margin = 20;
        const radius = HALF_GAME_WIDTH - margin;
        const thickness = 10;

        this.dialObjects = [];

        this.dialObjects.push(
            this.scene.add.circle(HALF_GAME_WIDTH, HALF_GAME_HEIGHT, radius, PALETTE.dark)
        );

        this.dialObjects.push(
            this.arc = this.scene.add.arc(HALF_GAME_WIDTH, HALF_GAME_HEIGHT, radius, 0, DIAL_ARC_LENGTH, false, PALETTE.lightest)
        );
        this.arc.angle = DIAL_STARTING_ANGLE;

        this.dialObjects.push(
            this.scene.add.circle(HALF_GAME_WIDTH, HALF_GAME_HEIGHT, radius - thickness, PALETTE.darkest)
        );

        this.dialObjects.forEach(o => o.scale = 0);

        this.feedbackArr = generateFeedbackSequence(3);

        this.dialObjects.forEach(obj => {
            this.scene.tweens.add({
                targets: obj,
                scale: 1,
                ease: 'Cubic.easeOut',
                duration: 1000,
                onComplete: () => {
                    this.inputEnabled = true;
                }
            });
        }); 
    }

    updateWithInput(input: { leftDown: boolean, rightDown: boolean }) {
        const { leftDown, rightDown } = input;

        if (!this.inputEnabled) {
            return;
        }

        if (leftDown) {
            this.arc.angle -= 4;
        }
        if (rightDown) {
            this.arc.angle += 4;
        }

        const isRotating = leftDown !== rightDown;

        if (isRotating) {
            if (!this.scene.sound.isPlaying('buzz')) {
                this.scene.sound.play('buzz', {
                    loop: true,
                    volume: 0.01,
                });
            }
        } else {
            this.scene.sound.stopAll();
        }

        this.updateFeedback();
    }

    playRandomClick(detuneMin: number = -300, detuneMax: number = 300) {
        const clickSound = this.scene.sound.add('click');
        clickSound.play({
            detune: Phaser.Math.Between(detuneMin, detuneMax),
        });

        return clickSound;
    }

    nextStage(clickSound: Phaser.Sound.BaseSound) {
        this.inputEnabled = false;

        clickSound.once('complete', () => {
            this.scene.sound.stopAll();

            this.scene.time.delayedCall(200, () => {
                this.dialObjects.forEach(obj => {
                    this.scene.tweens.add({
                        targets: obj,
                        angle: '+= 120',
                        ease: 'Cubic.easeIn',
                        duration: 500,
                        onComplete: () => {
                            this.playRandomClick(-800, -600).once('complete', () => {
                                this.scene.time.delayedCall(100, () => this.scene.sound.play('synth', { volume: 0.1 }));

                                this.scene.tweens.add({
                                    targets: obj,
                                    scale: { from: 1, to: 4 },
                                    ease: 'Cubic.easeIn',
                                    duration: 500,
                                    onComplete: () => this.onCracked(),
                                });
                            })
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
