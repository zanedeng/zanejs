module zanejs {

    export function getSkewX(m: PIXI.Matrix): number {
        return radianToDegree(Math.atan2(-m.c, m.d));
    }
}
