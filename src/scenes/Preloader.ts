import Phaser from 'phaser';
import Filenames from '~/constants/files';
import { TextureKey } from '../constants/textures';

type TilesetDesc = { key: string, filename: string, name: string};

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    static get tileSetDescriptors(): Array<TilesetDesc> {
        return [
            { key: 'water', name: 'TilesetWater', filename: Filenames.WaterTileset } ,
            { key: 'ground', name: 'TilesetField', filename: Filenames.FieldTileset },
            { key: 'tree', name: 'TilesetNature', filename: Filenames.NatureTileset },
            { key: 'house', name: 'TilesetHouse', filename: Filenames.HouseTileset },
            { key: 'floor', name: 'TilesetFloor', filename: Filenames.FloorTileset },
            { key: 'element', name: 'TilesetElement', filename: Filenames.ElementTileset },
            { key: 'relief', name: 'TilesetReliefDetail', filename: Filenames.ReliefTileset }
        ]
    }

    load16x16spriteSheet = (x: TextureKey,y: string) =>
        this.load.spritesheet(x,y, {frameWidth:16, frameHeight:16});

    preload(): void {
        Preloader.tileSetDescriptors.forEach(x => this.load.image(x.key, x.filename));
        this.load.tilemapTiledJSON('map',Filenames.MapJson);
        this.load16x16spriteSheet(TextureKey.HeroWalk, Filenames.HeroWalk);
        this.load16x16spriteSheet(TextureKey.HeroIdle, Filenames.HeroIdle);
        this.load16x16spriteSheet(TextureKey.FlameIdle, Filenames.FlameIdle);
        this.load16x16spriteSheet(TextureKey.HeroFaint, Filenames.HeroFaint);
        this.load.image(TextureKey.HeartEmpty, Filenames.HeartEmpty);
        this.load.image(TextureKey.HeartFull, Filenames.HeartFull);
        this.load.image(TextureKey.Knife, Filenames.Knife);
        this.load.image(TextureKey.Coin, Filenames.Coin);
        this.load.atlas(TextureKey.Treasure, Filenames.ChestAtlasPng, Filenames.ChestAtlasJson);
    }

    create() {
        this.scene.start('game');
    }
}
