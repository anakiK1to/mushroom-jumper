import { AUTO, Game } from 'phaser';
import { BootScene } from './scenes/BootScene';
import { LevelScene } from './scenes/LevelScene';
import { PreloadScene } from './scenes/PreloadScene';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#78c0e0',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [BootScene, PreloadScene, LevelScene]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
