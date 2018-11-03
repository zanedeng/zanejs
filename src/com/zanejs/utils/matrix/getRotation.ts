module zanejs {

    export function getRotation(m: PIXI.Matrix): number {
        return radianToDegree(getRotationRadians(m));
    }
}
