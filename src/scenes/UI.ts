import Phaser from 'phaser';
import Events from '../constants/events';
import { TextureKey } from '../constants/textures';
import { SceneKey } from '../constants/scenes';
import { sceneEvents } from '~/events';
import Filenames from '~/constants/files';

export default class UI extends Phaser.Scene {

    private hearts: Phaser.GameObjects.Group | undefined;

    constructor() {
        super({ key: SceneKey.UI });
    }

    create() {
        this.add.image(6, 26, TextureKey.Coin, Filenames.Coin);

        const coinsLabel = this.add.text(12,20,'0', {fontSize: '14'});

        this.hearts = this.add.group({ classType: Phaser.GameObjects.Image });

        sceneEvents.on(Events.PlayerCoinsChanged, (coins: number) => {
            coinsLabel.text = coins.toString();
        });

        this.hearts.createMultiple({
            key: TextureKey.HeartFull,
            setXY: { x: 10, y: 10, stepX: 16 },
            quantity: 3
        });

        sceneEvents.on(Events.PlayerHealthUpdate, this.handlePlayerHealthChanged, this);

        sceneEvents.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off(Events.PlayerHealthUpdate, this.handlePlayerHealthChanged, this);
            sceneEvents.off(Events.PlayerCoinsChanged); //remove all handlers
        });
    }

    handlePlayerHealthChanged(health: number) {
        const tex = (i: number) => i < health ? TextureKey.HeartFull : TextureKey.HeartEmpty
        this.hearts?.children.each((go, idx) => go.scene.textures.setTexture(go, tex(idx)));
    }
}
