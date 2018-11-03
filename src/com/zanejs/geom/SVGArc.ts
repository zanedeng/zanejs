module zanejs {

    export class SVGArc extends Arc {

        constructor(start: PIXI.Point, end: PIXI.Point,
                    rx: number, ry: number, rotation: number = 0,
                    isLarge: boolean = false, isCounterClockwise: boolean = false) {
            super();

            // midpoint
            let midX: number = (start.x - end.x) / 2;
            let midY: number = (start.y - end.y) / 2;

            // rotation
            this._rotation = rotation;
            let radRotation: number = degreeToRadians(rotation);
            let sinRotation: number = Math.sin(radRotation);
            let cosRotation: number = Math.cos(radRotation);

            // (x1', y1')
            let x1: number = cosRotation * midX + sinRotation * midY;
            let y1: number = -sinRotation * midX + cosRotation * midY;

            // Correction of out-of-range radii
            if (rx === 0 || ry === 0) {
                throw new Error('rx and rx can\'t be equal to zero !!');
            } // Ensure radii are non-zero
            this._rx = Math.abs(rx);
            this._ry = Math.abs(ry);
            let x12: number = x1 * x1;
            let y12: number = y1 * y1;
            let rx2: number = this._rx * this._rx;
            let ry2: number = this._ry * this._ry;
            let radiiFix: number = (x12 / rx2) + (y12 / ry2);
            if (radiiFix > 1) {
                this._rx = Math.sqrt(radiiFix) * this._rx;
                this._ry = Math.sqrt(radiiFix) * this._ry;
                rx2 = this._rx * this._rx;
                ry2 = this._ry * this._ry;
            }

            // (cx', cy')
            let cf: number = ((rx2 * ry2) - (rx2 * y12) - (ry2 * x12)) / ((rx2 * y12) + (ry2 * x12));
            cf = (cf > 0) ? cf : 0;
            let sqr: number = Math.sqrt(cf);
            sqr *= (isLarge !== isCounterClockwise) ? 1 : -1;
            let cx1: number = sqr * ((this._rx * y1) / this._ry);
            let cy1: number = sqr * -((this._ry * x1) / this._rx);

            // (cx, cy) from (cx', cy')
            this._cx = (cosRotation * cx1 - sinRotation * cy1) + ((start.x + end.x) / 2);
            this._cy = (sinRotation * cx1 + cosRotation * cy1) + ((start.y + end.y) / 2);

            // angleStart and angleExtent
            let ux: number = (x1 - cx1) / this._rx;
            let uy: number = (y1 - cy1) / this._ry;
            let vx: number = (-x1 - cx1) / this._rx;
            let vy: number = (-y1 - cy1) / this._ry;
            let uv: number = ux * vx + uy * vy; // u.v
            let uNorm: number = Math.sqrt(ux * ux + uy * uy); // ||u||
            let uvNorm: number = Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy)); // ||u||||v||
            let sign: number;
            sign = (uy < 0) ? -1 : 1; // ((1,0),(vx, vy))
            this._angleStart = radianToDegree( sign * Math.acos(ux / uNorm) );
            sign = ((ux * vy - uy * vx) < 0) ? -1 : 1; // ((ux,uy),(vx, vy))
            this._angleExtent = radianToDegree( sign * Math.acos(uv / uvNorm));
            if (!isCounterClockwise && this._angleExtent > 0) {
                this._angleExtent -= 360;
            } else if (isCounterClockwise && this._angleExtent < 0) {
                this._angleExtent += 360;
            }
            this._angleStart %= 360;
            this._angleExtent %= 360;
        }
    }

}
