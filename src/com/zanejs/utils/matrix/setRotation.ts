module zanejs {

    export function setRotation(m: PIXI.Matrix, value: number): PIXI.Matrix {
        return setRotationRadians(m, degreeToRadians(value));
    }
}
