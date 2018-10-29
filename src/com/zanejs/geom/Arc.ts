import degreeToRadians from '../utils/geom/degreeToRadians';
import transformPoint from '../utils/matrix/transformPoint';
import concat from '../utils/matrix/concat';
import Ellipse from './Ellipse';
import QuadraticBezier from './QuadraticBezier';

export default class Arc {

    public matrix: PIXI.Matrix;

    protected _cx: number;
    protected _cy: number;
    protected _rx: number;
    protected _ry: number;
    protected _rotation: number;
    protected _angleStart: number;
    protected _angleExtent: number;

    public static toEndPoint(a: Arc): any {
        let radRotation: number = degreeToRadians(a._rotation);
        let radStart: number = degreeToRadians(a._angleStart);
        let radExtent: number = degreeToRadians(a._angleExtent);
        let sinRotation: number = Math.sin(radRotation);
        let cosRotation: number = Math.cos(radRotation);

        let start: PIXI.Point = new PIXI.Point();
        let rxcos: number = a._rx * Math.cos(radStart);
        let rysin: number = a._ry * Math.sin(radStart);
        start.x = (cosRotation * rxcos) + (-sinRotation * rxcos) + a._cx;
        start.y = (sinRotation * rysin) + (cosRotation * rysin) + a._cy;

        let end: PIXI.Point = new PIXI.Point();
        rxcos = a._rx * Math.cos(radStart + radExtent);
        rysin = a._ry * Math.sin(radStart + radExtent);
        end.x = (cosRotation * rxcos) + (-sinRotation * rxcos) + a._cx;
        end.y = (sinRotation * rysin) + (cosRotation * rysin) + a._cy;

        let isLarge: boolean = (Math.abs(a._angleExtent) > 180);
        let isCounterClockwise: boolean = (a._angleExtent > 0);

        return {
            start: start,
            end: end,
            rx: a._rx,
            ry: a._ry,
            rotation: a._rotation,
            isLarge: isLarge,
            isCounterClockwise: isCounterClockwise
        };
    }

    constructor(cx: number = 0, cy: number = 0, rx: number = 0, ry: number = 0,
                rotation: number = 0, angleStart: number = 90, angleExtent: number = 90) {
        this._cx = cx;
        this._cy = cy;
        this._rx = rx;
        this._ry = ry;
        this._rotation = rotation;
        this._angleStart = angleStart;
        this._angleExtent = angleExtent;
        this.matrix = new PIXI.Matrix();
    }

    public getCurves(): QuadraticBezier[] {
        let curves: QuadraticBezier[] = [];
        let base: Ellipse = this.getBaseEllipse();

        let nCurves: number = Math.ceil(Math.abs(this._angleExtent) / 45);
        let theta: number = degreeToRadians(this._angleExtent / nCurves);
        let curAngle: number = degreeToRadians(this._angleStart);

        let cx: number;
        let cy: number;

        let c: PIXI.Point;
        let p1: PIXI.Point = base.getPointByRadianAngle(curAngle);
        let p2: PIXI.Point;

        for (let i: number = 0; i < nCurves; i++) {

            curAngle += theta;

            cx = this._cx + Math.cos(curAngle - (theta * .5)) * (this._rx / Math.cos(theta * .5));
            cy = this._cy + Math.sin(curAngle - (theta * .5)) * (this._ry / Math.cos(theta * .5));
            c = transformPoint(base.matrix, new PIXI.Point(cx, cy));

            p2 = base.getPointByRadianAngle(curAngle);

            curves.push(new QuadraticBezier(c, p1, p2));
            p1 = p2;

        }

        return curves;
    }

    /**
     * 获取包含圆弧的椭圆
     */
    public getBaseEllipse(): Ellipse {
        let e: Ellipse = new Ellipse(this._cx, this._cy, this._rx, this._ry);
        e.rotation = this._rotation;
        e.matrix = concat(e.matrix, this.matrix);
        return e;
    }

    /**
     * 绘制 Arc 到 PIXI.Graphics 图形对象
     * @param g PIXI.Graphics 图形对象
     * @param moveTo  如果是单独的形状, 则为 true
     * @param endFill 如果是闭合形状，则为 true
     */
    public plot(g: PIXI.Graphics, moveTo: boolean = true, endFill: boolean = false): void {
        let curves: QuadraticBezier[] = this.getCurves();
        let t: number = curves.length;
        for (let i: number = 0; i < t; i++) {
            curves[i].plot(g, (!i && moveTo));
        }
        if (endFill) g.endFill();
    }

    /**
     * 将 Arc 转换为绘图命令
     * @param moveTo  如果是单独的形状, 则为 true
     * @param endFill 如果是闭合形状，则为 true
     */
    public toMotifs(moveTo: boolean = true, endFill: boolean = false): any[] {
        let curves: QuadraticBezier[] = this.getCurves();
        let motifs: any[] = [];
        let t: number = curves.length;
        for (let i: number = 0; i < t; i++) {
            motifs = motifs.concat(curves[i].toMotifs(!i && moveTo));
        }
        if (endFill) motifs.push(['E']);
        return motifs;
    }

    public clone(): Arc {
        let a: Arc = new Arc(this._cx, this._cy, this._rx, this._ry,
                             this._rotation, this._angleStart, this._angleExtent);
        a.matrix = concat(a.matrix, this.matrix);
        return a;
    }

    public toString(): string {
        return '(cx=' +
            this._cx + ', cy=' + this._cy + ', rx=' +
            this._rx + ', ry=' + this._ry + ', rotation=' +
            this._rotation + ', angleStart=' +
            this._angleStart + ', angleExtent=' +
            this._angleExtent + ')';
    }
}
