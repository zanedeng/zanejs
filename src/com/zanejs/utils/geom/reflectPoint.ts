module zanejs {

    /**
     *
     * @param point
     * @param pivot
     */
    export function reflectPoint(point: PIXI.Point, pivot: PIXI.Point): PIXI.Point {
        let rx: number = pivot.x - point.x;
        let ry: number = pivot.y - point.y;
        return new PIXI.Point(pivot.x + rx, pivot.y + ry);
    }
}
