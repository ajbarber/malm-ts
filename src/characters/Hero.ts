import Phaser from "phaser";
import Events from "~/constants/events";
import { TextureKey } from "~/constants/textures";
import { sceneEvents } from "~/events";
import Chest from "~/items/Chest";
import { isMovement } from "~/utils/cursors";
import { safeGet } from "~/utils/ffi";
import Animation from "../constants/animations";

 /* eslint-disable @typescript-eslint/no-namespace */
declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            hero(x: number, y: number,
                texture: string,
                frame?: string | number): Hero
        }
    }
}

enum HealthState {
    IDLE,
    DAMAGE,
    DEAD
}

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
    NONE
}


export default class Hero extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene,
        x: number, y: number,
        texture: string,
        frame?: string | number) {
        super(scene, x, y, texture, frame);

        this.anims.play(Animation.ID);
    }

    private _coins = 0;
    private _knives?: Phaser.GameObjects.Group;
    private _activeChest?: Chest;
    private healthState = HealthState.IDLE;
    private direction = Direction.NONE;
    private damageTime = 0;
    private _health = 3;

    get health() {
        return this._health;
    }

    get activeChest() {
        return this._activeChest;
    }

    setKnives(knives: Phaser.GameObjects.Group) {
        this._knives=knives;
        return this;
    }

    setChest(chest: Chest) {
        this._activeChest = chest;
        return this;
    }

    private throwKnife() {
        const vec = new Phaser.Math.Vector2(0,0);
        switch (this.direction) {
            case Direction.UP:
                vec.y = -1;
                break;
            case Direction.DOWN:
                vec.y = 1;
                break;
            case Direction.LEFT:
                vec.x = -1;
                break;
            case Direction.RIGHT:
                vec.x = 1;
                break;
            default:
                vec.y = 1;
        }
        const angle = vec.angle();

        const knife = safeGet(Phaser.Physics.Arcade.Image,
                              this.x, this.y, TextureKey.Knife, this._knives);
        if (knife) {
            this.scene.physics.world.enable(knife);
            knife.setActive(true);
            knife.setVisible(true);
            knife.setRotation(angle);
            knife.setVelocity(vec.x * 300, vec.y * 300);
        }
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined): void {
        if (this.healthState == HealthState.DAMAGE ||
            this.healthState == HealthState.DEAD) return;

        if (!cursors || !this) return;

        const speed = 100;
        if (cursors.left?.isDown) {
            this.anims.play(Animation.HL, true);
            this.setVelocity(-speed, 0);
            this.direction = Direction.LEFT;
        } else if (cursors.right?.isDown) {
            this.anims.play(Animation.HR, true);
            this.setVelocity(speed, 0);
            this.direction = Direction.RIGHT;
        } else if (cursors.up?.isDown) {
            this.anims.play(Animation.HU, true);
            this.setVelocity(0, -speed);
            this.direction = Direction.UP;
        } else if (cursors.down?.isDown) {
            this.anims.play(Animation.HD, true);
            this.setVelocity(0, speed);
            this.direction = Direction.DOWN;
        } else if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
            if (this._activeChest && this._activeChest.isClosed) {
                this._coins += this._activeChest.open();
                sceneEvents.emit(Events.PlayerCoinsChanged, this._coins);
            } else { this.throwKnife(); }
        } else {
            this.anims.stop();
            this.setVelocity(0, 0);
        }

        if (isMovement(cursors) && this._activeChest?.isOpen) {
            this._activeChest=undefined;
        }
    }

    onDamage(dir: Phaser.Math.Vector2) {
        if (this.healthState == HealthState.DEAD) return;
        if (this.healthState === HealthState.DAMAGE) return;

        this._health--;

        if (this._health <= 0) {
            this.healthState = HealthState.DEAD
            this.anims.play(Animation.HF);
            this.setVelocity(0, 0);
        } else {
            this.setVelocity(dir.x, dir.y);
            this.setTint(0xff0000);
            this.healthState = HealthState.DAMAGE;
            this.damageTime = 0;
        }
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        switch (this.healthState) {
            case HealthState.IDLE: break;
            case HealthState.DAMAGE:
                this.damageTime += delta;
                if (this.damageTime >= 250) {
                    this.healthState = HealthState.IDLE;
                    this.setTint(0xffffff);
                    this.damageTime = 0;
                }
                break;
        }
    }
}

Phaser.GameObjects.GameObjectFactory.register('hero',
    function (this: Phaser.GameObjects.GameObjectFactory,
        x: number, y: number, texture: string,
        frame?: string | number) {
        const sprite = new Hero(this.scene, x, y, texture, frame);
        this.displayList.add(sprite);
        this.updateList.add(sprite);

        this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
        return sprite;
    }
);
