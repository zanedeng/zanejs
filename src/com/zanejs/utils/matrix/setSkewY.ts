import degreeToRadians from '../geom/degreeToRadians';
import setSkewYRadians from './setSkewYRadians';

export default function setSkewY(m: PIXI.Matrix, value: number): PIXI.Matrix {
    return setSkewYRadians(m, degreeToRadians(value));
}
