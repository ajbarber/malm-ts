import Events from "~/constants/events";
import { sceneEvents } from "~/events";
import CollisionManager from "~/interfaces/CollisionManager";
import Hero from "./Hero";

type GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;

export default class HeroFlameCollisionManager extends CollisionManager<Hero,GameObjectWithBody, GameObjectWithBody> {

    constructor(obj: Hero) {
        super(obj);
    }

    handler (
        this: CollisionManager<Hero,GameObjectWithBody,GameObjectWithBody>,
        hero: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        flame: Phaser.Types.Physics.Arcade.GameObjectWithBody): void {
        if (!this.obj || !flame.active) return;

        const { body: fb } = flame;

        const { body: hb } = hero;
        const dx = hb.x - fb.x;
        const dy = hb.y - fb.y;

        const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

        this.obj.onDamage(dir);
        sceneEvents.emit(Events.PlayerHealthUpdate, this.obj.health);
        if (this.obj.health <= 0) {
            this.collider?.destroy();
        }
    }

}
