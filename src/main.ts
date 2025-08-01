import { Boot } from "./game/scenes/Boot";
import { Game } from "./game/scenes/Game";

document.addEventListener('DOMContentLoaded', () => {
    const config = {
        type: Phaser.AUTO,
        title: 'GMTK-2025',
        description: '',
        parent: 'game-container',
        pixelArt: true,
        width: 128,
        height: 128,
        physics: {
            default: 'arcade',
            arcade: {
                // debug: true,
            }
        },
        backgroundColor: '#0f1a3b',
        scene: [
            Boot,
            Game,
        ],
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 128,
            height: 128,
        },
    }

    new Phaser.Game(config);
});