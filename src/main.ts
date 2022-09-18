import Phaser from 'phaser';

import GameScene from './scenes/Game';
import UI from './scenes/UI';
import Preloader from './scenes/Preloader';

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 500,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Preloader, GameScene, UI],
    scale: { zoom: 2 }
})
