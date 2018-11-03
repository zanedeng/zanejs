module zanejs {

    export function getRotationRadians(m: PIXI.Matrix): number {
        return getSkewYRadians(m);
    }
}
