module zanejs {

    export class QuadraticBezier {

        public c: PIXI.Point;
        public p1: PIXI.Point;
        public p2: PIXI.Point;

        public static getPoint(q: QuadraticBezier, ratio: number): PIXI.Point {
            if (ratio !== 0 && ratio !== 1) {
                return Line.getPoint(QuadraticBezier.getSubLine(q, ratio), ratio);
            } else if (ratio) {
                return q.p2;
            } else {
                return q.p1;
            }
        }

        public static segment(q: QuadraticBezier, start: number = 0, end: number = 1): QuadraticBezier {
            return new QuadraticBezier(
                Line.getPoint(QuadraticBezier.getSubLine(q, start), end),
                QuadraticBezier.getPoint(q, start),
                QuadraticBezier.getPoint(q, end));
        }

        public static split(q: QuadraticBezier, ratio: number = .5): QuadraticBezier[] {
            return [
                QuadraticBezier.segment(q, 0, ratio),
                QuadraticBezier.segment(q, ratio, 1)
            ];
        }

        private static getBaseLines(q: QuadraticBezier): Line[] {
            return [
                new Line(q.p1, q.c),
                new Line(q.c, q.p2)
            ];
        }

        private static getSubLine(q: QuadraticBezier, ratio: number): Line {
            let baseLines: Line[] = QuadraticBezier.getBaseLines(q);
            return new Line(Line.getPoint(baseLines[0], ratio), Line.getPoint(baseLines[1], ratio));
        }

        constructor(c: PIXI.Point, p1: PIXI.Point, p2: PIXI.Point) {
            this.c = c;
            this.p1 = p1;
            this.p2 = p2;
        }

        public plot(g: PIXI.Graphics, moveTo: boolean = true, endFill: boolean = false): void {
            if (moveTo) g.moveTo(this.p1.x, this.p1.y);
            g.quadraticCurveTo(this.c.x, this.c.y, this.p2.x, this.p2.y);
            if (endFill) g.endFill();
        }

        public toMotifs(moveTo: boolean = false, endFill: boolean = false): any[] {
            let motifs: any[] = [];
            if (moveTo) {
                motifs.push(['M', [limitPrecision(this.p1.x), limitPrecision(this.p1.y)]]);
            }
            motifs.push([
                'C',
                [
                    limitPrecision(this.c.x),
                    limitPrecision(this.c.y),
                    limitPrecision(this.p2.x),
                    limitPrecision(this.p2.y)
                ]
            ]);
            if (endFill) motifs.push(['E']);
            return motifs;
        }

        public transform(t: PIXI.Matrix): QuadraticBezier {
            return new QuadraticBezier(
                transformPoint(t, this.c),
                transformPoint(t, this.p1),
                transformPoint(t, this.p2)
            );
        }

        public clone(): QuadraticBezier {
            return new QuadraticBezier(this.c, this.p1, this.p2);
        }

        public toString(): string {
            return '(c='
                + '(x=' + this.c.x + ', y=' + this.c.y + ')'
                + ', p1='
                + '(x=' + this.p1.x + ', y=' + this.p1.y + ')'
                + ', p2='
                + '(x=' + this.p2.x + ', y=' + this.p2.y + ')'
                + ')';
        }
    }
}
