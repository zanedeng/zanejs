import setSkewXRadians from './setSkewXRadians';
import degreeToRadians from '../geom/degreeToRadians';

export default function setSkewX(m: PIXI.Matrix, value: number): PIXI.Matrix {
    return setSkewXRadians(m, degreeToRadians(value));
}
