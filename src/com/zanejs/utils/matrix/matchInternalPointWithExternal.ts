import transformPoint from './transformPoint';

export default function matchInternalPointWithExternal(
    m: PIXI.Matrix, internalPoint: PIXI.Point, externalPoint: PIXI.Point): PIXI.Matrix {
    let mat: PIXI.Matrix = m.clone();
    let p: PIXI.Point = transformPoint(mat, internalPoint);
    let dx: number = externalPoint.x - p.x;
    let dy: number = externalPoint.y - p.y;
    mat.tx += dx;
    mat.ty += dy;
    return mat;
}
