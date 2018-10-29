import Polyline from './Polyline';
import transformPoint from '../utils/matrix/transformPoint';

export default class Polygon extends Polyline {

    constructor(pts: PIXI.Point[]) {
        super(pts);
    }

    public set points(value: PIXI.Point[]) {
        this._points = value;
        this._points.push(this._points[0].clone());
    }

    public transform(matrix: PIXI.Matrix): Polygon {
        let pts: PIXI.Point[] = [];
        let n: number = this.points.length;
        while (n--) {
            pts[n] = transformPoint(matrix, this.points[n]);
        }
        pts.length -= 1; // remove last point since setPoints clone first one
        return new Polygon(pts);
    }

    public clone(): Polyline {
        throw new Error('method clone() isn\'t available call \'new Polygon(points)\' instead');
    }
}
