
export default function getSkewYRadians(m: PIXI.Matrix): number {
    return Math.atan2(m.b, m.a);
}
