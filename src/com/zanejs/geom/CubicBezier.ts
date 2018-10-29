import limitPrecision from '../utils/number/limitPrecision';
import transformPoint from '../utils/matrix/transformPoint';
import Line from './Line';
import QuadraticBezier from './QuadraticBezier';

export default class CubicBezier {

    public c1: PIXI.Point;
    public c2: PIXI.Point;
    public p1: PIXI.Point;
    public p2: PIXI.Point;

    public static toQuadratics(c: CubicBezier) {
        let anchors: any[]   = [];
        let controls: any[]  = [];
        let baseLines: any[] = CubicBezier.getBaseLines(c);
        let subLines: any[]  = CubicBezier.getSubLines(c, .5);

        anchors[0] = baseLines[0].start;
        anchors[1] = subLines[3].middle;
        anchors[2] = subLines[2].middle;
        anchors[3] = subLines[4].middle;
        anchors[4] = baseLines[2].end;

        controls[0] = subLines[3].start;
        controls[1] = Line.getPoint(subLines[2], .125);
        controls[2] = Line.getPoint(subLines[2], .875);
        controls[3] = Line.getPoint(baseLines[2], .625);

        let quads: any[]     = [];
        let n: number = 4;
        while (n--) {
            quads[n] = new QuadraticBezier(controls[n], anchors[n], anchors[n + 1]);
        }
        return quads;
    }

    public static getPoint(c: CubicBezier, ratio: number): PIXI.Point {
        if (ratio !== 0 && ratio !== 1) {
            return Line.getPoint(CubicBezier.getSubLines(c, ratio)[2], ratio);
        } else if (ratio) {
            return c.p2;
        } else {
            return c.p1;
        }
    }

    public static segment(c: CubicBezier, start: number = 0, end: number = 1): CubicBezier {
        return new CubicBezier(
          Line.getPoint(CubicBezier.getSubLines(c, start)[2], end),
          Line.getPoint(CubicBezier.getSubLines(c, end)[2], start),
          CubicBezier.getPoint(c, start),
          CubicBezier.getPoint(c, end));
    }

    public static split(c: CubicBezier, ratio: number = .5): CubicBezier[] {
        return [ CubicBezier.segment(c, 0, ratio), CubicBezier.segment(c, ratio, 1) ];
    }

    private static getBaseLines(c: CubicBezier): Line[] {
        return [
            new Line(c.p1, c.c1),
            new Line(c.c1, c.c2),
            new Line(c.c2, c.p2)
        ];
    }

    private static getSubLines(c: CubicBezier, ratio: number): Line[] {
        let subLines: Line[] = [];
        let baseLines: Line[] = CubicBezier.getBaseLines(c);
        subLines[0] = new Line(Line.getPoint(baseLines[0], ratio), Line.getPoint(baseLines[1], ratio));
        subLines[1] = new Line(Line.getPoint(baseLines[1], ratio), Line.getPoint(baseLines[2], ratio));
        subLines[2] = new Line(Line.getPoint(subLines[0], ratio), Line.getPoint(subLines[1], ratio));
        subLines[3] = new Line(Line.getPoint(baseLines[0], .375), Line.getPoint(subLines[2], .125));
        subLines[4] = new Line(Line.getPoint(baseLines[2], .625), Line.getPoint(subLines[2], .875));
        return subLines;
    }

    constructor(c1: PIXI.Point, c2: PIXI.Point, p1: PIXI.Point, p2: PIXI.Point) {
        this.c1 = c1;
        this.c2 = c2;
        this.p1 = p1;
        this.p2 = p2;
    }

    public setPoints(c1: PIXI.Point, c2: PIXI.Point, p1: PIXI.Point, p2: PIXI.Point): void {
        this.c1 = c1;
        this.c2 = c2;
        this.p1 = p1;
        this.p2 = p2;
    }

    public plot(g: PIXI.Graphics, moveTo: boolean = true): void {
        let quads: any[] = CubicBezier.toQuadratics(this);
        if (moveTo) g.moveTo(quads[0].p1.x, quads[0].p1.y);
        let n: number = quads.length;
        for (let i: number = 0; i < n; i++) {
            quads[i].plot(g, false);
        }
    }

    public toMotifs(moveTo: boolean = false): any[] {
        let motifs: any[] = [];
        if (moveTo) motifs.push(['M', [limitPrecision(this.p1.x), limitPrecision(this.p1.y)]]);
        let quads: any[] = CubicBezier.toQuadratics(this);
        let n: number = quads.length;
        for (let i: number = 0; i < n; i++) {
            motifs = motifs.concat(quads[i].toMotifs());
        }
        return motifs;
    }

    public transform(t: PIXI.Matrix): CubicBezier {
        return new CubicBezier(
            transformPoint(t, this.c1),
            transformPoint(t, this.c2),
            transformPoint(t, this.p1),
            transformPoint(t, this.p2));
    }

    public clone(): CubicBezier {
        return new CubicBezier(this.c1, this.c2, this.p1, this.p2);
    }

    public toString(): String {
        return '(c1='
          + '(x=' + this.c1.x + ', y=' + this.c1.y + ')'
          + ', c2='
          + '(x=' + this.c2.x + ', y=' + this.c2.y + ')'
          + ', p1='
          + '(x=' + this.p1.x + ', y=' + this.p1.y + ')'
          + ', p2='
          + '(x=' + this.p2.x + ', y=' + this.p2.y + ')'
          + ')';
    }
}
