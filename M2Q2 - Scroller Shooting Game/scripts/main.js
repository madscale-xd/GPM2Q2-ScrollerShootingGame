//sceneManager file

import PreloadScene from '../scripts/scenes/preloadScene.js';
import MainMenuScene from '../scripts/scenes/menuScene.js';
import GameScene from '../scripts/scenes/game.js';
import GameOverScene from '../scripts/scenes/gameOver.js';
import CredScene from '../scripts/scenes/credits.js';

var config = {
    type: Phaser.AUTO,
    width: 720,
    height: 720,
    scene: [PreloadScene, MainMenuScene, GameScene, GameOverScene, CredScene], //leftmost gets loaded FIRST
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

game.events.on('ready', function () {
    var canvas = game.canvas;
    canvas.style.position = 'absolute';
    canvas.style.left = '50%';
    canvas.style.top = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';
});