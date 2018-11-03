module zanejs {

    export function transformPoint(
        m: PIXI.Matrix, pivot: PIXI.Point, resultPoint?: PIXI.Point): PIXI.Point {
        let x = m.a * pivot.x + m.c * pivot.y + m.tx;
        let y = m.b * pivot.x + m.d * pivot.y + m.ty;
        if (resultPoint) {
            resultPoint.x = x;
            resultPoint.y = y;
            return resultPoint;
        }
        return new PIXI.Point(x, y);
    }
}
