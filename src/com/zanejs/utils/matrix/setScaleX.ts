import getScaleX from './getScaleX';
import getSkewYRadians from './getSkewYRadians';

export default function setScaleX(m: PIXI.Matrix, value: number): PIXI.Matrix {
    let mat: PIXI.Matrix = m.clone();
    let sx: number = getScaleX(mat);
    if (sx) {
        let ratio: number = value / sx;
        mat.a *= ratio;
        mat.b *= ratio;
    } else {
        let skewYRad: number = getSkewYRadians(mat);
        mat.a = Math.cos(skewYRad) * value;
        mat.b = Math.sin(skewYRad) * value;
    }
    return mat;
}
