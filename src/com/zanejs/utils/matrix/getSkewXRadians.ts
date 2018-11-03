module zanejs {

    export function getSkewXRadians(m: PIXI.Matrix): number {
        return Math.atan2(-m.c, m.d);
    }
}
