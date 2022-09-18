import Phaser from 'phaser';
import Animations from '~/constants/animations';
import AnimPrefix from '~/constants/animPrefixes';
import { TextureKey } from '~/constants/textures';

const spriteSheetAnims = (anims: Phaser.Animations.AnimationManager) => {

    const animsToCreate = [
        { key: Animations.HD, sheet: TextureKey.HeroWalk, frames: [0, 4, 8, 12], repeat: -1 },
        { key: Animations.HU, sheet: TextureKey.HeroWalk, frames: [1, 5, 9, 13], repeat: -1},
        { key: Animations.HL, sheet: TextureKey.HeroWalk, frames: [2, 6, 10, 14], repeat: -1 },
        { key: Animations.HR, sheet: TextureKey.HeroWalk, frames: [3, 7, 11, 15], repeat: -1 },
        { key: Animations.ID, sheet: TextureKey.HeroIdle, frames: [0], repeat:0 },
        { key: Animations.HF, sheet: TextureKey.HeroFaint, frames: [0], repeat: 0 },
        { key: Animations.FD, sheet: TextureKey.FlameIdle, frames: [0, 4, 8, 12], repeat: -1 },
        { key: Animations.FU, sheet: TextureKey.FlameIdle, frames: [1, 5, 9, 13], repeat: -1 },
        { key: Animations.FL, sheet: TextureKey.FlameIdle, frames: [2, 6, 10, 14], repeat: -1 },
        { key: Animations.FR, sheet: TextureKey.FlameIdle, frames: [3, 7, 11, 15], repeat: -1 }
    ];

    animsToCreate.forEach(x => anims.create({
        key: x.key,
        frames: anims.generateFrameNumbers(x.sheet, { frames: x.frames }),
        frameRate: 8,
        repeat: x.repeat
    }));
}

const atlasAnims = (anims: Phaser.Animations.AnimationManager) => {
  const animsToCreate = [
      { key: Animations.TO, sheet: TextureKey.Treasure,
        nameArg: { start: 0, end: 2, prefix: AnimPrefix.ChestEmpty, suffix: '.png' }},
      { key: Animations.TC, sheet: TextureKey.Treasure,
        nameArg: { start: 0, end: 0, prefix: AnimPrefix.ChestEmpty, suffix: '.png' }}
    ]

    animsToCreate.forEach(x => anims.create({
        key: x.key,
        frames: anims.generateFrameNames(x.sheet, x.nameArg)
    }));
}

export { atlasAnims, spriteSheetAnims, Animations };
