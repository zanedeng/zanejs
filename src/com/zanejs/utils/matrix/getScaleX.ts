
export default function getScaleX(m: PIXI.Matrix): number {
    return Math.sqrt(m.a * m.a + m.b * m.b);
}
