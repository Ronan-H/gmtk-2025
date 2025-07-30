import { Boot } from "./game/scenes/Boot";

document.addEventListener('DOMContentLoaded', () => {
    const config = {
        type: Phaser.AUTO,
        title: 'GMTK-2025',
        description: '',
        parent: 'game-container',
        pixelArt: true,
        width: 64,
        height: 64,
        physics: {
            default: 'arcade',
            arcade: {
                // debug: true,
            }
        },
        backgroundColor: '#0f380f',
        scene: [
            Boot,
        ],
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 64,
            height: 64,
        },
    }

    new Phaser.Game(config);
});