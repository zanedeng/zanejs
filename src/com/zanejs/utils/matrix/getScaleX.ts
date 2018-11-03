module zanejs {

    export function getScaleX(m: PIXI.Matrix): number {
        return Math.sqrt(m.a * m.a + m.b * m.b);
    }
}
