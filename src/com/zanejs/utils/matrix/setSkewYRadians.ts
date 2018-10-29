import getScaleX from './getScaleX';

export default function setSkewYRadians(m: PIXI.Matrix, value: number): PIXI.Matrix {
    let mat: PIXI.Matrix = m.clone();
    let sx: number = getScaleX(mat);
    mat.a = sx * Math.cos(value);
    mat.b = sx * Math.sin(value);
    return mat;
}
