type RnTuple =  [value: number, rn: string];

const mappings: Array<RnTuple> = [
    [1, "I"],
    [4, "IV"],
    [5, "V"],
    [10, "X"],
    [50, "L"],
    [100, "C"],
    [500, "D"],
    [1000, "M"]
]

function intToRoman(num: number): string {
    const res = go(num, "");
    console.log(res);
    return res;
}

const go = (num: number, res: string): string => {
    if (num <= 0) return res;

    const [maxN, maxS] = mappings.reduce((acc, each) => each[0] > acc[0] && each[0] <= num ? each : acc,[0,""]);
    console.log(maxN, maxS);
    console.log(res+maxS);
    console.log(num-maxN);
    return go(num-maxN, res+maxS);
}
