import degreeToRadians from '../geom/degreeToRadians';

export default function rotateAroundExternalPoint(m: PIXI.Matrix, pivot: PIXI.Point,
                                                  angleDegrees: number): PIXI.Matrix {
    let mat: PIXI.Matrix = m.clone();
    mat.tx -= pivot.x;
    mat.ty -= pivot.y;
    mat.rotate(degreeToRadians(angleDegrees));
    mat.tx += pivot.x;
    mat.ty += pivot.y;
    return mat;
}
