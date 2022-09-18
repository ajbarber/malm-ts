import Phaser from 'phaser';
import CollisionManager from "~/interfaces/CollisionManager";

type FlameKnife = { "flames": Phaser.Physics.Arcade.Group,
                    "knives": Phaser.Physics.Arcade.Group };

type GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;

export class KnifeWallCollisionManager extends CollisionManager<FlameKnife,GameObjectWithBody, GameObjectWithBody> {

    constructor(obj: FlameKnife) {
        super(obj);
    }

    handler(this: CollisionManager<FlameKnife, GameObjectWithBody, GameObjectWithBody>,
            knife: Phaser.GameObjects.GameObject,
            _: Phaser.GameObjects.GameObject) {
        this.obj?.knives?.killAndHide(knife);
    }
}

export class KnifeFlameCollisionManager extends CollisionManager<FlameKnife,GameObjectWithBody, GameObjectWithBody> {

    constructor(obj: FlameKnife) {
        super(obj);
    }

    handler(this: CollisionManager<FlameKnife, GameObjectWithBody, GameObjectWithBody>,
            knife: Phaser.GameObjects.GameObject,
            flame: Phaser.GameObjects.GameObject) {
        if (knife.active) {
            this.obj?.flames?.killAndHide(flame);
        }
        this.obj?.knives?.killAndHide(knife);
    }
}
