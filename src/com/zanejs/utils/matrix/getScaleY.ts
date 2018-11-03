module zanejs {

    export function getScaleY(m: PIXI.Matrix): number {
        return Math.sqrt(m.c * m.c + m.d * m.d);
    }
}
