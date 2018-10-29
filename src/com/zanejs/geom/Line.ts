import distance from '../utils/point/distance';
import transformPoint from '../utils/matrix/transformPoint';
import limitPrecision from '../utils/number/limitPrecision';

export default class Line {

    public get middle(): PIXI.Point {
        return Line.getPoint(this, .5);
    }

    public get length(): number {
        return distance(this.start, this.end);
    }

    public start: PIXI.Point;
    public end: PIXI.Point;

    public static getPoint(line: Line, ratio: number): PIXI.Point {
        if (ratio !== 0 && ratio !== 1) {
            return new PIXI.Point(
                line.start.x + ((line.end.x - line.start.x) * ratio),
                line.start.y + ((line.end.y - line.start.y) * ratio)
            );
        } else if (ratio) {
            return line.end;
        } else {
            return line.start;
        }
    }

    public static segment(line: Line, start: number = 0, end: number = 1): Line {
        return new Line(Line.getPoint(line, start), Line.getPoint(line, end));
    }

    public static split(line: Line, ratio: number = .5): Line[] {
        return [
            Line.segment(line, 0, ratio),
            Line.segment(line, ratio, 1)
        ];
    }

    constructor(start: PIXI.Point, end: PIXI.Point) {
        this.start = start;
        this.end = end;
    }

    public setPoints(start: PIXI.Point, end: PIXI.Point): void {
        this.start = start;
        this.end = end;
    }

    public transform(t: PIXI.Matrix): Line {
        return new Line(transformPoint(t, this.start), transformPoint(t, this.end));
    }

    public plot(g: PIXI.Graphics, moveTo: boolean = true): void {
        if (moveTo) g.moveTo(this.start.x, this.start.y);
        g.lineTo(this.end.x, this.end.y);
    }

    public toMotifs(moveTo: boolean = true): any[] {
        let motifs: any[] = [];
        if (moveTo) motifs.push(['M', [limitPrecision(this.start.x), limitPrecision(this.start.y)]]);
        motifs.push(['L', [limitPrecision(this.end.x), limitPrecision(this.end.y)]]);
        return motifs;
    }

    public clone(): Line {
        return new Line(this.start, this.end);
    }

    public toString(): String {
        return '(start='
          + '(x=' + this.start.x + ', y=' + this.start.y + ')'
          + ', end='
          + '(x=' + this.end.x + ', y=' + this.end.y + ')'
          + ')';
    }
}
