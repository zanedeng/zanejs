module zanejs {

    export function setRotationRadians(m: PIXI.Matrix, value: number): PIXI.Matrix {
        let curRotation: number = getRotationRadians(m);
        let curSkewX: number = getSkewXRadians(m);
        let mat: PIXI.Matrix = setSkewXRadians(m, curSkewX + value - curRotation);
        return setSkewYRadians(mat, value);
    }
}
