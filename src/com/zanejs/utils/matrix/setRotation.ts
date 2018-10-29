import degreeToRadians from '../geom/degreeToRadians';
import setRotationRadians from './setRotationRadians';

export default function setRotation(m: PIXI.Matrix, value: number): PIXI.Matrix {
    return setRotationRadians(m, degreeToRadians(value));
}
