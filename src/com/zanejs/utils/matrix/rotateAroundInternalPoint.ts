module zanejs {

    export function rotateAroundInternalPoint(m: PIXI.Matrix, pivot: PIXI.Point,
                                              angleDegrees: number): PIXI.Matrix {
        pivot = transformPoint(m, pivot);
        return rotateAroundExternalPoint(m, pivot, angleDegrees);
    }
}
