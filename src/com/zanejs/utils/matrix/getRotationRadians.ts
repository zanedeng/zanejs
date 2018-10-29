import getSkewYRadians from './getSkewYRadians';

export default function getRotationRadians(m: PIXI.Matrix): number {
    return getSkewYRadians(m);
}
