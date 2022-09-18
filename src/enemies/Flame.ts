import Phaser from 'phaser';
import Animations from '../constants/animations';

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

export default class Flame extends Phaser.Physics.Arcade.Sprite {
    private direction = Direction.RIGHT;
    private moveEvent: Phaser.Time.TimerEvent | undefined;

    private static speed = 50;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);

        this.anims.play(Animations.FD);

        scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE,
                               this.handleTileCollision, this);

        scene.time.addEvent({
            delay: 2000,
            callback: () => this.setNewRandomDirection(),
            loop: true
        });
    }

    destroy(fromScene?: boolean) {
        this.moveEvent?.destroy();

        super.destroy(fromScene);
    }

    handleTileCollision(go: Phaser.GameObjects.GameObject,
        TILE_COLLIDE: any, handleTileCollision: any) {
        if (go !== this) return;

        this.setNewRandomDirection();
    }

    setNewRandomDirection() {
        this.direction = Phaser.Math.Between(0, 3);
    }

    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt);

        const dirToSpeed: { [id: number]: [number, number] } = {
            [Direction.UP]: [0, -Flame.speed],
            [Direction.DOWN]: [0, Flame.speed],
            [Direction.LEFT]: [-Flame.speed, 0],
            [Direction.RIGHT]: [Flame.speed, 0]
        };
        this.setVelocity(...dirToSpeed[this.direction]);
    }
}
