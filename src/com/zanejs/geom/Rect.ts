module zanejs {

    export class Rect {

        private static CONTROL_DISTANCE: number = (4 * (Math.SQRT2 - 1)) / 3;

        public matrix: PIXI.Matrix;

        private _x:   number;
        private _y:   number;
        private _wid: number;
        private _hei: number;
        private _rx:  number;
        private _ry:  number;

        private _base: any[];

        constructor(x: number, y: number, wid: number, hei: number, rx: number = 0, ry: number = 0) {
            this._x = x;
            this._y = y;
            this._wid = wid;
            this._hei = hei;
            this._rx = (rx < wid * .5) ? rx : wid * .5;
            this._ry = (ry < hei * .5) ? ry : hei * .5;
            // temp vars
            let right: number = x + wid;
            let bottom: number = y + hei;
            let lineX1: number = x + this._rx;
            let lineX2: number = right - this._rx;
            let lineY1: number = y + this._ry;
            let lineY2: number = bottom - this._ry;
            // lines
            this._base = [];
            this._base[0] = new Line(new PIXI.Point(lineX1, y), new PIXI.Point(lineX2, y));
            this._base[1] = new Line(new PIXI.Point(right, lineY1), new PIXI.Point(right, lineY2));
            this._base[2] = new Line(new PIXI.Point(lineX2, bottom), new PIXI.Point(lineX1, bottom));
            this._base[3] = new Line(new PIXI.Point(x, lineY2), new PIXI.Point(x, lineY1));
            // curves
            if (this._rx || this._ry) {
                let dx: number = this._rx * Rect.CONTROL_DISTANCE;
                let dy: number = this._ry * Rect.CONTROL_DISTANCE;

                let c1: CubicBezier = new CubicBezier(
                    new PIXI.Point(lineX2 + dx, y),
                    new PIXI.Point(right, lineY1 - dy),
                    new PIXI.Point(lineX2, y),
                    new PIXI.Point(right, lineY1));

                let c2: CubicBezier = new CubicBezier(
                    new PIXI.Point(right, lineY2 + dy),
                    new PIXI.Point(lineX2 + dx, bottom),
                    new PIXI.Point(right, lineY2),
                    new PIXI.Point(lineX2, bottom));

                let c3: CubicBezier = new CubicBezier(
                    new PIXI.Point(lineX1 - dx, bottom),
                    new PIXI.Point(x, lineY2 + dy),
                    new PIXI.Point(lineX1, bottom),
                    new PIXI.Point(x, lineY2));

                let c4: CubicBezier = new CubicBezier(
                    new PIXI.Point(x, lineY1 - dy),
                    new PIXI.Point(lineX1 - dx, y),
                    new PIXI.Point(x, lineY1),
                    new PIXI.Point(lineX1, y));

                this._base.splice(1, 0, c1);
                this._base.splice(3, 0, c2);
                this._base.splice(5, 0, c3);
                this._base.splice(7, 0, c4);
            }
            this.matrix = new PIXI.Matrix();
        }

        public transform(transformMatrix: PIXI.Matrix): Rect {
            let r: Rect = this.clone();
            r.matrix = concat(r.matrix, transformMatrix);
            return r;
        }

        public plot(g: PIXI.Graphics, moveTo: boolean = true): void {
            if (moveTo) {
                let init: PIXI.Point = transformPoint(this.matrix, new PIXI.Point(this._x + this._rx, this._y));
                g.moveTo(init.x, init.y);
            }
            let t: number = this._base.length;
            for (let i: number = 0; i < t; i++) {
                this._base[i].transform(this.matrix).plot(g, false);
            }
        }

        public toMotifs(moveTo: boolean = true): any[] {
            let motifs: any[] = [];
            if (moveTo) {
                let init: PIXI.Point = transformPoint(this.matrix, new PIXI.Point(this._x + this._rx, this._y));
                motifs.push(['M', [limitPrecision(init.x), limitPrecision(init.y)]]);
            }
            let t: number = this._base.length;
            for (let i: number = 0; i < t; i++) {
                motifs = motifs.concat(this._base[i].transform(this.matrix).toMotifs(false));
            }
            return motifs;
        }

        public clone(): Rect {
            return new Rect(this._x, this._y, this._wid, this._hei, this._rx, this._ry);
        }
    }

}
