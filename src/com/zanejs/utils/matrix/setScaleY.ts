import getScaleY from './getScaleY';
import getSkewXRadians from './getSkewXRadians';

export default function setScaleY(m: PIXI.Matrix, value: number): PIXI.Matrix {
    let mat: PIXI.Matrix = m.clone();
    let sy: number = getScaleY(mat);
    if (sy) {
        let ratio: number = value / sy;
        mat.c *= ratio;
        mat.d *= ratio;
    } else {
        let skewXRad: number = getSkewXRadians(mat);
        mat.c = -Math.sin(skewXRad) * value;
        mat.d = Math.cos(skewXRad) * value;
    }
    return mat;
}
