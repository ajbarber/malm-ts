import Phaser from 'phaser';
import { Animations } from '~/anims';

export default class Chest extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y:number, texture: string, frame?: string|number){
        super(scene,x,y,texture, frame);
        this.play(Animations.TC);
    }

    get isClosed() {
        return (this.anims.currentAnim.key == Animations.TC);
    }

    get isOpen() {
        return !this.isClosed;
    }

    get coins() {
        if (this.isClosed) return 0;

        return Phaser.Math.Between(50, 200);
    }

    open() {
        this.play(Animations.TO);

        return this.coins;
    }
}
