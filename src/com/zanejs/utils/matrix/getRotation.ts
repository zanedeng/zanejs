import getRotationRadians from './getRotationRadians';
import radianToDegree from '../geom/radianToDegree';

export default function getRotation(m: PIXI.Matrix): number {
    return radianToDegree(getRotationRadians(m));
}
