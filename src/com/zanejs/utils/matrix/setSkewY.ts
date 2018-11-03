module zanejs {

    export function setSkewY(m: PIXI.Matrix, value: number): PIXI.Matrix {
        return setSkewYRadians(m, degreeToRadians(value));
    }
}
