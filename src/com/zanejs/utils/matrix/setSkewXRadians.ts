import getScaleY from './getScaleY';

export default function setSkewXRadians(m: PIXI.Matrix, value: number): PIXI.Matrix {
    let mat: PIXI.Matrix = m.clone();
    let sy: number = getScaleY(mat);
    mat.c = -sy * Math.sin(value);
    mat.d = sy * Math.cos(value);
    return mat;
}
