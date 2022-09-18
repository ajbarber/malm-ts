import Phaser from 'phaser';

export default class CollisionManager<T,U,V> {
    private _collider?: Phaser.Physics.Arcade.Collider;
    private _obj?: T;

    constructor(obj: T) {
        this._obj = obj;
    }

    get collider() {
        return this._collider;
    }

    get obj() {
        return this._obj;
    }

    addCollider(collider: Phaser.Physics.Arcade.Collider) {
        this._collider = collider;
    }

    handler(this: CollisionManager<T,U,V>, arg1: U, arg2: V) {
        throw Error("Not implemented");
    }
}
