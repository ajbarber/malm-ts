import Phaser from 'phaser';
import Hero from '~/characters/Hero';
import CollisionManager from "~/interfaces/CollisionManager";
import Chest from './Chest';

type GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;

export class ChestCollisionManager extends CollisionManager<Hero,GameObjectWithBody, GameObjectWithBody> {

    constructor(obj: Hero) {
        super(obj);
    }

    handler(this: CollisionManager<Hero, GameObjectWithBody, GameObjectWithBody>,
            _: Phaser.GameObjects.GameObject,
            chest: Phaser.GameObjects.GameObject) {
        if (chest instanceof Chest) {
            this.obj?.setChest(chest);
        }
    }
}
