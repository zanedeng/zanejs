module zanejs {

    export function setSkewX(m: PIXI.Matrix, value: number): PIXI.Matrix {
        return setSkewXRadians(m, degreeToRadians(value));
    }
}
