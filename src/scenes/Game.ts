import Phaser from 'phaser';
import HeroFlameCollisionManager from '~/characters/HeroCollisionManager';
import { ObjectLayers, TerrainLayers } from '~/constants/layers';
import { TextureKey } from '~/constants/textures';
import Chest from '~/items/Chest';
import { ChestCollisionManager } from '~/items/ChestCollision';
import { KnifeFlameCollisionManager, KnifeWallCollisionManager } from '~/items/KnifeCollision';
import { safeGet } from '~/utils/ffi';
import { atlasAnims, spriteSheetAnims } from '../anims';
import '../characters/Hero';
import Hero from '../characters/Hero';
import { SceneKey } from '../constants/scenes';
import Flame from '../enemies/Flame';
import Preloader from './Preloader';

export default class Game extends Phaser.Scene {

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    private hero?: Hero;

    constructor() {
        super('game')
    }

    preload() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        this.scene.run(SceneKey.UI)

        spriteSheetAnims(this.anims);
        atlasAnims(this.anims);

        const m = this.make.tilemap({ key: 'map' });

        const tileSets = Preloader.tileSetDescriptors.map(
            x => m.addTilesetImage(x.name, x.key));

        const tiles: Array<Phaser.Tilemaps.TilemapLayer> =
            Object.entries(TerrainLayers).map(([f,s], _) => m.createLayer(s, tileSets), null);

        tiles.forEach((val, _) => val.setCollisionByProperty({ collides: true }));

        const chests = this.physics.add.staticGroup({ classType: Chest });
        const chestsLayer = m.getObjectLayer(ObjectLayers.ChestLayer);
        chestsLayer.objects.forEach(c =>
            chests.get(c.x, c.y, TextureKey.Treasure));

        const flames = this.physics.add.group({
            classType: Flame,
            enable: false,
            active: false,
            createCallback: go => {
                if (go.body instanceof Phaser.Physics.Arcade.Body ||
                    go.body instanceof Phaser.Physics.Arcade.StaticBody) {
                    go.body.onCollide = true
                }
            }
        });

        const flamesLayer = m.getObjectLayer(ObjectLayers.Enemies);
        flamesLayer.objects.forEach(f => {
            const flame = safeGet(Flame, f.x, f.y, TextureKey.FlameIdle, flames);
            if (flame) {
                this.physics.world.enable(flame);
            }
        });

        const knives = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            enable: false,
            active: false,
            maxSize: 3
        })

        this.hero = this.add.hero(188, 128, TextureKey.HeroIdle).setKnives(knives);

        const hf = new HeroFlameCollisionManager(this.hero)
        hf.addCollider(this.physics.add.collider(this.hero, flames, hf.handler.bind(hf)));
        this.physics.add.collider(this.hero, tiles)

        this.physics.add.collider(flames, tiles);
        const kw = new KnifeWallCollisionManager({ knives, flames });
        kw.addCollider(this.physics.add.collider(knives, tiles, kw.handler.bind(kw)));

        const kf = new KnifeFlameCollisionManager({ knives, flames });
        kf.addCollider(this.physics.add.collider(knives, flames, kf.handler.bind(kf)));

        const cp = new ChestCollisionManager(this.hero);
        cp.addCollider(this.physics.add.collider(this.hero, chests, cp.handler.bind(cp)));

        this.cameras.main.startFollow(this.hero, true);
    }

    update(t: number, dt: number) {
        this.hero?.update(this.cursors);
    }
}
