import Phaser from 'phaser';

function safeGet<T1, T2, T3, T4, T5, T>(constructor:{new (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): T},
                                   x?: number, y?: number,
                                   texture?: string, group?: Phaser.GameObjects.Group):  T | undefined {
    if (!group) return undefined;

    const a = group.get(x, y, texture) as unknown;
    if (a instanceof constructor) {
        return a;
    } else return undefined;
}

export { safeGet }
