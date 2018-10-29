import degreeToRadians from '../utils/geom/degreeToRadians';
import transformPoint from '../utils/matrix/transformPoint';
import getRotation from '../utils/matrix/getRotation';
import rotateAroundInternalPoint from '../utils/matrix/rotateAroundInternalPoint';
import concat from '../utils/matrix/concat';
import CubicBezier from './CubicBezier';

export default class Ellipse {

    public get rotation(): number { return getRotation(this.matrix); }

    public set rotation(value: number) {
        value -= this.rotation;
        this.matrix = rotateAroundInternalPoint(this.matrix, new PIXI.Point(this.cx, this.cy), value);
    }

    private static CONTROL_DISTANCE: number = (4 * (Math.SQRT2 - 1)) / 3;

    public cx: number;
    public cy: number;
    public rx: number;
    public ry: number;
    public matrix: PIXI.Matrix;

    constructor(cx: number, cy: number, rx: number, ry: number) {
        this.cx = cx;
        this.cy = cy;
        this.rx = rx;
        this.ry = ry;
        this.matrix = new PIXI.Matrix();
    }

    public getCurves(): CubicBezier[] {
        let top: number     = this.cy - this.ry;
        let left: number    = this.cx - this.rx;
        let right: number   = this.cx + this.rx;
        let bottom: number  = this.cy + this.ry;
        let dx: number      = this.rx * Ellipse.CONTROL_DISTANCE;
        let dy: number      = this.ry * Ellipse.CONTROL_DISTANCE;

        let curves: CubicBezier[] = []; // Bezier curves (counter-clockwise starting at 3h => 0º)
        curves[0] = new CubicBezier(
            new PIXI.Point(right, this.cy - dy),
            new PIXI.Point(this.cx + dx, top),
            new PIXI.Point(right, this.cy),
            new PIXI.Point(this.cx, top));

        curves[1] = new CubicBezier(
            new PIXI.Point(this.cx - dx, top),
            new PIXI.Point(left, this.cy - dy),
            new PIXI.Point(this.cx, top),
            new PIXI.Point(left, this.cy));

        curves[2] = new CubicBezier(
            new PIXI.Point(left, this.cy + dy),
            new PIXI.Point(this.cx - dx, bottom),
            new PIXI.Point(left, this.cy),
            new PIXI.Point(this.cx, bottom));

        curves[3] = new CubicBezier(
            new PIXI.Point(this.cx + dx, bottom),
            new PIXI.Point(right, this.cy + dy),
            new PIXI.Point(this.cx, bottom),
            new PIXI.Point(right, this.cy));

        return curves;
    }

    public transform(transformMatrix: PIXI.Matrix): Ellipse {
        let e: Ellipse = this.clone();
        concat(e.matrix, transformMatrix);
        return e;
    }

    public plot(g: PIXI.Graphics, moveTo: boolean = true, endFill: boolean = true): void {
        let curves: CubicBezier[] = this.getCurves();
        for (let i: number = 0; i < 4; i++) {
          curves[i].transform(this.matrix).plot(g, (!i && moveTo));
        }
        if (endFill) g.endFill();
    }

    public toMotifs(moveTo: boolean = true, endFill: boolean = true): any[] {
        let curves: CubicBezier[] = this.getCurves();
        let motifs: any[] = [];
        let c: CubicBezier;
        for (let i: number = 0; i < 4; i++) {
            c = curves[i].transform(this.matrix);
            motifs = motifs.concat(c.toMotifs(!i && moveTo));
        }
        if (endFill) motifs.push(['E']);
        return motifs;
    }

    public getPoint(ratio: number): PIXI.Point {
        return this.getPointByRadianAngle(ratio * Math.PI * 2);
    }

    public getPointByAngle(angle: number): PIXI.Point {
        return this.getPointByRadianAngle(degreeToRadians(angle));
    }

    public getPointByRadianAngle(radAngle: number): PIXI.Point {
        let px: number = this.cx + Math.cos(radAngle) * this.rx;
        let py: number = this.cy + Math.sin(radAngle) * this.ry;
        return transformPoint(this.matrix, new PIXI.Point(px, py));
    }

    public clone(): Ellipse {
        let e: Ellipse = new Ellipse(this.cx, this.cy, this.rx, this.ry);
        concat(e.matrix, this.matrix);
        return e;
    }

    public toString(): string {
        return '(cx=' + this.cx + ', cy=' + this.cy + ', rx=' + this.rx + ', ry=' + this.ry + ')';
    }
}
