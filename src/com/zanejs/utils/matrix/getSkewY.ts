import radianToDegree from '../geom/radianToDegree';

export default function getSkewY(m: PIXI.Matrix): number {
    return radianToDegree(Math.atan2(m.b, m.a));
}
