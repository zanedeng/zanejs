import setSkewXRadians from './setSkewXRadians';
import getRotationRadians from './getRotationRadians';
import getSkewXRadians from './getSkewXRadians';
import setSkewYRadians from './setSkewYRadians';

export default function setRotationRadians(m: PIXI.Matrix, value: number): PIXI.Matrix {
    let curRotation: number = getRotationRadians(m);
    let curSkewX: number = getSkewXRadians(m);
    let mat: PIXI.Matrix = setSkewXRadians(m, curSkewX + value - curRotation);
    return setSkewYRadians(mat, value);
}
