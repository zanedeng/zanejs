module zanejs {

    export class Polyline {

        protected _points: PIXI.Point[];

        constructor(pts: PIXI.Point[]) {
            this._points = pts;
        }

        public get points(): PIXI.Point[] { return this._points; }

        public set points(value: PIXI.Point[]) {
            this._points = value;
        }

        public get length(): number {
            let len: number = 0;
            let tot: number = this.points.length - 1;
            for (let i: number = 0; i < tot; i++) {
                len += distance(this.points[i], this.points[i + 1]);
            }
            return len;
        }

        public plot(g: PIXI.Graphics, moveTo: boolean = true): void {
            if (moveTo) g.moveTo(this.points[0].x, this.points[0].y);
            let tot: number = this.points.length;
            for (let i: number = 1; i < tot; i++) {
                g.lineTo(this.points[i].x, this.points[i].y);
            }
        }

        public toMotifs(moveTo: boolean = true): any[] {
            let motifs: any[] = [];
            if (moveTo) {
                motifs.push(['M', [limitPrecision(this.points[0].x), limitPrecision(this.points[0].y)]]);
            }
            let tot: number = this.points.length;
            for (let i: number = 1; i < tot; i++) {
                motifs.push(['L', [limitPrecision(this.points[i].x), limitPrecision(this.points[i].y)]]);
            }
            return motifs;
        }

        public addPoints(...pts: PIXI.Point[]): void {
            this.points = this.points.concat(pts);
        }

        public transform(matrix: PIXI.Matrix): Polyline {
            let pts: PIXI.Point[] = [];
            let n: number = this.points.length;
            while (n--) {
                pts[n] = transformPoint(matrix, this.points[n]);
            }
            return new Polyline(pts);
        }

        public clone(): Polyline {
            return new Polyline(this.points);
        }

        public toString(): string {
            return toStringArray(this.points);
        }
    }
}
