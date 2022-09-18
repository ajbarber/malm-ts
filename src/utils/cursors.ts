import Phaser from 'phaser';

const isMovement = (cursors: Phaser.Types.Input.Keyboard.CursorKeys) =>
    [cursors.left,
     cursors.right,
     cursors.up,
     cursors.down].some(x => x?.isDown);

export { isMovement };
