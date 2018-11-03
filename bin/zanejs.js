var zanejs;
(function (zanejs) {
    var AssetsBundle = (function () {
        function AssetsBundle() {
        }
        return AssetsBundle;
    }());
    zanejs.AssetsBundle = AssetsBundle;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var AssetsBundleEvent = (function () {
        function AssetsBundleEvent() {
        }
        AssetsBundleEvent.ERROR = 'ERROR';
        AssetsBundleEvent.PROGRESS = 'PROGRESS';
        AssetsBundleEvent.COMPLETE = 'COMPLETE';
        return AssetsBundleEvent;
    }());
    zanejs.AssetsBundleEvent = AssetsBundleEvent;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var AssetsManager = (function () {
        function AssetsManager() {
            throw new Error('This is a STATIC CLASS and should not be instantiated.');
        }
        return AssetsManager;
    }());
    zanejs.AssetsManager = AssetsManager;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function paserZipMiddleware(resource, next) {
    }
    zanejs.paserZipMiddleware = paserZipMiddleware;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var Arc = (function () {
        function Arc(cx, cy, rx, ry, rotation, angleStart, angleExtent) {
            if (cx === void 0) { cx = 0; }
            if (cy === void 0) { cy = 0; }
            if (rx === void 0) { rx = 0; }
            if (ry === void 0) { ry = 0; }
            if (rotation === void 0) { rotation = 0; }
            if (angleStart === void 0) { angleStart = 90; }
            if (angleExtent === void 0) { angleExtent = 90; }
            this._cx = cx;
            this._cy = cy;
            this._rx = rx;
            this._ry = ry;
            this._rotation = rotation;
            this._angleStart = angleStart;
            this._angleExtent = angleExtent;
            this.matrix = new PIXI.Matrix();
        }
        Arc.toEndPoint = function (a) {
            var radRotation = zanejs.degreeToRadians(a._rotation);
            var radStart = zanejs.degreeToRadians(a._angleStart);
            var radExtent = zanejs.degreeToRadians(a._angleExtent);
            var sinRotation = Math.sin(radRotation);
            var cosRotation = Math.cos(radRotation);
            var start = new PIXI.Point();
            var rxcos = a._rx * Math.cos(radStart);
            var rysin = a._ry * Math.sin(radStart);
            start.x = (cosRotation * rxcos) + (-sinRotation * rxcos) + a._cx;
            start.y = (sinRotation * rysin) + (cosRotation * rysin) + a._cy;
            var end = new PIXI.Point();
            rxcos = a._rx * Math.cos(radStart + radExtent);
            rysin = a._ry * Math.sin(radStart + radExtent);
            end.x = (cosRotation * rxcos) + (-sinRotation * rxcos) + a._cx;
            end.y = (sinRotation * rysin) + (cosRotation * rysin) + a._cy;
            var isLarge = (Math.abs(a._angleExtent) > 180);
            var isCounterClockwise = (a._angleExtent > 0);
            return {
                start: start,
                end: end,
                rx: a._rx,
                ry: a._ry,
                rotation: a._rotation,
                isLarge: isLarge,
                isCounterClockwise: isCounterClockwise
            };
        };
        Arc.prototype.getCurves = function () {
            var curves = [];
            var base = this.getBaseEllipse();
            var nCurves = Math.ceil(Math.abs(this._angleExtent) / 45);
            var theta = zanejs.degreeToRadians(this._angleExtent / nCurves);
            var curAngle = zanejs.degreeToRadians(this._angleStart);
            var cx;
            var cy;
            var c;
            var p1 = base.getPointByRadianAngle(curAngle);
            var p2;
            for (var i = 0; i < nCurves; i++) {
                curAngle += theta;
                cx = this._cx + Math.cos(curAngle - (theta * .5)) * (this._rx / Math.cos(theta * .5));
                cy = this._cy + Math.sin(curAngle - (theta * .5)) * (this._ry / Math.cos(theta * .5));
                c = zanejs.transformPoint(base.matrix, new PIXI.Point(cx, cy));
                p2 = base.getPointByRadianAngle(curAngle);
                curves.push(new zanejs.QuadraticBezier(c, p1, p2));
                p1 = p2;
            }
            return curves;
        };
        Arc.prototype.getBaseEllipse = function () {
            var e = new zanejs.Ellipse(this._cx, this._cy, this._rx, this._ry);
            e.rotation = this._rotation;
            e.matrix = zanejs.concat(e.matrix, this.matrix);
            return e;
        };
        Arc.prototype.plot = function (g, moveTo, endFill) {
            if (moveTo === void 0) { moveTo = true; }
            if (endFill === void 0) { endFill = false; }
            var curves = this.getCurves();
            var t = curves.length;
            for (var i = 0; i < t; i++) {
                curves[i].plot(g, (!i && moveTo));
            }
            if (endFill)
                g.endFill();
        };
        Arc.prototype.toMotifs = function (moveTo, endFill) {
            if (moveTo === void 0) { moveTo = true; }
            if (endFill === void 0) { endFill = false; }
            var curves = this.getCurves();
            var motifs = [];
            var t = curves.length;
            for (var i = 0; i < t; i++) {
                motifs = motifs.concat(curves[i].toMotifs(!i && moveTo));
            }
            if (endFill)
                motifs.push(['E']);
            return motifs;
        };
        Arc.prototype.clone = function () {
            var a = new Arc(this._cx, this._cy, this._rx, this._ry, this._rotation, this._angleStart, this._angleExtent);
            a.matrix = zanejs.concat(a.matrix, this.matrix);
            return a;
        };
        Arc.prototype.toString = function () {
            return '(cx=' +
                this._cx + ', cy=' + this._cy + ', rx=' +
                this._rx + ', ry=' + this._ry + ', rotation=' +
                this._rotation + ', angleStart=' +
                this._angleStart + ', angleExtent=' +
                this._angleExtent + ')';
        };
        return Arc;
    }());
    zanejs.Arc = Arc;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var CubicBezier = (function () {
        function CubicBezier(c1, c2, p1, p2) {
            this.c1 = c1;
            this.c2 = c2;
            this.p1 = p1;
            this.p2 = p2;
        }
        CubicBezier.toQuadratics = function (c) {
            var anchors = [];
            var controls = [];
            var baseLines = CubicBezier.getBaseLines(c);
            var subLines = CubicBezier.getSubLines(c, .5);
            anchors[0] = baseLines[0].start;
            anchors[1] = subLines[3].middle;
            anchors[2] = subLines[2].middle;
            anchors[3] = subLines[4].middle;
            anchors[4] = baseLines[2].end;
            controls[0] = subLines[3].start;
            controls[1] = zanejs.Line.getPoint(subLines[2], .125);
            controls[2] = zanejs.Line.getPoint(subLines[2], .875);
            controls[3] = zanejs.Line.getPoint(baseLines[2], .625);
            var quads = [];
            var n = 4;
            while (n--) {
                quads[n] = new zanejs.QuadraticBezier(controls[n], anchors[n], anchors[n + 1]);
            }
            return quads;
        };
        CubicBezier.getPoint = function (c, ratio) {
            if (ratio !== 0 && ratio !== 1) {
                return zanejs.Line.getPoint(CubicBezier.getSubLines(c, ratio)[2], ratio);
            }
            else if (ratio) {
                return c.p2;
            }
            else {
                return c.p1;
            }
        };
        CubicBezier.segment = function (c, start, end) {
            if (start === void 0) { start = 0; }
            if (end === void 0) { end = 1; }
            return new CubicBezier(zanejs.Line.getPoint(CubicBezier.getSubLines(c, start)[2], end), zanejs.Line.getPoint(CubicBezier.getSubLines(c, end)[2], start), CubicBezier.getPoint(c, start), CubicBezier.getPoint(c, end));
        };
        CubicBezier.split = function (c, ratio) {
            if (ratio === void 0) { ratio = .5; }
            return [CubicBezier.segment(c, 0, ratio), CubicBezier.segment(c, ratio, 1)];
        };
        CubicBezier.getBaseLines = function (c) {
            return [
                new zanejs.Line(c.p1, c.c1),
                new zanejs.Line(c.c1, c.c2),
                new zanejs.Line(c.c2, c.p2)
            ];
        };
        CubicBezier.getSubLines = function (c, ratio) {
            var subLines = [];
            var baseLines = CubicBezier.getBaseLines(c);
            subLines[0] = new zanejs.Line(zanejs.Line.getPoint(baseLines[0], ratio), zanejs.Line.getPoint(baseLines[1], ratio));
            subLines[1] = new zanejs.Line(zanejs.Line.getPoint(baseLines[1], ratio), zanejs.Line.getPoint(baseLines[2], ratio));
            subLines[2] = new zanejs.Line(zanejs.Line.getPoint(subLines[0], ratio), zanejs.Line.getPoint(subLines[1], ratio));
            subLines[3] = new zanejs.Line(zanejs.Line.getPoint(baseLines[0], .375), zanejs.Line.getPoint(subLines[2], .125));
            subLines[4] = new zanejs.Line(zanejs.Line.getPoint(baseLines[2], .625), zanejs.Line.getPoint(subLines[2], .875));
            return subLines;
        };
        CubicBezier.prototype.setPoints = function (c1, c2, p1, p2) {
            this.c1 = c1;
            this.c2 = c2;
            this.p1 = p1;
            this.p2 = p2;
        };
        CubicBezier.prototype.plot = function (g, moveTo) {
            if (moveTo === void 0) { moveTo = true; }
            var quads = CubicBezier.toQuadratics(this);
            if (moveTo)
                g.moveTo(quads[0].p1.x, quads[0].p1.y);
            var n = quads.length;
            for (var i = 0; i < n; i++) {
                quads[i].plot(g, false);
            }
        };
        CubicBezier.prototype.toMotifs = function (moveTo) {
            if (moveTo === void 0) { moveTo = false; }
            var motifs = [];
            if (moveTo)
                motifs.push(['M', [zanejs.limitPrecision(this.p1.x), zanejs.limitPrecision(this.p1.y)]]);
            var quads = CubicBezier.toQuadratics(this);
            var n = quads.length;
            for (var i = 0; i < n; i++) {
                motifs = motifs.concat(quads[i].toMotifs());
            }
            return motifs;
        };
        CubicBezier.prototype.transform = function (t) {
            return new CubicBezier(zanejs.transformPoint(t, this.c1), zanejs.transformPoint(t, this.c2), zanejs.transformPoint(t, this.p1), zanejs.transformPoint(t, this.p2));
        };
        CubicBezier.prototype.clone = function () {
            return new CubicBezier(this.c1, this.c2, this.p1, this.p2);
        };
        CubicBezier.prototype.toString = function () {
            return '(c1='
                + '(x=' + this.c1.x + ', y=' + this.c1.y + ')'
                + ', c2='
                + '(x=' + this.c2.x + ', y=' + this.c2.y + ')'
                + ', p1='
                + '(x=' + this.p1.x + ', y=' + this.p1.y + ')'
                + ', p2='
                + '(x=' + this.p2.x + ', y=' + this.p2.y + ')'
                + ')';
        };
        return CubicBezier;
    }());
    zanejs.CubicBezier = CubicBezier;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var Ellipse = (function () {
        function Ellipse(cx, cy, rx, ry) {
            this.cx = cx;
            this.cy = cy;
            this.rx = rx;
            this.ry = ry;
            this.matrix = new PIXI.Matrix();
        }
        Object.defineProperty(Ellipse.prototype, "rotation", {
            get: function () { return zanejs.getRotation(this.matrix); },
            set: function (value) {
                value -= this.rotation;
                this.matrix = zanejs.rotateAroundInternalPoint(this.matrix, new PIXI.Point(this.cx, this.cy), value);
            },
            enumerable: true,
            configurable: true
        });
        Ellipse.prototype.getCurves = function () {
            var top = this.cy - this.ry;
            var left = this.cx - this.rx;
            var right = this.cx + this.rx;
            var bottom = this.cy + this.ry;
            var dx = this.rx * Ellipse.CONTROL_DISTANCE;
            var dy = this.ry * Ellipse.CONTROL_DISTANCE;
            var curves = [];
            curves[0] = new zanejs.CubicBezier(new PIXI.Point(right, this.cy - dy), new PIXI.Point(this.cx + dx, top), new PIXI.Point(right, this.cy), new PIXI.Point(this.cx, top));
            curves[1] = new zanejs.CubicBezier(new PIXI.Point(this.cx - dx, top), new PIXI.Point(left, this.cy - dy), new PIXI.Point(this.cx, top), new PIXI.Point(left, this.cy));
            curves[2] = new zanejs.CubicBezier(new PIXI.Point(left, this.cy + dy), new PIXI.Point(this.cx - dx, bottom), new PIXI.Point(left, this.cy), new PIXI.Point(this.cx, bottom));
            curves[3] = new zanejs.CubicBezier(new PIXI.Point(this.cx + dx, bottom), new PIXI.Point(right, this.cy + dy), new PIXI.Point(this.cx, bottom), new PIXI.Point(right, this.cy));
            return curves;
        };
        Ellipse.prototype.transform = function (transformMatrix) {
            var e = this.clone();
            zanejs.concat(e.matrix, transformMatrix);
            return e;
        };
        Ellipse.prototype.plot = function (g, moveTo, endFill) {
            if (moveTo === void 0) { moveTo = true; }
            if (endFill === void 0) { endFill = true; }
            var curves = this.getCurves();
            for (var i = 0; i < 4; i++) {
                curves[i].transform(this.matrix).plot(g, (!i && moveTo));
            }
            if (endFill)
                g.endFill();
        };
        Ellipse.prototype.toMotifs = function (moveTo, endFill) {
            if (moveTo === void 0) { moveTo = true; }
            if (endFill === void 0) { endFill = true; }
            var curves = this.getCurves();
            var motifs = [];
            var c;
            for (var i = 0; i < 4; i++) {
                c = curves[i].transform(this.matrix);
                motifs = motifs.concat(c.toMotifs(!i && moveTo));
            }
            if (endFill)
                motifs.push(['E']);
            return motifs;
        };
        Ellipse.prototype.getPoint = function (ratio) {
            return this.getPointByRadianAngle(ratio * Math.PI * 2);
        };
        Ellipse.prototype.getPointByAngle = function (angle) {
            return this.getPointByRadianAngle(zanejs.degreeToRadians(angle));
        };
        Ellipse.prototype.getPointByRadianAngle = function (radAngle) {
            var px = this.cx + Math.cos(radAngle) * this.rx;
            var py = this.cy + Math.sin(radAngle) * this.ry;
            return zanejs.transformPoint(this.matrix, new PIXI.Point(px, py));
        };
        Ellipse.prototype.clone = function () {
            var e = new Ellipse(this.cx, this.cy, this.rx, this.ry);
            zanejs.concat(e.matrix, this.matrix);
            return e;
        };
        Ellipse.prototype.toString = function () {
            return '(cx=' + this.cx + ', cy=' + this.cy + ', rx=' + this.rx + ', ry=' + this.ry + ')';
        };
        Ellipse.CONTROL_DISTANCE = (4 * (Math.SQRT2 - 1)) / 3;
        return Ellipse;
    }());
    zanejs.Ellipse = Ellipse;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var Line = (function () {
        function Line(start, end) {
            this.start = start;
            this.end = end;
        }
        Object.defineProperty(Line.prototype, "middle", {
            get: function () {
                return Line.getPoint(this, .5);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "length", {
            get: function () {
                return zanejs.distance(this.start, this.end);
            },
            enumerable: true,
            configurable: true
        });
        Line.getPoint = function (line, ratio) {
            if (ratio !== 0 && ratio !== 1) {
                return new PIXI.Point(line.start.x + ((line.end.x - line.start.x) * ratio), line.start.y + ((line.end.y - line.start.y) * ratio));
            }
            else if (ratio) {
                return line.end;
            }
            else {
                return line.start;
            }
        };
        Line.segment = function (line, start, end) {
            if (start === void 0) { start = 0; }
            if (end === void 0) { end = 1; }
            return new Line(Line.getPoint(line, start), Line.getPoint(line, end));
        };
        Line.split = function (line, ratio) {
            if (ratio === void 0) { ratio = .5; }
            return [
                Line.segment(line, 0, ratio),
                Line.segment(line, ratio, 1)
            ];
        };
        Line.prototype.setPoints = function (start, end) {
            this.start = start;
            this.end = end;
        };
        Line.prototype.transform = function (t) {
            return new Line(zanejs.transformPoint(t, this.start), zanejs.transformPoint(t, this.end));
        };
        Line.prototype.plot = function (g, moveTo) {
            if (moveTo === void 0) { moveTo = true; }
            if (moveTo)
                g.moveTo(this.start.x, this.start.y);
            g.lineTo(this.end.x, this.end.y);
        };
        Line.prototype.toMotifs = function (moveTo) {
            if (moveTo === void 0) { moveTo = true; }
            var motifs = [];
            if (moveTo)
                motifs.push(['M', [zanejs.limitPrecision(this.start.x), zanejs.limitPrecision(this.start.y)]]);
            motifs.push(['L', [zanejs.limitPrecision(this.end.x), zanejs.limitPrecision(this.end.y)]]);
            return motifs;
        };
        Line.prototype.clone = function () {
            return new Line(this.start, this.end);
        };
        Line.prototype.toString = function () {
            return '(start='
                + '(x=' + this.start.x + ', y=' + this.start.y + ')'
                + ', end='
                + '(x=' + this.end.x + ', y=' + this.end.y + ')'
                + ')';
        };
        return Line;
    }());
    zanejs.Line = Line;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var Polyline = (function () {
        function Polyline(pts) {
            this._points = pts;
        }
        Object.defineProperty(Polyline.prototype, "points", {
            get: function () { return this._points; },
            set: function (value) {
                this._points = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Polyline.prototype, "length", {
            get: function () {
                var len = 0;
                var tot = this.points.length - 1;
                for (var i = 0; i < tot; i++) {
                    len += zanejs.distance(this.points[i], this.points[i + 1]);
                }
                return len;
            },
            enumerable: true,
            configurable: true
        });
        Polyline.prototype.plot = function (g, moveTo) {
            if (moveTo === void 0) { moveTo = true; }
            if (moveTo)
                g.moveTo(this.points[0].x, this.points[0].y);
            var tot = this.points.length;
            for (var i = 1; i < tot; i++) {
                g.lineTo(this.points[i].x, this.points[i].y);
            }
        };
        Polyline.prototype.toMotifs = function (moveTo) {
            if (moveTo === void 0) { moveTo = true; }
            var motifs = [];
            if (moveTo) {
                motifs.push(['M', [zanejs.limitPrecision(this.points[0].x), zanejs.limitPrecision(this.points[0].y)]]);
            }
            var tot = this.points.length;
            for (var i = 1; i < tot; i++) {
                motifs.push(['L', [zanejs.limitPrecision(this.points[i].x), zanejs.limitPrecision(this.points[i].y)]]);
            }
            return motifs;
        };
        Polyline.prototype.addPoints = function () {
            var pts = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                pts[_i] = arguments[_i];
            }
            this.points = this.points.concat(pts);
        };
        Polyline.prototype.transform = function (matrix) {
            var pts = [];
            var n = this.points.length;
            while (n--) {
                pts[n] = zanejs.transformPoint(matrix, this.points[n]);
            }
            return new Polyline(pts);
        };
        Polyline.prototype.clone = function () {
            return new Polyline(this.points);
        };
        Polyline.prototype.toString = function () {
            return zanejs.toStringArray(this.points);
        };
        return Polyline;
    }());
    zanejs.Polyline = Polyline;
})(zanejs || (zanejs = {}));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var zanejs;
(function (zanejs) {
    var Polygon = (function (_super) {
        __extends(Polygon, _super);
        function Polygon(pts) {
            return _super.call(this, pts) || this;
        }
        Object.defineProperty(Polygon.prototype, "points", {
            set: function (value) {
                this._points = value;
                this._points.push(this._points[0].clone());
            },
            enumerable: true,
            configurable: true
        });
        Polygon.prototype.transform = function (matrix) {
            var pts = [];
            var n = this.points.length;
            while (n--) {
                pts[n] = zanejs.transformPoint(matrix, this.points[n]);
            }
            pts.length -= 1;
            return new Polygon(pts);
        };
        Polygon.prototype.clone = function () {
            throw new Error('method clone() isn\'t available call \'new Polygon(points)\' instead');
        };
        return Polygon;
    }(zanejs.Polyline));
    zanejs.Polygon = Polygon;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var QuadraticBezier = (function () {
        function QuadraticBezier(c, p1, p2) {
            this.c = c;
            this.p1 = p1;
            this.p2 = p2;
        }
        QuadraticBezier.getPoint = function (q, ratio) {
            if (ratio !== 0 && ratio !== 1) {
                return zanejs.Line.getPoint(QuadraticBezier.getSubLine(q, ratio), ratio);
            }
            else if (ratio) {
                return q.p2;
            }
            else {
                return q.p1;
            }
        };
        QuadraticBezier.segment = function (q, start, end) {
            if (start === void 0) { start = 0; }
            if (end === void 0) { end = 1; }
            return new QuadraticBezier(zanejs.Line.getPoint(QuadraticBezier.getSubLine(q, start), end), QuadraticBezier.getPoint(q, start), QuadraticBezier.getPoint(q, end));
        };
        QuadraticBezier.split = function (q, ratio) {
            if (ratio === void 0) { ratio = .5; }
            return [
                QuadraticBezier.segment(q, 0, ratio),
                QuadraticBezier.segment(q, ratio, 1)
            ];
        };
        QuadraticBezier.getBaseLines = function (q) {
            return [
                new zanejs.Line(q.p1, q.c),
                new zanejs.Line(q.c, q.p2)
            ];
        };
        QuadraticBezier.getSubLine = function (q, ratio) {
            var baseLines = QuadraticBezier.getBaseLines(q);
            return new zanejs.Line(zanejs.Line.getPoint(baseLines[0], ratio), zanejs.Line.getPoint(baseLines[1], ratio));
        };
        QuadraticBezier.prototype.plot = function (g, moveTo, endFill) {
            if (moveTo === void 0) { moveTo = true; }
            if (endFill === void 0) { endFill = false; }
            if (moveTo)
                g.moveTo(this.p1.x, this.p1.y);
            g.quadraticCurveTo(this.c.x, this.c.y, this.p2.x, this.p2.y);
            if (endFill)
                g.endFill();
        };
        QuadraticBezier.prototype.toMotifs = function (moveTo, endFill) {
            if (moveTo === void 0) { moveTo = false; }
            if (endFill === void 0) { endFill = false; }
            var motifs = [];
            if (moveTo) {
                motifs.push(['M', [zanejs.limitPrecision(this.p1.x), zanejs.limitPrecision(this.p1.y)]]);
            }
            motifs.push([
                'C',
                [
                    zanejs.limitPrecision(this.c.x),
                    zanejs.limitPrecision(this.c.y),
                    zanejs.limitPrecision(this.p2.x),
                    zanejs.limitPrecision(this.p2.y)
                ]
            ]);
            if (endFill)
                motifs.push(['E']);
            return motifs;
        };
        QuadraticBezier.prototype.transform = function (t) {
            return new QuadraticBezier(zanejs.transformPoint(t, this.c), zanejs.transformPoint(t, this.p1), zanejs.transformPoint(t, this.p2));
        };
        QuadraticBezier.prototype.clone = function () {
            return new QuadraticBezier(this.c, this.p1, this.p2);
        };
        QuadraticBezier.prototype.toString = function () {
            return '(c='
                + '(x=' + this.c.x + ', y=' + this.c.y + ')'
                + ', p1='
                + '(x=' + this.p1.x + ', y=' + this.p1.y + ')'
                + ', p2='
                + '(x=' + this.p2.x + ', y=' + this.p2.y + ')'
                + ')';
        };
        return QuadraticBezier;
    }());
    zanejs.QuadraticBezier = QuadraticBezier;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var Rect = (function () {
        function Rect(x, y, wid, hei, rx, ry) {
            if (rx === void 0) { rx = 0; }
            if (ry === void 0) { ry = 0; }
            this._x = x;
            this._y = y;
            this._wid = wid;
            this._hei = hei;
            this._rx = (rx < wid * .5) ? rx : wid * .5;
            this._ry = (ry < hei * .5) ? ry : hei * .5;
            var right = x + wid;
            var bottom = y + hei;
            var lineX1 = x + this._rx;
            var lineX2 = right - this._rx;
            var lineY1 = y + this._ry;
            var lineY2 = bottom - this._ry;
            this._base = [];
            this._base[0] = new zanejs.Line(new PIXI.Point(lineX1, y), new PIXI.Point(lineX2, y));
            this._base[1] = new zanejs.Line(new PIXI.Point(right, lineY1), new PIXI.Point(right, lineY2));
            this._base[2] = new zanejs.Line(new PIXI.Point(lineX2, bottom), new PIXI.Point(lineX1, bottom));
            this._base[3] = new zanejs.Line(new PIXI.Point(x, lineY2), new PIXI.Point(x, lineY1));
            if (this._rx || this._ry) {
                var dx = this._rx * Rect.CONTROL_DISTANCE;
                var dy = this._ry * Rect.CONTROL_DISTANCE;
                var c1 = new zanejs.CubicBezier(new PIXI.Point(lineX2 + dx, y), new PIXI.Point(right, lineY1 - dy), new PIXI.Point(lineX2, y), new PIXI.Point(right, lineY1));
                var c2 = new zanejs.CubicBezier(new PIXI.Point(right, lineY2 + dy), new PIXI.Point(lineX2 + dx, bottom), new PIXI.Point(right, lineY2), new PIXI.Point(lineX2, bottom));
                var c3 = new zanejs.CubicBezier(new PIXI.Point(lineX1 - dx, bottom), new PIXI.Point(x, lineY2 + dy), new PIXI.Point(lineX1, bottom), new PIXI.Point(x, lineY2));
                var c4 = new zanejs.CubicBezier(new PIXI.Point(x, lineY1 - dy), new PIXI.Point(lineX1 - dx, y), new PIXI.Point(x, lineY1), new PIXI.Point(lineX1, y));
                this._base.splice(1, 0, c1);
                this._base.splice(3, 0, c2);
                this._base.splice(5, 0, c3);
                this._base.splice(7, 0, c4);
            }
            this.matrix = new PIXI.Matrix();
        }
        Rect.prototype.transform = function (transformMatrix) {
            var r = this.clone();
            r.matrix = zanejs.concat(r.matrix, transformMatrix);
            return r;
        };
        Rect.prototype.plot = function (g, moveTo) {
            if (moveTo === void 0) { moveTo = true; }
            if (moveTo) {
                var init = zanejs.transformPoint(this.matrix, new PIXI.Point(this._x + this._rx, this._y));
                g.moveTo(init.x, init.y);
            }
            var t = this._base.length;
            for (var i = 0; i < t; i++) {
                this._base[i].transform(this.matrix).plot(g, false);
            }
        };
        Rect.prototype.toMotifs = function (moveTo) {
            if (moveTo === void 0) { moveTo = true; }
            var motifs = [];
            if (moveTo) {
                var init = zanejs.transformPoint(this.matrix, new PIXI.Point(this._x + this._rx, this._y));
                motifs.push(['M', [zanejs.limitPrecision(init.x), zanejs.limitPrecision(init.y)]]);
            }
            var t = this._base.length;
            for (var i = 0; i < t; i++) {
                motifs = motifs.concat(this._base[i].transform(this.matrix).toMotifs(false));
            }
            return motifs;
        };
        Rect.prototype.clone = function () {
            return new Rect(this._x, this._y, this._wid, this._hei, this._rx, this._ry);
        };
        Rect.CONTROL_DISTANCE = (4 * (Math.SQRT2 - 1)) / 3;
        return Rect;
    }());
    zanejs.Rect = Rect;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var SVGArc = (function (_super) {
        __extends(SVGArc, _super);
        function SVGArc(start, end, rx, ry, rotation, isLarge, isCounterClockwise) {
            if (rotation === void 0) { rotation = 0; }
            if (isLarge === void 0) { isLarge = false; }
            if (isCounterClockwise === void 0) { isCounterClockwise = false; }
            var _this = _super.call(this) || this;
            var midX = (start.x - end.x) / 2;
            var midY = (start.y - end.y) / 2;
            _this._rotation = rotation;
            var radRotation = zanejs.degreeToRadians(rotation);
            var sinRotation = Math.sin(radRotation);
            var cosRotation = Math.cos(radRotation);
            var x1 = cosRotation * midX + sinRotation * midY;
            var y1 = -sinRotation * midX + cosRotation * midY;
            if (rx === 0 || ry === 0) {
                throw new Error('rx and rx can\'t be equal to zero !!');
            }
            _this._rx = Math.abs(rx);
            _this._ry = Math.abs(ry);
            var x12 = x1 * x1;
            var y12 = y1 * y1;
            var rx2 = _this._rx * _this._rx;
            var ry2 = _this._ry * _this._ry;
            var radiiFix = (x12 / rx2) + (y12 / ry2);
            if (radiiFix > 1) {
                _this._rx = Math.sqrt(radiiFix) * _this._rx;
                _this._ry = Math.sqrt(radiiFix) * _this._ry;
                rx2 = _this._rx * _this._rx;
                ry2 = _this._ry * _this._ry;
            }
            var cf = ((rx2 * ry2) - (rx2 * y12) - (ry2 * x12)) / ((rx2 * y12) + (ry2 * x12));
            cf = (cf > 0) ? cf : 0;
            var sqr = Math.sqrt(cf);
            sqr *= (isLarge !== isCounterClockwise) ? 1 : -1;
            var cx1 = sqr * ((_this._rx * y1) / _this._ry);
            var cy1 = sqr * -((_this._ry * x1) / _this._rx);
            _this._cx = (cosRotation * cx1 - sinRotation * cy1) + ((start.x + end.x) / 2);
            _this._cy = (sinRotation * cx1 + cosRotation * cy1) + ((start.y + end.y) / 2);
            var ux = (x1 - cx1) / _this._rx;
            var uy = (y1 - cy1) / _this._ry;
            var vx = (-x1 - cx1) / _this._rx;
            var vy = (-y1 - cy1) / _this._ry;
            var uv = ux * vx + uy * vy;
            var uNorm = Math.sqrt(ux * ux + uy * uy);
            var uvNorm = Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
            var sign;
            sign = (uy < 0) ? -1 : 1;
            _this._angleStart = zanejs.radianToDegree(sign * Math.acos(ux / uNorm));
            sign = ((ux * vy - uy * vx) < 0) ? -1 : 1;
            _this._angleExtent = zanejs.radianToDegree(sign * Math.acos(uv / uvNorm));
            if (!isCounterClockwise && _this._angleExtent > 0) {
                _this._angleExtent -= 360;
            }
            else if (isCounterClockwise && _this._angleExtent < 0) {
                _this._angleExtent += 360;
            }
            _this._angleStart %= 360;
            _this._angleExtent %= 360;
            return _this;
        }
        return SVGArc;
    }(zanejs.Arc));
    zanejs.SVGArc = SVGArc;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var Controller = (function () {
        function Controller(cmd) {
            if (Controller.hasController(cmd)) {
                throw new Error('Controller cmd [' + cmd + '] instance already constructed !');
            }
            this.cmd = cmd;
            Controller.controllerList.push(this);
            this.onRegister();
        }
        Controller.notifyControllers = function (cmd, data, sponsor) {
            if (data === void 0) { data = null; }
            if (sponsor === void 0) { sponsor = null; }
            var i = 0;
            while (i < Controller.controllerList.length) {
                if (Controller.controllerList[i].cmd === cmd) {
                    Controller.controllerList[i].execute(data, sponsor);
                }
                i++;
            }
        };
        Controller.hasController = function (cmd) {
            var len = Controller.controllerList.length;
            for (var i = 0; i < len; ++i) {
                if (Controller.controllerList[i].cmd === cmd) {
                    return true;
                }
            }
            return false;
        };
        Controller.removeController = function (cmd) {
            var len = Controller.controllerList.length;
            for (var i = len - 1; i >= 0; --i) {
                if (Controller.controllerList[i].cmd === cmd) {
                    Controller.controllerList[i].onRemove();
                    Controller.controllerList[i] = null;
                    Controller.controllerList.splice(i, 1);
                    return true;
                }
            }
            return false;
        };
        Controller.prototype.onRegister = function () {
        };
        Controller.prototype.onRemove = function () {
        };
        Controller.prototype.execute = function (data, sponsor) {
            if (data === void 0) { data = null; }
            if (sponsor === void 0) { sponsor = null; }
        };
        Controller.prototype.sendEvent = function (cmd, data, strict) {
            if (data === void 0) { data = null; }
            if (strict === void 0) { strict = false; }
            if (!strict) {
                zanejs.View.notifyViews(cmd, data, this);
            }
            Controller.notifyControllers(cmd, data, this);
        };
        Controller.prototype.registerView = function (name, ViewClass, viewComponent) {
            return new ViewClass(name, viewComponent);
        };
        Controller.prototype.retrieveView = function (name) {
            return zanejs.View.retrieveView(name);
        };
        Controller.prototype.removeView = function (name) {
            zanejs.View.removeView(name);
        };
        Controller.prototype.registerController = function (cmd, ControllClass) {
            return new ControllClass(cmd);
        };
        Controller.prototype.removeController = function (cmd) {
            Controller.removeController(cmd);
        };
        Controller.prototype.registerModel = function (name, ModelClass, data) {
            if (data === void 0) { data = null; }
            return new ModelClass(name, data);
        };
        Controller.prototype.retrieveModel = function (name) {
            return zanejs.Model.retrieveModel(name);
        };
        Controller.prototype.removeModel = function (name) {
            zanejs.Model.removeModel(name);
        };
        Controller.controllerList = [];
        return Controller;
    }());
    zanejs.Controller = Controller;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var MVCApp = (function () {
        function MVCApp() {
        }
        MVCApp.prototype.registerController = function (cmd, controllClass) {
            return new controllClass(cmd);
        };
        MVCApp.prototype.registerModel = function (name, modelClass, data) {
            if (data === void 0) { data = null; }
            return new modelClass(name, data);
        };
        MVCApp.prototype.registerView = function (name, viewClass, viewComponent) {
            return new viewClass(name, viewComponent);
        };
        return MVCApp;
    }());
    zanejs.MVCApp = MVCApp;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var Model = (function () {
        function Model(name, data) {
            if (data === void 0) { data = null; }
            var _this = this;
            this.data = {};
            if (name === undefined || name === '') {
                throw new Error('Model name can not undefined!');
            }
            if (Model.retrieveModel(name) != null) {
                throw new Error('Model[' + name + ']' + ' instance  already constructed !');
            }
            this.name = name;
            if (data != null) {
                Object.keys(data).map(function (key) {
                    _this.data[key] = data[key];
                });
            }
            Model.modelList.push(this);
            this.onRegister();
        }
        Model.retrieveModel = function (name) {
            var len = Model.modelList.length;
            for (var i = 0; i < len; ++i) {
                if (Model.modelList[i].name === name) {
                    return Model.modelList[i];
                }
            }
            return null;
        };
        Model.removeModel = function (name) {
            var len = Model.modelList.length;
            for (var i = len - 1; i >= 0; --i) {
                if (Model.modelList[i].name === name) {
                    Model.modelList[i].onRemove();
                    Model.modelList[i].data = null;
                    Model.modelList[i] = null;
                    Model.modelList.splice(i, 1);
                    break;
                }
            }
        };
        Model.prototype.onRegister = function () {
        };
        Model.prototype.onRemove = function () {
        };
        Model.prototype.sendEvent = function (type, data) {
            if (data === void 0) { data = null; }
            zanejs.View.notifyViews(type, data, this);
        };
        Model.modelList = [];
        return Model;
    }());
    zanejs.Model = Model;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var View = (function () {
        function View(name, viewComponent) {
            this.eventList = [];
            if (name === undefined || name === '') {
                throw new Error('View name can not undefined!');
            }
            if (View.retrieveView(name) != null) {
                throw new Error('View[' + name + '] instance already constructed !');
            }
            this.name = name;
            this.viewComponent = viewComponent;
            this.eventList = this.listEventInterests();
            View.viewList.push(this);
            this.onRegister();
        }
        View.retrieveView = function (name) {
            var len = View.viewList.length;
            for (var i = 0; i < len; ++i) {
                if (View.viewList[i].name === name) {
                    return View.viewList[i];
                }
            }
            return null;
        };
        View.removeView = function (name) {
            var len = View.viewList.length;
            for (var i = 0; i < len; ++i) {
                if (View.viewList[i].name === name) {
                    View.viewList[i].onRemove();
                    View.viewList[i].viewComponent = null;
                    View.viewList[i].eventList = null;
                    View.viewList[i] = null;
                    View.viewList.splice(i, 1);
                    break;
                }
            }
        };
        View.removeViews = function () {
            var argArray = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                argArray[_i] = arguments[_i];
            }
            var len = argArray.length;
            for (var i = 0; i < len; ++i) {
                View.removeView(argArray[i]);
            }
        };
        View.removeAllView = function () {
            var exception = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                exception[_i] = arguments[_i];
            }
            var len = View.viewList.length;
            for (var i = len - 1; i >= 0; i--) {
                if (exception.indexOf(View.viewList[i].name) === -1) {
                    View.viewList[i].onRemove();
                    View.viewList[i].viewComponent = null;
                    View.viewList[i].eventList = null;
                    View.viewList[i] = null;
                    View.viewList.splice(i, 1);
                }
            }
        };
        View.notifyViews = function (type, data, sponsor) {
            if (data === void 0) { data = null; }
            if (sponsor === void 0) { sponsor = null; }
            var len = View.viewList.length;
            var motifyList = [];
            for (var i = 0; i < len; ++i) {
                var eventLen = View.viewList[i].eventList.length;
                for (var k = 0; k < eventLen; ++k) {
                    if (View.viewList[i].eventList[k] === type) {
                        motifyList.push(View.viewList[i]);
                    }
                }
            }
            for (var j = 0; j < motifyList.length; j++) {
                motifyList[j].handleEvent(type, data, sponsor);
            }
        };
        View.prototype.onRegister = function () {
        };
        View.prototype.onRemove = function () {
        };
        View.prototype.listEventInterests = function () {
            return [];
        };
        View.prototype.handleEvent = function (type, data, sponsor) {
            if (data === void 0) { data = null; }
            if (sponsor === void 0) { sponsor = null; }
        };
        View.prototype.sendEvent = function (type, data, strict) {
            if (data === void 0) { data = null; }
            if (strict === void 0) { strict = false; }
            if (!strict) {
                zanejs.Controller.notifyControllers(type, data, this);
            }
            View.notifyViews(type, data, this);
        };
        View.prototype.registerView = function (name, viewClass, viewComponent) {
            return new viewClass(name, viewComponent);
        };
        View.prototype.retrieveView = function (name) {
            return View.retrieveView(name);
        };
        View.prototype.retrieveModel = function (name) {
            return zanejs.Model.retrieveModel(name);
        };
        View.viewList = [];
        return View;
    }());
    zanejs.View = View;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var CSSParser = (function () {
        function CSSParser() {
            this._css = {};
        }
        CSSParser.prototype.parseCSS = function (cssStr) {
            cssStr = zanejs.removeAllComments(cssStr);
            var cssArr = cssStr.match(/([\w \.:\#]+\{.+?\})/g);
            this.parseSelectors(cssArr);
        };
        Object.defineProperty(CSSParser.prototype, "selectors", {
            get: function () {
                var selectors = [];
                Object.keys(this._css).map(function (key) {
                    selectors.push(key);
                });
                return selectors;
            },
            enumerable: true,
            configurable: true
        });
        CSSParser.prototype.getStyle = function (selector) { return this._css[selector]; };
        CSSParser.prototype.setStyle = function (selector, styleObj) {
            if (this._css[selector] === undefined)
                this._css[selector] = {};
            this._css[selector] = styleObj;
        };
        CSSParser.prototype.clear = function () { this._css = {}; };
        CSSParser.prototype.parseSelectors = function (cssArr) {
            var selector;
            var properties;
            var n = cssArr.length;
            for (var i = 0; i < n; i++) {
                selector = zanejs.trim(cssArr[i].match(/.+(?=\{)/g)[0]);
                properties = cssArr[i].match(/(?<=\{).+(?=\})/g)[0];
                this.setStyle(selector, this.parseProperties(properties));
            }
        };
        CSSParser.prototype.parseProperties = function (propStr) {
            var result = {};
            var properties = propStr.match(/\b\w[\w-:\#\/ ,]+/g);
            var curProp;
            var n = properties.length;
            for (var j = 0; j < n; j++) {
                curProp = properties[j].split(':');
                result[zanejs.toCamelCase(curProp[0])] = zanejs.trim(curProp[1]);
            }
            return result;
        };
        return CSSParser;
    }());
    zanejs.CSSParser = CSSParser;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var MotifsToHTML5CanvasCommands = (function () {
        function MotifsToHTML5CanvasCommands() {
            throw new Error('This is a STATIC CLASS and should not be instantiated.');
        }
        MotifsToHTML5CanvasCommands.toCommandsString = function (motifs) {
            var commands = '';
            var n = motifs.length;
            for (var i = 0; i < n; i++) {
                switch (motifs[i][0]) {
                    case 'B':
                        if (MotifsToHTML5CanvasCommands._prevCommand !== 'E') {
                            commands += MotifsToHTML5CanvasCommands.endFill();
                        }
                        if (motifs[i][1].length) {
                            if (!zanejs.compare(motifs[i][1], MotifsToHTML5CanvasCommands._prevFillStyle)) {
                                commands += MotifsToHTML5CanvasCommands.beginFill(motifs[i][1][0], motifs[i][1][1]);
                                MotifsToHTML5CanvasCommands._prevFillStyle = motifs[i][1];
                                commands += '\n';
                            }
                            MotifsToHTML5CanvasCommands._hasFill = true;
                        }
                        else {
                            MotifsToHTML5CanvasCommands._hasFill = false;
                        }
                        break;
                    case 'C':
                        commands += MotifsToHTML5CanvasCommands.quadraticBezier(motifs[i][1][0], motifs[i][1][1], motifs[i][1][2], motifs[i][1][3]);
                        commands += '\n';
                        break;
                    case 'E':
                        if (MotifsToHTML5CanvasCommands._prevCommand !== 'E' &&
                            MotifsToHTML5CanvasCommands._prevCommand !== 'B' &&
                            MotifsToHTML5CanvasCommands._prevCommand !== 'S') {
                            commands += MotifsToHTML5CanvasCommands.endFill();
                        }
                        break;
                    case 'L':
                        commands += MotifsToHTML5CanvasCommands.lineTo(motifs[i][1][0], motifs[i][1][1]);
                        commands += '\n';
                        break;
                    case 'M':
                        if (MotifsToHTML5CanvasCommands._prevCommand === 'E') {
                            MotifsToHTML5CanvasCommands._hasFill = false;
                        }
                        commands += MotifsToHTML5CanvasCommands.moveTo(motifs[i][1][0], motifs[i][1][1]);
                        commands += '\n';
                        break;
                    case 'S':
                        if (MotifsToHTML5CanvasCommands._prevCommand === 'E') {
                            MotifsToHTML5CanvasCommands._hasFill = false;
                        }
                        else if (MotifsToHTML5CanvasCommands._prevCommand !== 'B') {
                            commands += MotifsToHTML5CanvasCommands.endFill();
                        }
                        if (motifs[i][1].length) {
                            if (!zanejs.compare(motifs[i][1], MotifsToHTML5CanvasCommands._prevLineStyle)) {
                                commands += MotifsToHTML5CanvasCommands.lineStyle(motifs[i][1][0], motifs[i][1][1], motifs[i][1][2], motifs[i][1][3], motifs[i][1][4], motifs[i][1][5], motifs[i][1][6], motifs[i][1][7]);
                                MotifsToHTML5CanvasCommands._prevLineStyle = motifs[i][1];
                                commands += '\n';
                            }
                            MotifsToHTML5CanvasCommands._hasStroke = true;
                        }
                        else {
                            MotifsToHTML5CanvasCommands._hasStroke = false;
                        }
                        break;
                    default:
                }
                MotifsToHTML5CanvasCommands._prevCommand = motifs[i][0];
            }
            if (MotifsToHTML5CanvasCommands._prevCommand !== 'E') {
                commands += MotifsToHTML5CanvasCommands.endFill();
            }
            MotifsToHTML5CanvasCommands._prevFillStyle.length = 0;
            MotifsToHTML5CanvasCommands._prevLineStyle.length = 0;
            MotifsToHTML5CanvasCommands._prevCommand = '';
            MotifsToHTML5CanvasCommands._hasFill = false;
            MotifsToHTML5CanvasCommands._hasStroke = false;
            return commands;
        };
        MotifsToHTML5CanvasCommands.beginFill = function (color, alpha) {
            if (alpha === void 0) { alpha = 1; }
            var output = '';
            output += 'context.fillStyle = "';
            output += MotifsToHTML5CanvasCommands.parseColor(color, alpha);
            output += '";';
            return output;
        };
        MotifsToHTML5CanvasCommands.parseColor = function (color, alpha) {
            if (alpha === void 0) { alpha = 1; }
            if (alpha < 1) {
                return zanejs.uintToRGBA(color, alpha);
            }
            else if (color) {
                var hex = color.toString(16);
                if (hex.length < 6) {
                    hex = zanejs.padLeft(hex, '0', 6 - hex.length);
                }
                return '#' + hex;
            }
            else {
                return '#000000';
            }
        };
        MotifsToHTML5CanvasCommands.quadraticBezier = function (cx, cy, px, py) {
            var args = [];
            for (var i = 0; i < arguments.length; ++i) {
                args.push(arguments[i]);
            }
            return 'context.quadraticCurveTo(' + args.join(',') + ');';
        };
        MotifsToHTML5CanvasCommands.endFill = function () {
            var output = '';
            output += (MotifsToHTML5CanvasCommands._hasFill) ? 'context.fill();\n' : '';
            output += (MotifsToHTML5CanvasCommands._hasStroke) ? 'context.stroke();\n' : '';
            output += 'context.beginPath();\n';
            MotifsToHTML5CanvasCommands._prevCommand = 'E';
            return output;
        };
        MotifsToHTML5CanvasCommands.lineTo = function (x, y) {
            var args = [];
            for (var i = 0; i < arguments.length; ++i) {
                args.push(arguments[i]);
            }
            return 'context.lineTo(' + args.join(',') + ');';
        };
        MotifsToHTML5CanvasCommands.moveTo = function (x, y) {
            var args = [];
            for (var i = 0; i < arguments.length; ++i) {
                args.push(arguments[i]);
            }
            return 'context.moveTo(' + args.join(',') + ');';
        };
        MotifsToHTML5CanvasCommands.lineStyle = function (thickness, color, alpha, pixelHinting, scaleMode, caps, joints, miterLimit) {
            if (thickness === void 0) { thickness = NaN; }
            if (color === void 0) { color = 0x000000; }
            if (alpha === void 0) { alpha = 1; }
            if (pixelHinting === void 0) { pixelHinting = false; }
            if (scaleMode === void 0) { scaleMode = 'normal'; }
            if (caps === void 0) { caps = 'none'; }
            if (joints === void 0) { joints = ''; }
            if (miterLimit === void 0) { miterLimit = 3; }
            var output = '';
            if (thickness !== MotifsToHTML5CanvasCommands._prevLineStyle[0] && !isNaN(thickness)) {
                output += 'context.lineWidth = ' + thickness + ';';
            }
            if (!isNaN(color) && !isNaN(alpha) &&
                (color !== MotifsToHTML5CanvasCommands._prevLineStyle[1] ||
                    alpha !== MotifsToHTML5CanvasCommands._prevLineStyle[2])) {
                output += (output !== '') ? '\n' : '';
                output += 'context.strokeStyle = "' + MotifsToHTML5CanvasCommands.parseColor(color, alpha) + '";';
            }
            if (caps !== MotifsToHTML5CanvasCommands._prevLineStyle[5] &&
                (caps !== 'none' || MotifsToHTML5CanvasCommands._prevLineStyle[5] !== 'butt')) {
                caps = (caps === 'none' || !caps) ? 'butt' : caps;
                output += (output !== '') ? '\n' : '';
                output += 'context.lineCap = "' + caps + '"';
            }
            if (joints !== MotifsToHTML5CanvasCommands._prevLineStyle[6]) {
                joints = (!joints) ? 'miter' : joints;
                output += (output !== '') ? '\n' : '';
                output += 'context.lineJoin = "' + joints + '"';
            }
            if (miterLimit !== MotifsToHTML5CanvasCommands._prevLineStyle[7] && !isNaN(miterLimit)) {
                output += (output !== '') ? '\n' : '';
                output += 'context.miterLimit = ' + miterLimit;
            }
            return output;
        };
        MotifsToHTML5CanvasCommands._prevFillStyle = [];
        MotifsToHTML5CanvasCommands._prevLineStyle = [];
        return MotifsToHTML5CanvasCommands;
    }());
    zanejs.MotifsToHTML5CanvasCommands = MotifsToHTML5CanvasCommands;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var MotifsToPixiGraphicsCommands = (function () {
        function MotifsToPixiGraphicsCommands() {
        }
        MotifsToPixiGraphicsCommands.toCommandsString = function (motifs) {
            var commands = '';
            var n = motifs.length;
            commands += 'class SVG extends PIXI.Graphics {\n';
            commands += '\tconstructor() {\n';
            commands += '\t\tsuper();\n';
            for (var i = 0; i < n; i++) {
                switch (motifs[i][0]) {
                    case 'B':
                        if (MotifsToPixiGraphicsCommands._prevCommand !== 'E') {
                            commands += MotifsToPixiGraphicsCommands.endFill();
                        }
                        if (motifs[i][1].length) {
                            if (!zanejs.compare(motifs[i][1], MotifsToPixiGraphicsCommands._prevFillStyle)) {
                                commands += MotifsToPixiGraphicsCommands.beginFill(motifs[i][1][0], motifs[i][1][1]);
                                MotifsToPixiGraphicsCommands._prevFillStyle = motifs[i][1];
                                commands += '\n';
                            }
                            MotifsToPixiGraphicsCommands._hasFill = true;
                        }
                        else {
                            MotifsToPixiGraphicsCommands._hasFill = false;
                        }
                        break;
                    case 'C':
                        commands += MotifsToPixiGraphicsCommands.quadraticBezier(motifs[i][1][0], motifs[i][1][1], motifs[i][1][2], motifs[i][1][3]);
                        commands += '\n';
                        break;
                    case 'E':
                        if (MotifsToPixiGraphicsCommands._prevCommand !== 'E' &&
                            MotifsToPixiGraphicsCommands._prevCommand !== 'B' &&
                            MotifsToPixiGraphicsCommands._prevCommand !== 'S') {
                            commands += MotifsToPixiGraphicsCommands.endFill();
                        }
                        break;
                    case 'L':
                        commands += MotifsToPixiGraphicsCommands.lineTo(motifs[i][1][0], motifs[i][1][1]);
                        commands += '\n';
                        break;
                    case 'M':
                        if (MotifsToPixiGraphicsCommands._prevCommand === 'E') {
                            MotifsToPixiGraphicsCommands._hasFill = false;
                        }
                        commands += MotifsToPixiGraphicsCommands.moveTo(motifs[i][1][0], motifs[i][1][1]);
                        commands += '\n';
                        break;
                    case 'S':
                        if (MotifsToPixiGraphicsCommands._prevCommand === 'E') {
                            MotifsToPixiGraphicsCommands._hasFill = false;
                        }
                        else if (MotifsToPixiGraphicsCommands._prevCommand !== 'B') {
                            commands += MotifsToPixiGraphicsCommands.endFill();
                        }
                        if (motifs[i][1].length) {
                            if (!zanejs.compare(motifs[i][1], MotifsToPixiGraphicsCommands._prevLineStyle)) {
                                commands += MotifsToPixiGraphicsCommands.lineStyle(motifs[i][1][0], motifs[i][1][1], motifs[i][1][2], motifs[i][1][3], motifs[i][1][4], motifs[i][1][5], motifs[i][1][6], motifs[i][1][7]);
                                MotifsToPixiGraphicsCommands._prevLineStyle = motifs[i][1];
                                commands += '\n';
                            }
                            MotifsToPixiGraphicsCommands._hasStroke = true;
                        }
                        else {
                            MotifsToPixiGraphicsCommands._hasStroke = false;
                        }
                        break;
                    default:
                }
                MotifsToPixiGraphicsCommands._prevCommand = motifs[i][0];
            }
            if (MotifsToPixiGraphicsCommands._prevCommand !== 'E') {
                commands += MotifsToPixiGraphicsCommands.endFill();
            }
            commands += '\t}\n';
            commands += '}\n';
            MotifsToPixiGraphicsCommands._prevFillStyle.length = 0;
            MotifsToPixiGraphicsCommands._prevLineStyle.length = 0;
            MotifsToPixiGraphicsCommands._prevCommand = '';
            MotifsToPixiGraphicsCommands._hasFill = false;
            MotifsToPixiGraphicsCommands._hasStroke = false;
            return commands;
        };
        MotifsToPixiGraphicsCommands.lineStyle = function (thickness, color, alpha, pixelHinting, scaleMode, caps, joints, miterLimit) {
            if (thickness === void 0) { thickness = NaN; }
            if (color === void 0) { color = 0x000000; }
            if (alpha === void 0) { alpha = 1; }
            if (pixelHinting === void 0) { pixelHinting = false; }
            if (scaleMode === void 0) { scaleMode = 'normal'; }
            if (caps === void 0) { caps = 'none'; }
            if (joints === void 0) { joints = ''; }
            if (miterLimit === void 0) { miterLimit = 3; }
            var output = '';
            output += '\t\tthis.lineStyle(' + thickness + ', ' + color + ', ' + alpha + ')';
            return output;
        };
        MotifsToPixiGraphicsCommands.beginFill = function (color, alpha) {
            if (alpha === void 0) { alpha = 1; }
            var output = '';
            output += '\t\tthis.beginFill(' + color + ', ' + alpha + ')';
            return output;
        };
        MotifsToPixiGraphicsCommands.lineTo = function (x, y) {
            var args = [];
            for (var i = 0; i < arguments.length; ++i) {
                args.push(arguments[i]);
            }
            return '\t\tthis.lineTo(' + args.join(',') + ');';
        };
        MotifsToPixiGraphicsCommands.moveTo = function (x, y) {
            var args = [];
            for (var i = 0; i < arguments.length; ++i) {
                args.push(arguments[i]);
            }
            return '\t\tthis.moveTo(' + args.join(',') + ');';
        };
        MotifsToPixiGraphicsCommands.quadraticBezier = function (cx, cy, px, py) {
            var args = [];
            for (var i = 0; i < arguments.length; ++i) {
                args.push(arguments[i]);
            }
            return '\t\tthis.quadraticCurveTo(' + args.join(',') + ');';
        };
        MotifsToPixiGraphicsCommands.endFill = function () {
            var output = '';
            output += '\t\tthis.endFill();\n';
            MotifsToPixiGraphicsCommands._prevCommand = 'E';
            return output;
        };
        MotifsToPixiGraphicsCommands._prevFillStyle = [];
        MotifsToPixiGraphicsCommands._prevLineStyle = [];
        return MotifsToPixiGraphicsCommands;
    }());
    zanejs.MotifsToPixiGraphicsCommands = MotifsToPixiGraphicsCommands;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var SVGToMotifs = (function () {
        function SVGToMotifs() {
            throw new Error('This is a STATIC CLASS and should not be instantiated.');
        }
        SVGToMotifs.getWarnings = function () { return SVGToMotifs._warnings; };
        SVGToMotifs.parse = function (svg) {
            SVGToMotifs._motifs.length = 0;
            SVGToMotifs.clearWarnings();
            SVGToMotifs._initAnchor = new PIXI.Point();
            SVGToMotifs._prevAnchor = new PIXI.Point();
            SVGToMotifs._prevControl = new PIXI.Point();
            SVGToMotifs._curMatrix = new PIXI.Matrix();
            var xmlObject = zanejs.stringToXMLDom(svg);
            SVGToMotifs.parseTags(xmlObject.children);
            SVGToMotifs._warnings += (SVGToMotifs._eWarnings.length)
                ? 'WARNING: Elements ['
                    + SVGToMotifs._eWarnings.join(', ')
                    + '] are not supported and will be ignored.\n'
                : '';
            SVGToMotifs._warnings += (SVGToMotifs._aWarnings.length)
                ? 'WARNING: Attributes ['
                    + SVGToMotifs._aWarnings.join(', ')
                    + '] are not supported and will be ignored.\n'
                : '';
            SVGToMotifs._warnings += (SVGToMotifs._pWarnings.length)
                ? 'WARNING: Path drawing commands ['
                    + SVGToMotifs._pWarnings.join(', ')
                    + '] are not supported and will be ignored.\n'
                : '';
            SVGToMotifs._warnings += (SVGToMotifs._tWarnings.length)
                ? 'WARNING: Transform commands ['
                    + SVGToMotifs._tWarnings.join(', ')
                    + '] are not supported and will be ignored.\n'
                : '';
            return SVGToMotifs._motifs;
        };
        SVGToMotifs.parseTags = function (elm, parentAtt) {
            if (parentAtt === void 0) { parentAtt = null; }
            var tag;
            var tagName = '';
            var elmAtt = {};
            var m = elm.length;
            for (var i = 0; i < m; i++) {
                tag = elm[i];
                tagName = tag.nodeName;
                tagName = tagName.replace(/.*::/, '');
                elmAtt = SVGToMotifs.mergeAttributes(parentAtt, SVGToMotifs.parseAttributes(tag.attributes));
                if (SVGToMotifs.SUPPORTED_TAG.indexOf(tagName) > -1) {
                    SVGToMotifs.parseElements(tagName, elmAtt);
                }
                else {
                    SVGToMotifs.parseTags(tag.children, elmAtt);
                }
            }
        };
        SVGToMotifs.parseAttributes = function (attList) {
            var n = attList.length;
            var att = {};
            var aName = '';
            while (n--) {
                aName = attList[n].nodeName + '';
                att[aName] = (aName !== 'transform')
                    ? attList[n].value
                    : SVGToMotifs.parseTransform(attList[n]);
                SVGToMotifs.validateAttribute(aName);
            }
            if (att.style !== undefined) {
                var styleStr = (att.style + '').replace(/\;/g, ',');
                var styleObj_1 = zanejs.toObject(styleStr);
                Object.keys(styleObj_1).map(function (key) {
                    att[key] = styleObj_1[key];
                });
            }
            return att;
        };
        SVGToMotifs.parseElements = function (type, att) {
            if (att.fill !== 'none') {
                var fillColor = (att.fill !== undefined) ? zanejs.colorToUint(att.fill) : 0;
                var fillOpacity = (att['fill-opacity'] !== undefined) ? att['fill-opacity'] : 1;
                fillOpacity *= (att.opacity !== undefined) ? att.opacity : 1;
                SVGToMotifs._motifs.push(['B', [fillColor, zanejs.limitPrecision(fillOpacity)]]);
            }
            else if (type === 'line') {
                att.fill = 0;
                SVGToMotifs._motifs.push(['B', []]);
            }
            if (att.stroke !== undefined || att['stroke-width'] !== undefined) {
                var thickness = (att['stroke-width'] !== undefined) ? att['stroke-width'] : 1;
                var strokeColor = (att.stroke !== undefined) ? zanejs.colorToUint(att.stroke) : 0;
                var strokeOpacity = (att['stroke-opacity'] !== undefined) ? att['stroke-opacity'] : 1;
                strokeOpacity *= (att.opacity !== undefined) ? att.opacity : 1;
                var caps = (att['stroke-linecap'] !== undefined && att['stroke-linecap'] !== 'butt')
                    ? att['stroke-linecap']
                    : 'none';
                var joints = (att['stroke-linejoin'] !== undefined) ? att['stroke-linejoin'] : null;
                var miterlimit = (att['stroke-miterlimit'] !== undefined) ? att['stroke-miterlimit'] : 3;
                SVGToMotifs._motifs.push(['S', [zanejs.limitPrecision(thickness), strokeColor,
                        zanejs.limitPrecision(strokeOpacity), false, 'normal', caps, joints, miterlimit]]);
            }
            else {
                SVGToMotifs._motifs.push(['S', []]);
            }
            if (att.transform) {
                SVGToMotifs._curMatrix = att.transform;
                SVGToMotifs._hasTransform = true;
            }
            else {
                SVGToMotifs._hasTransform = false;
            }
            switch (type) {
                case 'circle':
                    SVGToMotifs.eCircle(att.cx, att.cy, att.r);
                    break;
                case 'ellipse':
                    SVGToMotifs.eEllipse(att.cx, att.cy, att.rx, att.ry);
                    break;
                case 'line':
                    SVGToMotifs.eLine(att.x1, att.y1, att.x2, att.y2);
                    break;
                case 'path':
                    SVGToMotifs.ePath(att.d);
                    break;
                case 'polygon':
                    SVGToMotifs.ePolygon(att.points);
                    break;
                case 'polyline':
                    SVGToMotifs.ePolyline(att.points);
                    break;
                case 'rect':
                    SVGToMotifs.eRect(parseFloat(att.x), parseFloat(att.y), parseFloat(att.width), parseFloat(att.height), parseFloat(att.rx), parseFloat(att.ry));
                    break;
                default:
                    if (SVGToMotifs._eWarnings.indexOf(type) < 0) {
                        SVGToMotifs._eWarnings.push(type);
                    }
                    break;
            }
            if (att.fill !== 'none') {
                SVGToMotifs._motifs.push(['E']);
            }
        };
        SVGToMotifs.parseTransform = function (str) {
            var mat = new PIXI.Matrix();
            var transforms = str.match(/[a-zA-Z]+\([\d\-\., ]+\)/g);
            var parts;
            var command;
            var params;
            var n = transforms.length;
            while (n--) {
                parts = (transforms[n] + '').split('(');
                command = parts[0] + '';
                params = (parts[1] + '').match(/[\d\-\.]+/g);
                switch (command) {
                    case 'matrix':
                        mat = zanejs.concat(mat, new PIXI.Matrix(params[0], params[1], params[2], params[3], params[4], params[5]));
                        break;
                    case 'rotate':
                        if (params.length > 1) {
                            mat = zanejs.rotateAroundExternalPoint(mat, new PIXI.Point(params[1], params[2]), params[0]);
                        }
                        else {
                            mat.rotate(zanejs.degreeToRadians(params[0]));
                        }
                        break;
                    case 'scale':
                        if (params.length === 1) {
                            params[1] = params[0];
                        }
                        mat.scale(params[0], params[1]);
                        break;
                    case 'skewX':
                        var sX = zanejs.getSkewX(mat);
                        mat = zanejs.setSkewX(mat, sX + params[0]);
                        break;
                    case 'skewY':
                        var sY = zanejs.getSkewY(mat);
                        mat = zanejs.setSkewY(mat, sY + params[0]);
                        break;
                    case 'translate':
                        mat.translate(params[0], params[1]);
                        break;
                    default:
                        if (SVGToMotifs._tWarnings.indexOf(command) < 0) {
                            SVGToMotifs._tWarnings.push(command);
                        }
                        break;
                }
            }
            return mat;
        };
        SVGToMotifs.validateAttribute = function (att) {
            if (SVGToMotifs.SUPPORTED_ATT.indexOf(att) < 0) {
                if (SVGToMotifs._aWarnings.indexOf(att) < 0) {
                    SVGToMotifs._aWarnings.push(att);
                }
            }
        };
        SVGToMotifs.mergeAttributes = function (base, extend) {
            var merged = {};
            if (base) {
                Object.keys(base).map(function (key) {
                    merged[key] = base[key];
                });
            }
            if (extend) {
                Object.keys(extend).map(function (key) {
                    if (key === 'opacity' && merged.hasOwnProperty(key)) {
                        merged[key] = parseFloat(merged[key]) * parseFloat(extend[key]);
                    }
                    else if (key === 'transform' && merged.hasOwnProperty(key)) {
                    }
                    else {
                        merged[key] = extend[key];
                    }
                });
            }
            return merged;
        };
        SVGToMotifs.clearWarnings = function () {
            SVGToMotifs._eWarnings.length = 0;
            SVGToMotifs._aWarnings.length = 0;
            SVGToMotifs._pWarnings.length = 0;
            SVGToMotifs._tWarnings.length = 0;
            SVGToMotifs._warnings = '';
        };
        SVGToMotifs.eCircle = function (cx, cy, r) {
            var circle = new zanejs.Ellipse(cx, cy, r, r);
            if (SVGToMotifs._hasTransform) {
                circle = circle.transform(SVGToMotifs._curMatrix);
            }
            SVGToMotifs._motifs = SVGToMotifs._motifs.concat(circle.toMotifs());
        };
        SVGToMotifs.eEllipse = function (cx, cy, rx, ry) {
            var ellipse = new zanejs.Ellipse(cx, cy, rx, ry);
            if (SVGToMotifs._hasTransform) {
                ellipse = ellipse.transform(SVGToMotifs._curMatrix);
            }
            SVGToMotifs._motifs = SVGToMotifs._motifs.concat(ellipse.toMotifs());
        };
        SVGToMotifs.eLine = function (x1, y1, x2, y2) {
            var line = new zanejs.Line(new PIXI.Point(x1, y1), new PIXI.Point(x2, y2));
            if (SVGToMotifs._hasTransform) {
                line = line.transform(SVGToMotifs._curMatrix);
            }
            SVGToMotifs._motifs = SVGToMotifs._motifs.concat(line.toMotifs());
        };
        SVGToMotifs.ePolygon = function (pts, isClosed) {
            if (isClosed === void 0) { isClosed = true; }
            var pArr = zanejs.trim(pts).split(/\s+/);
            var n = pArr.length;
            while (n--) {
                pArr[n] = pArr[n].split(',');
                pArr[n] = new PIXI.Point(pArr[n][0], pArr[n][1]);
            }
            if (isClosed) {
                var polygon = new zanejs.Polygon(pArr);
                if (SVGToMotifs._hasTransform) {
                    polygon = polygon.transform(SVGToMotifs._curMatrix);
                }
                SVGToMotifs._motifs = SVGToMotifs._motifs.concat(polygon.toMotifs());
            }
            else {
                var polyline = new zanejs.Polyline(pArr);
                if (SVGToMotifs._hasTransform) {
                    polyline = polyline.transform(SVGToMotifs._curMatrix);
                }
                SVGToMotifs._motifs = SVGToMotifs._motifs.concat(polyline.toMotifs());
            }
        };
        SVGToMotifs.ePolyline = function (pts) {
            SVGToMotifs.ePolygon(pts, false);
        };
        SVGToMotifs.eRect = function (x, y, wid, hei, rx, ry) {
            if (rx === void 0) { rx = 0; }
            if (ry === void 0) { ry = 0; }
            var rect = new zanejs.Rect(x, y, wid, hei, rx, ry);
            if (SVGToMotifs._hasTransform) {
                rect = rect.transform(SVGToMotifs._curMatrix);
            }
            SVGToMotifs._motifs = SVGToMotifs._motifs.concat(rect.toMotifs());
        };
        SVGToMotifs.ePath = function (d) {
            if (!d)
                return;
            SVGToMotifs._initAnchor.x = SVGToMotifs._initAnchor.y = 0;
            SVGToMotifs._prevAnchor.x = SVGToMotifs._prevAnchor.y = 0;
            SVGToMotifs._prevControl.x = SVGToMotifs._prevControl.y = 0;
            SVGToMotifs._prevControl.x = SVGToMotifs._prevControl.y = 0;
            var commands = d.match(/(?:[a-zA-Z] ?(?:[0-9.-],? ?)+)|(?:z|Z)/g);
            var n = commands.length;
            var temp = '';
            for (var i = 0; i < n; i++) {
                temp = zanejs.trim(zanejs.removeMultipleSpaces(commands[i]));
                temp = temp.replace(/([a-zA-Z]) /g, '$1');
                temp = zanejs.removeAllWhiteSpaces(temp, ',');
                temp = temp.replace(/((?<![a-zA-Z]|,)-)/g, ',$&');
                commands[i] = (temp.length > 1)
                    ? [temp.substr(0, 1), temp.substr(1).split(',')]
                    : [parseFloat(temp.substr(0, 1))];
            }
            if ((commands[0][0] + '').toLowerCase() === 'm') {
                SVGToMotifs._initAnchor.x = commands[0][1][0];
                SVGToMotifs._initAnchor.y = commands[0][1][1];
                if (SVGToMotifs._hasTransform) {
                    SVGToMotifs._initAnchor = zanejs.transformPoint(SVGToMotifs._curMatrix, SVGToMotifs._initAnchor);
                }
            }
            SVGToMotifs._prevCommand = '';
            for (var j = 0; j < n; j++) {
                if (SVGToMotifs._prevCommand && SVGToMotifs._prevCommand.toLowerCase() === 'z') {
                    SVGToMotifs._initAnchor.x = commands[j][1][0];
                    SVGToMotifs._initAnchor.y = commands[j][1][1];
                    if (SVGToMotifs._hasTransform) {
                        SVGToMotifs._initAnchor = zanejs.transformPoint(SVGToMotifs._curMatrix, SVGToMotifs._initAnchor);
                    }
                }
                switch (commands[j][0]) {
                    case 'A':
                        SVGToMotifs.pArc(commands[j][1]);
                        break;
                    case 'a':
                        SVGToMotifs.pArc(commands[j][1], true);
                        break;
                    case 'C':
                        SVGToMotifs.pCubic(commands[j][1]);
                        break;
                    case 'c':
                        SVGToMotifs.pCubic(commands[j][1], true);
                        break;
                    case 'H':
                        SVGToMotifs.pLine(commands[j][1][0], SVGToMotifs._prevAnchor.y);
                        break;
                    case 'h':
                        SVGToMotifs.pLine(SVGToMotifs.toAbsoluteX(commands[j][1][0]), SVGToMotifs._prevAnchor.y);
                        break;
                    case 'L':
                        SVGToMotifs.pLine(commands[j][1][0], commands[j][1][1]);
                        break;
                    case 'l':
                        SVGToMotifs.pLine(SVGToMotifs.toAbsoluteX(commands[j][1][0]), SVGToMotifs.toAbsoluteY(commands[j][1][1]));
                        break;
                    case 'M':
                        SVGToMotifs.pMove(commands[j][1][0], commands[j][1][1]);
                        break;
                    case 'm':
                        SVGToMotifs.pMove(SVGToMotifs.toAbsoluteX(commands[j][1][0]), SVGToMotifs.toAbsoluteY(commands[j][1][1]));
                        break;
                    case 'Q':
                        SVGToMotifs.pQuad(commands[j][1]);
                        break;
                    case 'q':
                        SVGToMotifs.pQuad(commands[j][1], true);
                        break;
                    case 'S':
                        SVGToMotifs.pSmoothCubic(commands[j][1]);
                        break;
                    case 's':
                        SVGToMotifs.pSmoothCubic(commands[j][1], true);
                        break;
                    case 'T':
                        SVGToMotifs.pSmoothQuad(commands[j][1]);
                        break;
                    case 't':
                        SVGToMotifs.pSmoothQuad(commands[j][1], true);
                        break;
                    case 'V':
                        SVGToMotifs.pLine(SVGToMotifs._prevAnchor.x, commands[j][1][0]);
                        break;
                    case 'v':
                        SVGToMotifs.pLine(SVGToMotifs._prevAnchor.x, SVGToMotifs.toAbsoluteY(commands[j][1][0]));
                        break;
                    case 'Z':
                    case 'z':
                        SVGToMotifs.pClose();
                        break;
                    default:
                        if (SVGToMotifs._pWarnings.indexOf(commands[j][0]) < 0) {
                            SVGToMotifs._pWarnings.push(commands[j][0]);
                        }
                        break;
                }
                SVGToMotifs._prevCommand = commands[j][0];
            }
            if ((commands[commands.length - 1][0] + '').toLowerCase() !== 'z' ||
                commands[commands.length - 1][1] !== commands[0][1]) {
                SVGToMotifs._motifs.push(['S', []]);
            }
        };
        SVGToMotifs.pArc = function (params, isRelative) {
            if (isRelative === void 0) { isRelative = false; }
            var end = new PIXI.Point(params[5], params[6]);
            if (isRelative)
                SVGToMotifs.toAbsolute(end);
            var arc = new zanejs.SVGArc(SVGToMotifs._prevAnchor, end, params[0], params[1], params[2], (params[3] === '1'), (params[4] === '1'));
            if (SVGToMotifs._hasTransform) {
                arc.matrix = SVGToMotifs._curMatrix;
                end = zanejs.transformPoint(SVGToMotifs._curMatrix, end);
            }
            SVGToMotifs._motifs = SVGToMotifs._motifs.concat(arc.toMotifs(false));
            SVGToMotifs._prevAnchor = end;
        };
        SVGToMotifs.pCubic = function (params, isRelative) {
            if (isRelative === void 0) { isRelative = false; }
            var _params = [];
            var c1 = new PIXI.Point(params[0], params[1]);
            var c2 = new PIXI.Point(params[2], params[3]);
            var p2 = new PIXI.Point(params[4], params[5]);
            for (var i = 0; i < params.length; ++i) {
                _params.push(params[i]);
                if (_params.length === 6) {
                    c1.set(_params[0], _params[1]);
                    c2.set(_params[2], _params[3]);
                    p2.set(_params[4], _params[5]);
                    if (isRelative) {
                        SVGToMotifs.toAbsolute(c1);
                        SVGToMotifs.toAbsolute(c2);
                        SVGToMotifs.toAbsolute(p2);
                    }
                    var bezier = new zanejs.CubicBezier(c1, c2, SVGToMotifs._prevAnchor, p2);
                    if (SVGToMotifs._hasTransform) {
                        bezier = bezier.transform(SVGToMotifs._curMatrix);
                    }
                    SVGToMotifs._motifs = SVGToMotifs._motifs.concat(bezier.toMotifs());
                    _params = [];
                }
            }
            SVGToMotifs._prevAnchor = p2;
            SVGToMotifs._prevControl = c2;
        };
        SVGToMotifs.pSmoothCubic = function (params, isRelative) {
            if (isRelative === void 0) { isRelative = false; }
            var c1 = (SVGToMotifs._prevCommand.toUpperCase() === 'C' ||
                SVGToMotifs._prevCommand.toUpperCase() === 'S')
                ? zanejs.reflectPoint(SVGToMotifs._prevControl, SVGToMotifs._prevAnchor)
                : SVGToMotifs._prevAnchor;
            if (isRelative)
                SVGToMotifs.toRelative(c1);
            SVGToMotifs.pCubic([c1.x, c1.y, params[0], params[1], params[2], params[3]], isRelative);
        };
        SVGToMotifs.pLine = function (endX, endY) {
            var p = new PIXI.Point(endX, endY);
            SVGToMotifs._prevAnchor = p;
            if (SVGToMotifs._hasTransform) {
                p = zanejs.transformPoint(SVGToMotifs._curMatrix, p);
            }
            SVGToMotifs._motifs.push(['L', [zanejs.limitPrecision(p.x), zanejs.limitPrecision(p.y)]]);
        };
        SVGToMotifs.pMove = function (x, y) {
            var p = new PIXI.Point(x, y);
            SVGToMotifs._prevAnchor = p;
            if (SVGToMotifs._hasTransform) {
                p = zanejs.transformPoint(SVGToMotifs._curMatrix, p);
            }
            SVGToMotifs._motifs.push(['M', [zanejs.limitPrecision(p.x), zanejs.limitPrecision(p.y)]]);
        };
        SVGToMotifs.pQuad = function (params, isRelative) {
            if (isRelative === void 0) { isRelative = false; }
            var _params = [];
            var c = new PIXI.Point(params[0], params[1]);
            var p2 = new PIXI.Point(params[2], params[3]);
            for (var i = 0; i < params.length; ++i) {
                _params.push(params[i]);
                if (_params.length === 4) {
                    c.set(_params[0], _params[1]);
                    p2.set(_params[2], _params[3]);
                    if (isRelative) {
                        SVGToMotifs.toRelative(c);
                        SVGToMotifs.toRelative(p2);
                    }
                    var quad = new zanejs.QuadraticBezier(c, SVGToMotifs._prevAnchor, p2);
                    if (SVGToMotifs._hasTransform) {
                        quad.transform(SVGToMotifs._curMatrix);
                    }
                    SVGToMotifs._motifs = SVGToMotifs._motifs.concat(quad.toMotifs());
                    _params = [];
                }
            }
            SVGToMotifs._prevControl = c;
            SVGToMotifs._prevAnchor = p2;
        };
        SVGToMotifs.pSmoothQuad = function (params, isRelative) {
            if (isRelative === void 0) { isRelative = false; }
            var c = (SVGToMotifs._prevCommand.toUpperCase() === 'Q' ||
                SVGToMotifs._prevCommand.toUpperCase() === 'T')
                ? zanejs.reflectPoint(SVGToMotifs._prevControl, SVGToMotifs._prevAnchor)
                : SVGToMotifs._prevAnchor;
            SVGToMotifs.pQuad([c.x, c.y, params[0], params[1]], isRelative);
        };
        SVGToMotifs.pClose = function () {
            SVGToMotifs._motifs.push(['L', [SVGToMotifs._initAnchor.x, SVGToMotifs._initAnchor.y]]);
        };
        SVGToMotifs.toAbsolute = function (p) {
            p.x += SVGToMotifs._prevAnchor.x;
            p.y += SVGToMotifs._prevAnchor.y;
        };
        SVGToMotifs.toRelative = function (p) {
            p.x -= SVGToMotifs._prevAnchor.x;
            p.y -= SVGToMotifs._prevAnchor.y;
        };
        SVGToMotifs.toAbsoluteX = function (x) {
            return x + SVGToMotifs._prevAnchor.x;
        };
        SVGToMotifs.toAbsoluteY = function (y) {
            return y + SVGToMotifs._prevAnchor.y;
        };
        SVGToMotifs._eWarnings = [];
        SVGToMotifs._aWarnings = [];
        SVGToMotifs._pWarnings = [];
        SVGToMotifs._tWarnings = [];
        SVGToMotifs._motifs = [];
        SVGToMotifs._warnings = '';
        SVGToMotifs.SUPPORTED_ATT = [
            'cx',
            'cy',
            'd',
            'fill',
            'fill-opacity',
            'height',
            'opacity',
            'points',
            'r',
            'rx',
            'ry',
            'stroke',
            'stroke-linecap',
            'stroke-linejoin',
            'stroke-miterlimit',
            'stroke-opacity',
            'stroke-width',
            'style',
            'transform',
            'width',
            'x',
            'x1',
            'x2',
            'y',
            'y1',
            'y2'
        ];
        SVGToMotifs.SUPPORTED_TAG = [
            'circle',
            'ellipse',
            'line',
            'path',
            'polygon',
            'polyline',
            'rect'
        ];
        return SVGToMotifs;
    }());
    zanejs.SVGToMotifs = SVGToMotifs;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function ajax(options) {
        var url = options.url || '', type = (options.type || 'get').toLowerCase(), data = options.data || null, contentType = options.contentType || '', dataType = options.dataType || '', async = options.async === undefined && true, timeOut = options.timeOut, before = options.before || function () { }, error = options.error || function () { }, success = options.success || function () { }, timeoutBool = false, timeoutFlag = null, xhr = null;
        function setData() {
            var name, value;
            if (data) {
                if (typeof data === 'string') {
                    data = data.split('&');
                    for (var i = 0, len = data.length; i < len; i++) {
                        name = data[i].split('=')[0];
                        value = data[i].split('=')[1];
                        data[i] = encodeURIComponent(name) + '=' + encodeURIComponent(value);
                    }
                    data = data.replace('/%20/g', '+');
                }
                else if (typeof data === 'object') {
                    var arr = [];
                    Object.keys(data).map(function (key) {
                        value = data[key].toString();
                        key = encodeURIComponent(key);
                        value = encodeURIComponent(value);
                        arr.push(key + '=' + value);
                    });
                    data = arr.join('&').replace('/%20/g', '+');
                }
                if (type === 'get' || dataType === 'jsonp') {
                    url += url.indexOf('?') > -1 ? data : '?' + data;
                }
            }
        }
        function createJsonp() {
            var script = document.createElement('script'), timeName = new Date().getTime() + Math.round(Math.random() * 1000), callback = 'JSONP_' + timeName;
            window.callback = function ($data) {
                clearTimeout(timeoutFlag);
                document.body.removeChild(script);
                success($data);
            };
            script.src = url + (url.indexOf('?') > -1 ? '&' : '?') + 'callback=' + callback;
            script.type = 'text/javascript';
            document.body.appendChild(script);
            setTime(callback, script);
        }
        function setTime(callback, script) {
            if (timeOut !== undefined) {
                timeoutFlag = setTimeout(function () {
                    if (dataType === 'jsonp') {
                        delete window.callback;
                        document.body.removeChild(script);
                    }
                    else {
                        timeoutBool = true;
                        if (xhr) {
                            xhr.abort();
                        }
                    }
                }, timeOut);
            }
        }
        function createXHR() {
            function getXHR() {
                if (typeof XMLHttpRequest !== 'undefined') {
                    return new XMLHttpRequest();
                }
                else {
                    var versions = ['Microsoft', 'msxm3', 'msxml2', 'msxml1'];
                    for (var i = 0; i < versions.length; i++) {
                        try {
                            var version = versions[i] + '.XMLHTTP';
                            var cls = 'ActiveXObject';
                            return new window.cls(version);
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                }
            }
            xhr = getXHR();
            xhr.responseType = dataType;
            xhr.open(type, url, async);
            if (type === 'post' && !contentType) {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
            }
            else if (contentType) {
                xhr.setRequestHeader('Content-Type', contentType);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (timeOut !== undefined) {
                        if (timeoutBool) {
                            return;
                        }
                        clearTimeout(timeoutFlag);
                    }
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                        success(xhr.response || xhr.responseText);
                    }
                    else {
                        error(xhr.status, xhr.statusText);
                    }
                }
            };
            xhr.send(type === 'get' ? null : data);
            setTime('', null);
        }
        setData();
        before();
        if (dataType === 'jsonp') {
            createJsonp();
        }
        else {
            createXHR();
        }
    }
    zanejs.ajax = ajax;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function compare(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        else {
            var n = arr1.length;
            for (var i = 0; i < n; i++) {
                if (arr1[i] !== arr2[i])
                    return false;
            }
        }
        return true;
    }
    zanejs.compare = compare;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function randomSort(arr) {
        function randomize(elementA, elementB) {
            var r = Math.random();
            if (r < .3333333334) {
                return -1;
            }
            else if (r > .3333333333 && r < .6666666667) {
                return 0;
            }
            else {
                return 1;
            }
        }
        return arr.sort(randomize);
    }
    zanejs.randomSort = randomSort;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function removeEmptyItems(arr) {
        function isNotEmpty(item, index, array) {
            return zanejs.getQualifiedClassName(item) === void 0 ? false : true;
        }
        return arr.filter(isNotEmpty);
    }
    zanejs.removeEmptyItems = removeEmptyItems;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function toStringArray(arr) {
        var str = '[';
        function checkType(item, index, array) {
            str += (!index) ? '' : ',';
            switch (zanejs.getQualifiedClassName(item)) {
                case 'Array':
                    str += '[';
                    item.forEach(checkType);
                    str += ']';
                    break;
                case 'Object':
                    str += '{';
                    Object.keys(item).map(function (prop) {
                        str += prop + ':';
                        checkType(item[prop], 0, []);
                        str += ',';
                    });
                    str = str.substr(0, str.length - 1) + '}';
                    break;
                case 'String':
                    str += '\'' + item + '\'';
                    break;
                case 'void':
                    break;
                default:
                    str += item;
            }
        }
        arr.forEach(checkType);
        return str + ']';
    }
    zanejs.toStringArray = toStringArray;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function colorToHex(color) {
        if (isNaN(color)) {
            if (/\#(:?\w{6}|\w{3})/.test(color)) {
                return color;
            }
            else if (/rgb\(\d+\,\d+\,\d+\)/.test(color)) {
                return zanejs.rgbToHex(color);
            }
            else if (/[a-z]+/.test(color)) {
                return zanejs.htmlColorToHex(color);
            }
            else {
                return '#000000';
            }
        }
        else {
            return zanejs.uintToHex(color);
        }
    }
    zanejs.colorToHex = colorToHex;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function colorToUint(color) {
        if (/^rgb\(\d+\,\d+\,\d+\)/.test(color)) {
            return zanejs.rgbToUint(color);
        }
        else if (/^\#(:?\w{6}|\w{3})/.test(color)) {
            return zanejs.hexToUint(color);
        }
        else if (/^[a-zA-Z]+/.test(color)) {
            return zanejs.htmlColorToUint(color);
        }
        else {
            return zanejs.uint(color);
        }
    }
    zanejs.colorToUint = colorToUint;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function fadeColor(startColor, endColor, position) {
        var r = startColor >> 16;
        var g = startColor >> 8 & 0xFF;
        var b = startColor & 0xFF;
        r += ((endColor >> 16) - r) * position;
        g += ((endColor >> 8 & 0xFF) - g) * position;
        b += ((endColor & 0xFF) - b) * position;
        return (r << 16 | g << 8 | b);
    }
    zanejs.fadeColor = fadeColor;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var _htmlColors = null;
    function getHtmlColors() {
        if (!_htmlColors) {
            _htmlColors = {
                aliceblue: '#F0F8FF',
                antiquewhite: '#FAEBD7',
                aqua: '#00FFFF',
                aquamarine: '#7FFFD4',
                azure: '#F0FFFF',
                beige: '#F5F5DC',
                bisque: '#FFE4C4',
                black: '#000000',
                blanchedalmond: '#FFEBCD',
                blue: '#0000FF',
                blueviolet: '#8A2BE2',
                brown: '#A52A2A',
                burlywood: '#DEB887',
                cadetblue: '#5F9EA0',
                chartreuse: '#7FFF00',
                chocolate: '#D2691E',
                coral: '#FF7F50',
                cornflowerblue: '#6495ED',
                cornsilk: '#FFF8DC',
                crimson: '#DC143C',
                cyan: '#00FFFF',
                darkblue: '#00008B',
                darkcyan: '#008B8B',
                darkgoldenrod: '#B8860B',
                darkgray: '#A9A9A9',
                darkgreen: '#006400',
                darkgrey: '#A9A9A9',
                darkkhaki: '#BDB76B',
                darkmagenta: '#8B008B',
                darkolivegreen: '#556B2F',
                darkorange: '#FF8C00',
                darkorchid: '#9932CC',
                darkred: '#8B0000',
                darksalmon: '#E9967A',
                darkseagreen: '#8FBC8F',
                darkslateblue: '#483D8B',
                darkslategray: '#2F4F4F',
                darkslategrey: '#2F4F4F',
                darkturquoise: '#00CED1',
                darkviolet: '#9400D3',
                deeppink: '#FF1493',
                deepskyblue: '#00BFFF',
                dimgray: '#696969',
                dimgrey: '#696969',
                dodgerblue: '#1E90FF',
                firebrick: '#B22222',
                floralwhite: '#FFFAF0',
                forestgreen: '#228B22',
                fuchsia: '#FF00FF',
                gainsboro: '#DCDCDC',
                ghostwhite: '#F8F8FF',
                gold: '#FFD700',
                goldenrod: '#DAA520',
                gray: '#808080',
                green: '#008000',
                greenyellow: '#ADFF2F',
                grey: '#808080',
                honeydew: '#F0FFF0',
                hotpink: '#FF69B4',
                indianred: ' #CD5C5C',
                indigo: ' #4B0082',
                ivory: '#FFFFF0',
                khaki: '#F0E68C',
                lavender: '#E6E6FA',
                lavenderblush: '#FFF0F5',
                lawngreen: '#7CFC00',
                lemonchiffon: '#FFFACD',
                lightblue: '#ADD8E6',
                lightcoral: '#F08080',
                lightcyan: '#E0FFFF',
                lightgoldenrodyellow: '#FAFAD2',
                lightgray: '#D3D3D3',
                lightgreen: '#90EE90',
                lightgrey: '#D3D3D3',
                lightpink: '#FFB6C1',
                lightsalmon: '#FFA07A',
                lightseagreen: '#20B2AA',
                lightskyblue: '#87CEFA',
                lightslategray: '#778899',
                lightslategrey: '#778899',
                lightsteelblue: '#B0C4DE',
                lightyellow: '#FFFFE0',
                lime: '#00FF00',
                limegreen: '#32CD32',
                linen: '#FAF0E6',
                magenta: '#FF00FF',
                maroon: '#800000',
                mediumaquamarine: '#66CDAA',
                mediumblue: '#0000CD',
                mediumorchid: '#BA55D3',
                mediumpurple: '#9370D8',
                mediumseagreen: '#3CB371',
                mediumslateblue: '#7B68EE',
                mediumspringgreen: '#00FA9A',
                mediumturquoise: '#48D1CC',
                mediumvioletred: '#C71585',
                midnightblue: '#191970',
                mintcream: '#F5FFFA',
                mistyrose: '#FFE4E1',
                moccasin: '#FFE4B5',
                navajowhite: '#FFDEAD',
                navy: '#000080',
                oldlace: '#FDF5E6',
                olive: '#808000',
                olivedrab: '#6B8E23',
                orange: '#FFA500',
                orangered: '#FF4500',
                orchid: '#DA70D6',
                palegoldenrod: '#EEE8AA',
                palegreen: '#98FB98',
                paleturquoise: '#AFEEEE',
                palevioletred: '#D87093',
                papayawhip: '#FFEFD5',
                peachpuff: '#FFDAB9',
                peru: '#CD853F',
                pink: '#FFC0CB',
                plum: '#DDA0DD',
                powderblue: '#B0E0E6',
                purple: '#800080',
                red: '#FF0000',
                rosybrown: '#BC8F8F',
                royalblue: '#4169E1',
                saddlebrown: '#8B4513',
                salmon: '#FA8072',
                sandybrown: '#F4A460',
                seagreen: '#2E8B57',
                seashell: '#FFF5EE',
                sienna: '#A0522D',
                silver: '#C0C0C0',
                skyblue: '#87CEEB',
                slateblue: '#6A5ACD',
                slategray: '#708090',
                slategrey: '#708090',
                snow: '#FFFAFA',
                springgreen: '#00FF7F',
                steelblue: '#4682B4',
                tan: '#D2B48C',
                teal: '#008080',
                thistle: '#D8BFD8',
                tomato: '#FF6347',
                turquoise: '#40E0D0',
                violet: '#EE82EE',
                wheat: '#F5DEB3',
                white: '#FFFFFF',
                whitesmoke: '#F5F5F5',
                yellow: '#FFFF00',
                yellowgreen: '#9ACD32'
            };
        }
        return _htmlColors;
    }
    zanejs.getHtmlColors = getHtmlColors;
    function cleanHtmlColors() {
        _htmlColors = null;
    }
    zanejs.cleanHtmlColors = cleanHtmlColors;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function hexToUint(hex) {
        hex = hex || '';
        hex = hex.replace('#', '').toUpperCase();
        if (hex.length === 3) {
            hex = hex.replace(/(\w)/g, '$&$&');
        }
        return zanejs.uint('0x' + hex);
    }
    zanejs.hexToUint = hexToUint;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function htmlColorToHex(htmlColorName) {
        return zanejs.getHtmlColors()[htmlColorName.toLowerCase()];
    }
    zanejs.htmlColorToHex = htmlColorToHex;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function htmlColorToUint(htmlColorName) {
        return zanejs.hexToUint(zanejs.htmlColorToHex(htmlColorName));
    }
    zanejs.htmlColorToUint = htmlColorToUint;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function percToUint(perc) {
        var x = zanejs.uint(perc.replace('%', ''));
        return zanejs.uint(x * 2.55);
    }
    zanejs.percToUint = percToUint;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function rgbToHex(rgb) {
        return zanejs.uintToHex(zanejs.rgbToUint(rgb));
    }
    zanejs.rgbToHex = rgbToHex;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function rgbToUint(rgb) {
        var colors = rgb
            .replace(' ', '')
            .replace(/[()]/g, '')
            .substr(3)
            .split(',');
        var r = (isNaN(parseInt(colors[0], 10)))
            ? zanejs.percToUint(colors[0])
            : parseInt(colors[0], 10);
        var g = (isNaN(parseInt(colors[1], 10)))
            ? zanejs.percToUint(colors[1])
            : parseInt(colors[1], 10);
        var b = (isNaN(parseInt(colors[2], 10)))
            ? zanejs.percToUint(colors[2])
            : parseInt(colors[2], 10);
        return (r << 16 | g << 8 | b);
    }
    zanejs.rgbToUint = rgbToUint;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function uintToHex(u) {
        return '#' + u.toString(16).toUpperCase();
    }
    zanejs.uintToHex = uintToHex;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function uintToRGBA(color, alpha) {
        if (alpha === void 0) { alpha = 1; }
        var hex = color.toString(16);
        if (hex.length < 6) {
            hex = zanejs.padLeft(hex, '0', 6 - hex.length);
        }
        var channels = hex.match(/[0-9a-fA-F]{2}/g);
        var r = parseInt(channels[0], 16);
        var g = parseInt(channels[1], 16);
        var b = parseInt(channels[2], 16);
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    }
    zanejs.uintToRGBA = uintToRGBA;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    zanejs.PI = Math.PI;
    zanejs.DEG_TO_RAD = zanejs.PI / 180;
    zanejs.RAD_TO_DEG = 180 / zanejs.PI;
    function degreeToRadians(degree) {
        return degree * zanejs.DEG_TO_RAD;
    }
    zanejs.degreeToRadians = degreeToRadians;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function plotPoint(g, p, color, size) {
        if (color === void 0) { color = 0xFF0000; }
        if (size === void 0) { size = 2; }
        g.beginFill(color);
        g.drawCircle(p.x, p.y, size);
        g.endFill();
    }
    zanejs.plotPoint = plotPoint;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function radianToDegree(radian) {
        return radian * zanejs.RAD_TO_DEG;
    }
    zanejs.radianToDegree = radianToDegree;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function reflectPoint(point, pivot) {
        var rx = pivot.x - point.x;
        var ry = pivot.y - point.y;
        return new PIXI.Point(pivot.x + rx, pivot.y + ry);
    }
    zanejs.reflectPoint = reflectPoint;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function concat(m1, m2) {
        var a = m1.a * m2.a;
        var b = 0.0;
        var c = 0.0;
        var d = m1.d * m2.d;
        var tx = m1.tx * m2.a + m2.tx;
        var ty = m1.ty * m2.d + m2.ty;
        if (m1.b !== 0.0 || m1.c !== 0.0 || m2.b !== 0.0 || m2.c !== 0.0) {
            a += m1.b * m2.c;
            d += m1.c * m2.b;
            b += m1.a * m2.b + m1.b * m2.d;
            c += m1.c * m2.a + m1.d * m2.c;
            tx += m1.ty * m2.c;
            ty += m1.tx * m2.b;
        }
        m1.a = a;
        m1.b = b;
        m1.c = c;
        m1.d = d;
        m1.tx = tx;
        m1.ty = ty;
        return m1;
    }
    zanejs.concat = concat;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function getRotation(m) {
        return zanejs.radianToDegree(zanejs.getRotationRadians(m));
    }
    zanejs.getRotation = getRotation;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function getRotationRadians(m) {
        return zanejs.getSkewYRadians(m);
    }
    zanejs.getRotationRadians = getRotationRadians;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function getScaleX(m) {
        return Math.sqrt(m.a * m.a + m.b * m.b);
    }
    zanejs.getScaleX = getScaleX;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function getScaleY(m) {
        return Math.sqrt(m.c * m.c + m.d * m.d);
    }
    zanejs.getScaleY = getScaleY;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function getSkewX(m) {
        return zanejs.radianToDegree(Math.atan2(-m.c, m.d));
    }
    zanejs.getSkewX = getSkewX;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function getSkewXRadians(m) {
        return Math.atan2(-m.c, m.d);
    }
    zanejs.getSkewXRadians = getSkewXRadians;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function getSkewY(m) {
        return zanejs.radianToDegree(Math.atan2(m.b, m.a));
    }
    zanejs.getSkewY = getSkewY;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function getSkewYRadians(m) {
        return Math.atan2(m.b, m.a);
    }
    zanejs.getSkewYRadians = getSkewYRadians;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function matchInternalPointWithExternal(m, internalPoint, externalPoint) {
        var mat = m.clone();
        var p = zanejs.transformPoint(mat, internalPoint);
        var dx = externalPoint.x - p.x;
        var dy = externalPoint.y - p.y;
        mat.tx += dx;
        mat.ty += dy;
        return mat;
    }
    zanejs.matchInternalPointWithExternal = matchInternalPointWithExternal;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function rotateAroundExternalPoint(m, pivot, angleDegrees) {
        var mat = m.clone();
        mat.tx -= pivot.x;
        mat.ty -= pivot.y;
        mat.rotate(zanejs.degreeToRadians(angleDegrees));
        mat.tx += pivot.x;
        mat.ty += pivot.y;
        return mat;
    }
    zanejs.rotateAroundExternalPoint = rotateAroundExternalPoint;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function rotateAroundInternalPoint(m, pivot, angleDegrees) {
        pivot = zanejs.transformPoint(m, pivot);
        return zanejs.rotateAroundExternalPoint(m, pivot, angleDegrees);
    }
    zanejs.rotateAroundInternalPoint = rotateAroundInternalPoint;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function setRotation(m, value) {
        return zanejs.setRotationRadians(m, zanejs.degreeToRadians(value));
    }
    zanejs.setRotation = setRotation;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function setRotationRadians(m, value) {
        var curRotation = zanejs.getRotationRadians(m);
        var curSkewX = zanejs.getSkewXRadians(m);
        var mat = zanejs.setSkewXRadians(m, curSkewX + value - curRotation);
        return zanejs.setSkewYRadians(mat, value);
    }
    zanejs.setRotationRadians = setRotationRadians;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function setScaleX(m, value) {
        var mat = m.clone();
        var sx = zanejs.getScaleX(mat);
        if (sx) {
            var ratio = value / sx;
            mat.a *= ratio;
            mat.b *= ratio;
        }
        else {
            var skewYRad = zanejs.getSkewYRadians(mat);
            mat.a = Math.cos(skewYRad) * value;
            mat.b = Math.sin(skewYRad) * value;
        }
        return mat;
    }
    zanejs.setScaleX = setScaleX;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function setScaleY(m, value) {
        var mat = m.clone();
        var sy = zanejs.getScaleY(mat);
        if (sy) {
            var ratio = value / sy;
            mat.c *= ratio;
            mat.d *= ratio;
        }
        else {
            var skewXRad = zanejs.getSkewXRadians(mat);
            mat.c = -Math.sin(skewXRad) * value;
            mat.d = Math.cos(skewXRad) * value;
        }
        return mat;
    }
    zanejs.setScaleY = setScaleY;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function setSkewX(m, value) {
        return zanejs.setSkewXRadians(m, zanejs.degreeToRadians(value));
    }
    zanejs.setSkewX = setSkewX;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function setSkewXRadians(m, value) {
        var mat = m.clone();
        var sy = zanejs.getScaleY(mat);
        mat.c = -sy * Math.sin(value);
        mat.d = sy * Math.cos(value);
        return mat;
    }
    zanejs.setSkewXRadians = setSkewXRadians;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function setSkewY(m, value) {
        return zanejs.setSkewYRadians(m, zanejs.degreeToRadians(value));
    }
    zanejs.setSkewY = setSkewY;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function setSkewYRadians(m, value) {
        var mat = m.clone();
        var sx = zanejs.getScaleX(mat);
        mat.a = sx * Math.cos(value);
        mat.b = sx * Math.sin(value);
        return mat;
    }
    zanejs.setSkewYRadians = setSkewYRadians;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function transformPoint(m, pivot, resultPoint) {
        var x = m.a * pivot.x + m.c * pivot.y + m.tx;
        var y = m.b * pivot.x + m.d * pivot.y + m.ty;
        if (resultPoint) {
            resultPoint.x = x;
            resultPoint.y = y;
            return resultPoint;
        }
        return new PIXI.Point(x, y);
    }
    zanejs.transformPoint = transformPoint;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function limitPrecision(n, maxPrecision) {
        if (maxPrecision === void 0) { maxPrecision = 2; }
        n = parseFloat(n + '');
        if (isNaN(n))
            n = 0;
        return parseFloat(n.toFixed(maxPrecision));
    }
    zanejs.limitPrecision = limitPrecision;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function uint(value) {
        return parseInt(value, undefined) >>> 32;
    }
    zanejs.uint = uint;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function getQualifiedClassName(value) {
        var type = typeof value;
        if (!value || (type !== 'object' && !value.prototype)) {
            return type;
        }
        var prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        if (prototype.hasOwnProperty('__class__')) {
            return prototype.__class__;
        }
        var constructorString = prototype.constructor.toString().trim();
        var index = constructorString.indexOf('(');
        var className = constructorString.substring(9, index);
        Object.defineProperty(prototype, '__class__', {
            value: className,
            enumerable: false,
            writable: true
        });
        return className;
    }
    zanejs.getQualifiedClassName = getQualifiedClassName;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function merge(base, extend) {
        var merged = {};
        Object.keys(base).map(function (key) {
            merged[key] = base[key];
        });
        Object.keys(extend).map(function (prop) {
            merged[prop] = extend[prop];
        });
        return merged;
    }
    zanejs.merge = merge;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function toObject(objString) {
        var o = {};
        objString = objString.replace(/\{|\}/g, '');
        var tmpArr = objString.split(',');
        var n = tmpArr.length;
        while (n--) {
            tmpArr[n] = (tmpArr[n]).toString().split(':');
            o[zanejs.trim(tmpArr[n][0])] = zanejs.trim(tmpArr[n][1]);
        }
        return o;
    }
    zanejs.toObject = toObject;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function distance(p1, p2) {
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
    }
    zanejs.distance = distance;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function addcslashes(str, charlist) {
        if (charlist === void 0) { charlist = ''; }
        var target = '';
        var chrs = [];
        var i = 0;
        var j = 0;
        var c = '';
        var next = '';
        var regExpMatchArray = null;
        var rangeBegin = '';
        var rangeEnd = '';
        var $chr = '';
        var begin = 0;
        var end = 0;
        var octalLength = 0;
        var postOctalPos = 0;
        var cca = 0;
        var escHexGrp = [];
        var encoded = '';
        var percentHex = /%([\dA-Fa-f]+)/g;
        var _pad = function ($n, $c) {
            if (($n = $n + '').length < $c) {
                return new Array(++$c - $n.length).join('0') + $n;
            }
            return $n;
        };
        for (i = 0; i < charlist.length; i++) {
            c = charlist.charAt(i);
            next = charlist.charAt(i + 1);
            if (c === '\\' && next && (/\d/).test(next)) {
                regExpMatchArray = charlist.slice(i + 1).match(/^\d+/);
                rangeBegin = regExpMatchArray[0];
                octalLength = rangeBegin.length;
                postOctalPos = i + octalLength + 1;
                if (charlist.charAt(postOctalPos) + charlist.charAt(postOctalPos + 1) === '..') {
                    begin = rangeBegin.charCodeAt(0);
                    if ((/\\\d/).test(charlist.charAt(postOctalPos + 2) + charlist.charAt(postOctalPos + 3))) {
                        regExpMatchArray = charlist.slice(postOctalPos + 3).match(/^\d+/);
                        rangeEnd = regExpMatchArray[0];
                        i += 1;
                    }
                    else if (charlist.charAt(postOctalPos + 2)) {
                        rangeEnd = charlist.charAt(postOctalPos + 2);
                    }
                    else {
                        throw new Error('Range with no end point');
                    }
                    end = rangeEnd.charCodeAt(0);
                    if (end > begin) {
                        for (j = begin; j <= end; j++) {
                            chrs.push(String.fromCharCode(j));
                        }
                    }
                    else {
                        chrs.push('.', rangeBegin, rangeEnd);
                    }
                    i += rangeEnd.length + 2;
                }
                else {
                    $chr = String.fromCharCode(parseInt(rangeBegin, 8));
                    chrs.push($chr);
                }
                i += octalLength;
            }
            else if (next + charlist.charAt(i + 2) === '..') {
                rangeBegin = c;
                begin = rangeBegin.charCodeAt(0);
                if ((/\\\d/).test(charlist.charAt(i + 3) + charlist.charAt(i + 4))) {
                    regExpMatchArray = charlist.slice(i + 4).match(/^\d+/);
                    rangeEnd = regExpMatchArray[0];
                    i += 1;
                }
                else if (charlist.charAt(i + 3)) {
                    rangeEnd = charlist.charAt(i + 3);
                }
                else {
                    throw new Error('Range with no end point');
                }
                end = rangeEnd.charCodeAt(0);
                if (end > begin) {
                    for (j = begin; j <= end; j++) {
                        chrs.push(String.fromCharCode(j));
                    }
                }
                else {
                    chrs.push('.', rangeBegin, rangeEnd);
                }
                i += rangeEnd.length + 2;
            }
            else {
                chrs.push(c);
            }
        }
        for (i = 0; i < str.length; i++) {
            c = str.charAt(i);
            if (chrs.indexOf(c) !== -1) {
                target += '\\';
                cca = c.charCodeAt(0);
                if (cca < 32 || cca > 126) {
                    switch (c) {
                        case '\n':
                            target += 'n';
                            break;
                        case '\t':
                            target += 't';
                            break;
                        case '\u000D':
                            target += 'r';
                            break;
                        case '\u0007':
                            target += 'a';
                            break;
                        case '\v':
                            target += 'v';
                            break;
                        case '\b':
                            target += 'b';
                            break;
                        case '\f':
                            target += 'f';
                            break;
                        default:
                            encoded = encodeURIComponent(c);
                            if ((escHexGrp = percentHex.exec(encoded)) !== null) {
                                target += _pad(parseInt(escHexGrp[1], 16).toString(8), 3);
                            }
                            while ((escHexGrp = percentHex.exec(encoded)) !== null) {
                                target += '\\' + _pad(parseInt(escHexGrp[1], 16).toString(8), 3);
                            }
                            break;
                    }
                }
                else {
                    target += c;
                }
            }
            else {
                target += c;
            }
        }
        return target;
    }
    zanejs.addcslashes = addcslashes;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function addslashes(str) {
        return (str + '')
            .replace(/[\\"']/g, '\\$&')
            .replace(/\u0000/g, '\\0');
    }
    zanejs.addslashes = addslashes;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function bin2hex(s) {
        var i;
        var l;
        var o = '';
        var n;
        s += '';
        for (i = 0, l = s.length; i < l; i++) {
            n = s.charCodeAt(i)
                .toString(16);
            o += n.length < 2 ? '0' + n : n;
        }
        return o;
    }
    zanejs.bin2hex = bin2hex;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function chr(codePt) {
        if (codePt > 0xFFFF) {
            codePt -= 0x10000;
            return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
        }
        return String.fromCharCode(codePt);
    }
    zanejs.chr = chr;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function chunk_split(body, chunklen, end) {
        chunklen = parseInt(String(chunklen), 10) || 76;
        end = end || '\r\n';
        if (chunklen < 1) {
            return false;
        }
        var regExpMatchArray = body.match(new RegExp('.{0,' + chunklen + '}', 'g'));
        return regExpMatchArray.join(end);
    }
    zanejs.chunk_split = chunk_split;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function count_chars(str, mode) {
        var result = {};
        var resultArr = [];
        var i;
        var matchArr = ('' + str).split('').sort().join('').match(/(.)\1*/g);
        if ((mode & 1) === 0) {
            for (i = 0; i !== 256; i++) {
                result[i] = 0;
            }
        }
        if (mode === 2 || mode === 4) {
            for (i = 0; i !== str.length; i += 1) {
                delete result[matchArr[i].charCodeAt(0)];
            }
            Object.keys(result).map(function (key) {
                result[key] = (mode === 4) ? String.fromCharCode(Number(key)) : 0;
            });
        }
        else if (mode === 3) {
            for (i = 0; i !== str.length; i += 1) {
                result[i] = str[i].slice(0, 1);
            }
        }
        else {
            for (i = 0; i !== str.length; i += 1) {
                result[str[i].charCodeAt(0)] = str[i].length;
            }
        }
        if (mode < 3) {
            return result;
        }
        Object.keys(result).map(function (key) {
            resultArr.push(result[key]);
        });
        return resultArr.join('');
    }
    zanejs.count_chars = count_chars;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function echo() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return console.log(args.join(' '));
    }
    zanejs.echo = echo;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function endsWith(input, suffix) {
        return (suffix === input.substring(input.length - suffix.length));
    }
    zanejs.endsWith = endsWith;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function explode(delimiter, str, limit) {
        if (arguments.length < 2 ||
            typeof delimiter === 'undefined' ||
            typeof str === 'undefined') {
            return null;
        }
        if (delimiter === '' ||
            delimiter === false ||
            delimiter === null) {
            return false;
        }
        if (typeof delimiter === 'function' ||
            typeof delimiter === 'object' ||
            typeof str === 'function' ||
            typeof str === 'object') {
            return { 0: '' };
        }
        if (delimiter === true) {
            delimiter = '1';
        }
        delimiter += '';
        str += '';
        var s = str.split(delimiter);
        if (typeof limit === 'undefined') {
            return s;
        }
        if (limit === 0) {
            limit = 1;
        }
        if (limit > 0) {
            if (limit >= s.length) {
                return s;
            }
            return s
                .slice(0, limit - 1)
                .concat([s.slice(limit - 1)
                    .join(delimiter)
            ]);
        }
        if (-limit >= s.length) {
            return [];
        }
        s.splice(s.length + limit);
        return s;
    }
    zanejs.explode = explode;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function firstToUpper(str) {
        return str.charAt(0).toUpperCase() + str.substr(1);
    }
    zanejs.firstToUpper = firstToUpper;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function get_html_translation_table(table, quoteStyle) {
        if (quoteStyle === void 0) { quoteStyle = ''; }
        var entities = {};
        var hashMap = {};
        var decimal;
        var constMappingTable = {};
        var constMappingQuoteStyle = {};
        var useTable = {};
        var useQuoteStyle = {};
        constMappingTable[0] = 'HTML_SPECIALCHARS';
        constMappingTable[1] = 'HTML_ENTITIES';
        constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
        constMappingQuoteStyle[2] = 'ENT_COMPAT';
        constMappingQuoteStyle[3] = 'ENT_QUOTES';
        useTable = !isNaN(parseInt(table, 10))
            ? constMappingTable[table]
            : table
                ? table.toUpperCase()
                : 'HTML_SPECIALCHARS';
        useQuoteStyle = !isNaN(parseInt(quoteStyle, 10))
            ? constMappingQuoteStyle[quoteStyle]
            : quoteStyle
                ? quoteStyle.toUpperCase()
                : 'ENT_COMPAT';
        if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
            throw new Error('Table: ' + useTable + ' not supported');
        }
        entities['38'] = '&amp;';
        if (useTable === 'HTML_ENTITIES') {
            entities['160'] = '&nbsp;';
            entities['161'] = '&iexcl;';
            entities['162'] = '&cent;';
            entities['163'] = '&pound;';
            entities['164'] = '&curren;';
            entities['165'] = '&yen;';
            entities['166'] = '&brvbar;';
            entities['167'] = '&sect;';
            entities['168'] = '&uml;';
            entities['169'] = '&copy;';
            entities['170'] = '&ordf;';
            entities['171'] = '&laquo;';
            entities['172'] = '&not;';
            entities['173'] = '&shy;';
            entities['174'] = '&reg;';
            entities['175'] = '&macr;';
            entities['176'] = '&deg;';
            entities['177'] = '&plusmn;';
            entities['178'] = '&sup2;';
            entities['179'] = '&sup3;';
            entities['180'] = '&acute;';
            entities['181'] = '&micro;';
            entities['182'] = '&para;';
            entities['183'] = '&middot;';
            entities['184'] = '&cedil;';
            entities['185'] = '&sup1;';
            entities['186'] = '&ordm;';
            entities['187'] = '&raquo;';
            entities['188'] = '&frac14;';
            entities['189'] = '&frac12;';
            entities['190'] = '&frac34;';
            entities['191'] = '&iquest;';
            entities['192'] = '&Agrave;';
            entities['193'] = '&Aacute;';
            entities['194'] = '&Acirc;';
            entities['195'] = '&Atilde;';
            entities['196'] = '&Auml;';
            entities['197'] = '&Aring;';
            entities['198'] = '&AElig;';
            entities['199'] = '&Ccedil;';
            entities['200'] = '&Egrave;';
            entities['201'] = '&Eacute;';
            entities['202'] = '&Ecirc;';
            entities['203'] = '&Euml;';
            entities['204'] = '&Igrave;';
            entities['205'] = '&Iacute;';
            entities['206'] = '&Icirc;';
            entities['207'] = '&Iuml;';
            entities['208'] = '&ETH;';
            entities['209'] = '&Ntilde;';
            entities['210'] = '&Ograve;';
            entities['211'] = '&Oacute;';
            entities['212'] = '&Ocirc;';
            entities['213'] = '&Otilde;';
            entities['214'] = '&Ouml;';
            entities['215'] = '&times;';
            entities['216'] = '&Oslash;';
            entities['217'] = '&Ugrave;';
            entities['218'] = '&Uacute;';
            entities['219'] = '&Ucirc;';
            entities['220'] = '&Uuml;';
            entities['221'] = '&Yacute;';
            entities['222'] = '&THORN;';
            entities['223'] = '&szlig;';
            entities['224'] = '&agrave;';
            entities['225'] = '&aacute;';
            entities['226'] = '&acirc;';
            entities['227'] = '&atilde;';
            entities['228'] = '&auml;';
            entities['229'] = '&aring;';
            entities['230'] = '&aelig;';
            entities['231'] = '&ccedil;';
            entities['232'] = '&egrave;';
            entities['233'] = '&eacute;';
            entities['234'] = '&ecirc;';
            entities['235'] = '&euml;';
            entities['236'] = '&igrave;';
            entities['237'] = '&iacute;';
            entities['238'] = '&icirc;';
            entities['239'] = '&iuml;';
            entities['240'] = '&eth;';
            entities['241'] = '&ntilde;';
            entities['242'] = '&ograve;';
            entities['243'] = '&oacute;';
            entities['244'] = '&ocirc;';
            entities['245'] = '&otilde;';
            entities['246'] = '&ouml;';
            entities['247'] = '&divide;';
            entities['248'] = '&oslash;';
            entities['249'] = '&ugrave;';
            entities['250'] = '&uacute;';
            entities['251'] = '&ucirc;';
            entities['252'] = '&uuml;';
            entities['253'] = '&yacute;';
            entities['254'] = '&thorn;';
            entities['255'] = '&yuml;';
        }
        if (useQuoteStyle !== 'ENT_NOQUOTES') {
            entities['34'] = '&quot;';
        }
        if (useQuoteStyle === 'ENT_QUOTES') {
            entities['39'] = '&#39;';
        }
        entities['60'] = '&lt;';
        entities['62'] = '&gt;';
        for (decimal in entities) {
            if (entities.hasOwnProperty(decimal)) {
                hashMap[String.fromCharCode(decimal)] = entities[decimal];
            }
        }
        return hashMap;
    }
    zanejs.get_html_translation_table = get_html_translation_table;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function hex2bin(s) {
        var ret = [];
        var i = 0;
        var l;
        s += '';
        for (l = s.length; i < l; i += 2) {
            var c = parseInt(s.substr(i, 1), 16);
            var k = parseInt(s.substr(i + 1, 1), 16);
            if (isNaN(c) || isNaN(k)) {
                return false;
            }
            ret.push((c << 4) | k);
        }
        return String.fromCharCode.apply(String, ret);
    }
    zanejs.hex2bin = hex2bin;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function html_entity_decode(str, quoteStyle) {
        if (quoteStyle === void 0) { quoteStyle = ''; }
        var tmpStr = str.toString();
        var hashMap = zanejs.get_html_translation_table('HTML_ENTITIES', quoteStyle);
        if (hashMap === false) {
            return false;
        }
        delete (hashMap['&']);
        hashMap['&'] = '&amp;';
        Object.keys(hashMap).map(function (symbol) {
            var entity = hashMap[symbol];
            tmpStr = tmpStr.split(entity).join(symbol);
        });
        tmpStr = tmpStr.split('&#039;').join('\'');
        return tmpStr;
    }
    zanejs.html_entity_decode = html_entity_decode;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function http_build_query(formData, numericPrefix, argSeparator) {
        if (numericPrefix === void 0) { numericPrefix = ''; }
        if (argSeparator === void 0) { argSeparator = ''; }
        var _httpBuildQueryHelper = function (key, val, $argSeparator) {
            var k;
            var $tmp = [];
            if (val === true) {
                val = '1';
            }
            else if (val === false) {
                val = '0';
            }
            if (val !== null) {
                if (typeof val === 'object') {
                    for (k in val) {
                        if (val[k] !== null) {
                            $tmp.push(_httpBuildQueryHelper(key + '[' + k + ']', val[k], $argSeparator));
                        }
                    }
                    return $tmp.join($argSeparator);
                }
                else if (typeof val !== 'function') {
                    return zanejs.urlencode(key) + '=' + zanejs.urlencode(val);
                }
                else {
                    throw new Error('There was an error processing for http_build_query().');
                }
            }
            else {
                return '';
            }
        };
        if (!argSeparator) {
            argSeparator = '&';
        }
        var tmp = [];
        Object.keys(formData).map(function (key) {
            var value = formData[key];
            if (numericPrefix && !isNaN(parseInt(key, 10))) {
                key = String(numericPrefix) + key;
            }
            var query = _httpBuildQueryHelper(key, value, argSeparator);
            if (query !== '') {
                tmp.push(query);
            }
        });
        return tmp.join(argSeparator);
    }
    zanejs.http_build_query = http_build_query;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function implode(glue, pieces) {
        var i = '';
        var retVal = '';
        var tGlue = '';
        if (arguments.length === 1) {
            pieces = glue;
            glue = '';
        }
        if (typeof pieces === 'object') {
            if (Object.prototype.toString.call(pieces) === '[object Array]') {
                return pieces.join(glue);
            }
            Object.keys(pieces).map(function (key) {
                retVal += tGlue + pieces[key];
                tGlue = glue;
            });
            return retVal;
        }
        return pieces;
    }
    zanejs.implode = implode;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function ltrim(str) {
        str = str || '';
        return str.replace(/^\s+/, '');
    }
    zanejs.ltrim = ltrim;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function number_format(num, decimals, decPoint, thousandsSep) {
        num = (num + '').replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+num) ? 0 : +num;
        var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
        var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep;
        var dec = (typeof decPoint === 'undefined') ? '.' : decPoint;
        var toFixedFix = function ($n, $prec) {
            var k = Math.pow(10, $prec);
            return '' + (Math.round($n * k) / k).toFixed($prec);
        };
        var s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }
    zanejs.number_format = number_format;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function padLeft(value, padChar, length) {
        var s = value;
        while (s.length < length) {
            s = padChar + s;
        }
        return s;
    }
    zanejs.padLeft = padLeft;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function padRight(value, padChar, length) {
        var s = value;
        while (s.length < length) {
            s += padChar;
        }
        return s;
    }
    zanejs.padRight = padRight;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function parse_url(str, component, mode) {
        if (mode === void 0) { mode = 'php'; }
        var query;
        var key = [
            'source',
            'scheme',
            'authority',
            'userInfo',
            'user',
            'pass',
            'host',
            'port',
            'relative',
            'path',
            'directory',
            'file',
            'query',
            'fragment'
        ];
        var parser = {
            php: new RegExp([
                '(?:([^:\\/?#]+):)?',
                '(?:\\/\\/()(?:(?:()(?:([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?))?',
                '()',
                '(?:(()(?:(?:[^?#\\/]*\\/)*)()(?:[^?#]*))(?:\\?([^#]*))?(?:#(.*))?)'
            ].join('')),
            strict: new RegExp([
                '(?:([^:\\/?#]+):)?',
                '(?:\\/\\/((?:(([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?))?',
                '((((?:[^?#\\/]*\\/)*)([^?#]*))(?:\\?([^#]*))?(?:#(.*))?)'
            ].join('')),
            loose: new RegExp([
                '(?:(?![^:@]+:[^:@\\/]*@)([^:\\/?#.]+):)?',
                '(?:\\/\\/\\/?)?',
                '((?:(([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?)',
                '(((\\/(?:[^?#](?![^?#\\/]*\\.[^?#\\/.]+(?:[?#]|$)))*\\/?)?([^?#\\/]*))',
                '(?:\\?([^#]*))?(?:#(.*))?)'
            ].join(''))
        };
        var m = parser[mode].exec(str);
        var uri = {};
        var i = 14;
        while (i--) {
            if (m[i]) {
                uri[key[i]] = m[i];
            }
        }
        if (component) {
            return uri[component.replace('PHP_URL_', '').toLowerCase()];
        }
        if (mode !== 'php') {
            var name_1 = 'queryKey';
            parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
            uri[name_1] = {};
            query = uri[key[12]] || '';
            query.replace(parser, function ($0, $1, $2) {
                if ($1) {
                    uri[name_1][$1] = $2;
                }
            });
        }
        delete uri.source;
        return uri;
    }
    zanejs.parse_url = parse_url;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function rawurldecode(str) {
        return decodeURIComponent((str + '')
            .replace(/%(?![\da-f]{2})/gi, function () {
            return '%25';
        }));
    }
    zanejs.rawurldecode = rawurldecode;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function rawurlencode(str) {
        str = (str + '');
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A');
    }
    zanejs.rawurlencode = rawurlencode;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function removeAllComments(str, replace) {
        if (replace === void 0) { replace = ''; }
        str = str || '';
        return zanejs.removeMultiLineComments(zanejs.removeSingleLineComments(str, replace), replace);
    }
    zanejs.removeAllComments = removeAllComments;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function removeAllWhiteSpaces(str, replace) {
        if (replace === void 0) { replace = ''; }
        str = str || '';
        return str.replace(/\s+/g, replace);
    }
    zanejs.removeAllWhiteSpaces = removeAllWhiteSpaces;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function removeLineBreaks(str, replace) {
        if (replace === void 0) { replace = ''; }
        str = str || '';
        return str.replace(/\r|\n/g, replace);
    }
    zanejs.removeLineBreaks = removeLineBreaks;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function removeMultiLineComments(str, replace) {
        if (replace === void 0) { replace = ''; }
        str = str || '';
        return str.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/g, replace);
    }
    zanejs.removeMultiLineComments = removeMultiLineComments;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function removeMultipleSpaces(str, replace) {
        if (replace === void 0) { replace = ' '; }
        str = str || '';
        return str.replace(/ {2,}/g, replace);
    }
    zanejs.removeMultipleSpaces = removeMultipleSpaces;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function removeNonWordChars(str, replace) {
        if (replace === void 0) { replace = ''; }
        str = str || '';
        return str.replace(/[^\w \-\xC0-\xFF]/g, replace);
    }
    zanejs.removeNonWordChars = removeNonWordChars;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function removeSingleLineComments(str, replace) {
        if (replace === void 0) { replace = ''; }
        str = str || '';
        return str.replace(/\/\/[^\n\r]+/g, replace);
    }
    zanejs.removeSingleLineComments = removeSingleLineComments;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function removeSpaces(str, replace) {
        if (replace === void 0) { replace = ''; }
        str = str || '';
        return str.replace(/ +/g, replace);
    }
    zanejs.removeSpaces = removeSpaces;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function removeSpecialChars(str, replace) {
        if (replace === void 0) { replace = ''; }
        str = str || '';
        return str.replace(/[^\w \_\-]/g, replace);
    }
    zanejs.removeSpecialChars = removeSpecialChars;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function removeTabs(str, replace) {
        if (replace === void 0) { replace = ''; }
        str = str || '';
        return str.replace(/\t+/g, replace);
    }
    zanejs.removeTabs = removeTabs;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function replaceAccents(str) {
        str = str || '';
        if (str.search(/[\xC0-\xFF]/g) > -1) {
            str = str.replace(/[\xC0-\xC5]/g, 'A');
            str = str.replace(/[\xC6]/g, 'AE');
            str = str.replace(/[\xC7]/g, 'C');
            str = str.replace(/[\xC8-\xCB]/g, 'E');
            str = str.replace(/[\xCC-\xCF]/g, 'I');
            str = str.replace(/[\xD0]/g, 'D');
            str = str.replace(/[\xD1]/g, 'N');
            str = str.replace(/[\xD2-\xD6\xD8]/g, 'O');
            str = str.replace(/[\xD9-\xDC]/g, 'U');
            str = str.replace(/[\xDD]/g, 'Y');
            str = str.replace(/[\xDE]/g, 'P');
            str = str.replace(/[\xE0-\xE5]/g, 'a');
            str = str.replace(/[\xE6]/g, 'ae');
            str = str.replace(/[\xE7]/g, 'c');
            str = str.replace(/[\xE8-\xEB]/g, 'e');
            str = str.replace(/[\xEC-\xEF]/g, 'i');
            str = str.replace(/[\xF1]/g, 'n');
            str = str.replace(/[\xF2-\xF6\xF8]/g, 'o');
            str = str.replace(/[\xF9-\xFC]/g, 'u');
            str = str.replace(/[\xFE]/g, 'p');
            str = str.replace(/[\xFD\xFF]/g, 'y');
        }
        return str;
    }
    zanejs.replaceAccents = replaceAccents;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function rtrim(str, charlist) {
        if (charlist === void 0) { charlist = ''; }
        charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
            .replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^:])/g, '\\$1');
        var re = new RegExp('[' + charlist + ']+$', 'g');
        return (str + '').replace(re, '');
    }
    zanejs.rtrim = rtrim;
    function chop(str, charlist) {
        if (charlist === void 0) { charlist = ''; }
        return rtrim(str, charlist);
    }
    zanejs.chop = chop;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function serialize(mixedValue) {
        var val, key, okey;
        var ktype = '';
        var vals = '';
        var count = 0;
        var _utf8Size = function (str) {
            var size = 0;
            var i = 0;
            var l = str.length;
            var code = 0;
            for (i = 0; i < l; i++) {
                code = str.charCodeAt(i);
                if (code < 0x0080) {
                    size += 1;
                }
                else if (code < 0x0800) {
                    size += 2;
                }
                else {
                    size += 3;
                }
            }
            return size;
        };
        var _getType = function (inp) {
            var match;
            var key1;
            var cons;
            var types;
            var type1 = typeof (inp);
            if (type1 === 'object' && !inp) {
                return 'null';
            }
            if (type1 === 'object') {
                if (!inp.constructor) {
                    return 'object';
                }
                cons = inp.constructor.toString();
                match = cons.match(/(\w+)\(/);
                if (match) {
                    cons = match[1].toLowerCase();
                }
                types = ['boolean', 'number', 'string', 'array'];
                for (key1 in types) {
                    if (cons === types[key1]) {
                        type1 = types[key1];
                        break;
                    }
                }
            }
            return type1;
        };
        var type = _getType(mixedValue);
        switch (type) {
            case 'function':
                val = '';
                break;
            case 'boolean':
                val = 'b:' + (mixedValue ? '1' : '0');
                break;
            case 'number':
                val = (Math.round(mixedValue) === mixedValue ? 'i' : 'd') + ':' + mixedValue;
                break;
            case 'string':
                val = 's:' + _utf8Size(mixedValue) + ':"' + mixedValue + '"';
                break;
            case 'array':
            case 'object':
                val = 'a';
                for (key in mixedValue) {
                    if (mixedValue.hasOwnProperty(key)) {
                        ktype = _getType(mixedValue[key]);
                        if (ktype === 'function') {
                            continue;
                        }
                        okey = (key.match(/^[0-9]+$/) ? parseInt(key, 10) : key);
                        vals += serialize(okey) + serialize(mixedValue[key]);
                        count++;
                    }
                }
                val += ':' + count + ':{' + vals + '}';
                break;
            case 'undefined':
            default:
                val = 'N';
                break;
        }
        if (type !== 'object' && type !== 'array') {
            val += ';';
        }
        return val;
    }
    zanejs.serialize = serialize;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function stringTruncate(value, length, suffix) {
        if (suffix === void 0) { suffix = '...'; }
        var out = '';
        var l = length;
        if (value) {
            l -= suffix.length;
            var trunc = value;
            if (trunc.length > l) {
                trunc = trunc.substr(0, l);
                if (/[^\s]/.test(value.charAt(l))) {
                    trunc = zanejs.rtrim(trunc.replace(/\w+$|\s+$/, ''));
                }
                trunc += suffix;
            }
            out = trunc;
        }
        return out;
    }
    zanejs.stringTruncate = stringTruncate;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function stringsAreEqual(s1, s2, caseSensitive) {
        if (caseSensitive === void 0) { caseSensitive = false; }
        return (caseSensitive) ? (s1 === s2) : (s1.toUpperCase() === s2.toUpperCase());
    }
    zanejs.stringsAreEqual = stringsAreEqual;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function stripslashes(str) {
        return (str + '').replace(/\\(.?)/g, function (s, n1) {
            switch (n1) {
                case '\\':
                    return '\\';
                case '0':
                    return '\u0000';
                case '':
                    return '';
                default:
                    return n1;
            }
        });
    }
    zanejs.stripslashes = stripslashes;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function toCamelCase(str) {
        str = str || '';
        str = str.replace('-', ' ');
        str = zanejs.toProperCase(str).replace(' ', '');
        function capsFn() {
            return arguments[0].toLowerCase();
        }
        return str.replace(/\b\w/g, capsFn);
    }
    zanejs.toCamelCase = toCamelCase;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function toPathFormat() {
        var rest = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rest[_i] = arguments[_i];
        }
        var path = '/';
        for (var i = 0; i < rest.length; i++) {
            path += (rest[i]) ? zanejs.removeNonWordChars(rest[i]) + '/' : '';
        }
        path = zanejs.replaceAccents(path);
        path = zanejs.removeMultipleSpaces(path);
        path = path.toLowerCase().replace(/\s/g, '-');
        return path;
    }
    zanejs.toPathFormat = toPathFormat;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function toProperCase(str) {
        str = str || '';
        function capsFn() {
            return arguments[0].toUpperCase();
        }
        return str.toLowerCase().replace(/^[a-z\xE0-\xFF]|\s[a-z\xE0-\xFF]/g, capsFn);
    }
    zanejs.toProperCase = toProperCase;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function toTitleFormat(path, defaultTitle, separator) {
        if (defaultTitle === void 0) { defaultTitle = ''; }
        if (separator === void 0) { separator = ' | '; }
        path = path || '';
        function isNotEmpty(item, index, array) {
            return (item.length > 0);
        }
        var pathsArr = path.split('/').filter(isNotEmpty);
        for (var i = 0; i < pathsArr.length; i++) {
            defaultTitle = pathsArr[i] + separator + defaultTitle;
        }
        defaultTitle = defaultTitle.replace(/\-/g, ' ').replace(/\_/g, ' ');
        return zanejs.toProperCase(defaultTitle);
    }
    zanejs.toTitleFormat = toTitleFormat;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function trim(str) {
        str = str || '';
        return str.replace(/^\s+|\s+$/g, '');
    }
    zanejs.trim = trim;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function unserialize(data) {
        var utf8Overhead = function (str) {
            var s = str.length;
            for (var i = str.length - 1; i >= 0; i--) {
                var code = str.charCodeAt(i);
                if (code > 0x7f && code <= 0x7ff) {
                    s++;
                }
                else if (code > 0x7ff && code <= 0xffff) {
                    s += 2;
                }
                if (code >= 0xDC00 && code <= 0xDFFF) {
                    i--;
                }
            }
            return s - 1;
        };
        var error = function (type, msg, filename, line) {
            if (filename === void 0) { filename = ''; }
            if (line === void 0) { line = 0; }
            console.log(msg, filename, line);
        };
        var readUntil = function ($data, offset, stopchr) {
            var i = 2;
            var buf = [];
            var $chr = $data.slice(offset, offset + 1);
            while ($chr !== stopchr) {
                if ((i + offset) > $data.length) {
                    error('Error', 'Invalid');
                }
                buf.push($chr);
                $chr = $data.slice(offset + (i - 1), offset + i);
                i += 1;
            }
            return [buf.length, buf.join('')];
        };
        var readChrs = function ($data, offset, length) {
            var i, $chr, buf;
            buf = [];
            for (i = 0; i < length; i++) {
                $chr = $data.slice(offset + (i - 1), offset + i);
                buf.push($chr);
                length -= utf8Overhead($chr);
            }
            return [buf.length, buf.join('')];
        };
        function _unserialize($data, offset) {
            var dtype;
            var dataoffset;
            var keyandchrs;
            var keys;
            var contig;
            var length;
            var array;
            var readdata;
            var readData;
            var ccount;
            var stringlength;
            var i;
            var key;
            var kprops;
            var kchrs;
            var vprops;
            var vchrs;
            var value;
            var chrs = 0;
            var typeconvert = function (x) {
                return x;
            };
            if (!offset) {
                offset = 0;
            }
            dtype = ($data.slice(offset, offset + 1)).toLowerCase();
            dataoffset = offset + 2;
            switch (dtype) {
                case 'i':
                    typeconvert = function (x) {
                        return parseInt(x, 10);
                    };
                    readData = readUntil($data, dataoffset, ';');
                    chrs = readData[0];
                    readdata = readData[1];
                    dataoffset += chrs + 1;
                    break;
                case 'b':
                    typeconvert = function (x) {
                        return parseInt(x, 10) !== 0;
                    };
                    readData = readUntil($data, dataoffset, ';');
                    chrs = readData[0];
                    readdata = readData[1];
                    dataoffset += chrs + 1;
                    break;
                case 'd':
                    typeconvert = function (x) {
                        return parseFloat(x);
                    };
                    readData = readUntil($data, dataoffset, ';');
                    chrs = readData[0];
                    readdata = readData[1];
                    dataoffset += chrs + 1;
                    break;
                case 'n':
                    readdata = null;
                    break;
                case 's':
                    ccount = readUntil($data, dataoffset, ':');
                    chrs = ccount[0];
                    stringlength = ccount[1];
                    dataoffset += chrs + 2;
                    readData = readChrs($data, dataoffset + 1, parseInt(stringlength, 10));
                    chrs = readData[0];
                    readdata = readData[1];
                    dataoffset += chrs + 2;
                    if (chrs !== parseInt(stringlength, 10) && chrs !== readdata.length) {
                        error('SyntaxError', 'String length mismatch');
                    }
                    break;
                case 'a':
                    readdata = {};
                    keyandchrs = readUntil($data, dataoffset, ':');
                    chrs = keyandchrs[0];
                    keys = keyandchrs[1];
                    dataoffset += chrs + 2;
                    length = parseInt(keys, 10);
                    contig = true;
                    for (i = 0; i < length; i++) {
                        kprops = _unserialize($data, dataoffset);
                        kchrs = kprops[1];
                        key = kprops[2];
                        dataoffset += kchrs;
                        vprops = _unserialize($data, dataoffset);
                        vchrs = vprops[1];
                        value = vprops[2];
                        dataoffset += vchrs;
                        if (key !== i) {
                            contig = false;
                        }
                        readdata[key] = value;
                    }
                    if (contig) {
                        array = new Array(length);
                        for (i = 0; i < length; i++) {
                            array[i] = readdata[i];
                        }
                        readdata = array;
                    }
                    dataoffset += 1;
                    break;
                default:
                    error('SyntaxError', 'Unknown / Unhandled data type(s): ' + dtype);
                    break;
            }
            return [dtype, dataoffset - offset, typeconvert(readdata)];
        }
        return _unserialize((data + ''), 0)[2];
    }
    zanejs.unserialize = unserialize;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function urldecode(str) {
        return decodeURIComponent((str + '')
            .replace(/%(?![\da-f]{2})/gi, function () {
            return '%25';
        })
            .replace(/\+/g, '%20'));
    }
    zanejs.urldecode = urldecode;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function urlencode(str) {
        str = (str + '');
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A')
            .replace(/%20/g, '+');
    }
    zanejs.urlencode = urlencode;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function utf8_decode(strData) {
        var tmpArr = [];
        var i = 0;
        var c1 = 0;
        var seqlen = 0;
        strData += '';
        while (i < strData.length) {
            c1 = strData.charCodeAt(i) & 0xFF;
            seqlen = 0;
            if (c1 <= 0xBF) {
                c1 = (c1 & 0x7F);
                seqlen = 1;
            }
            else if (c1 <= 0xDF) {
                c1 = (c1 & 0x1F);
                seqlen = 2;
            }
            else if (c1 <= 0xEF) {
                c1 = (c1 & 0x0F);
                seqlen = 3;
            }
            else {
                c1 = (c1 & 0x07);
                seqlen = 4;
            }
            for (var ai = 1; ai < seqlen; ++ai) {
                c1 = ((c1 << 0x06) | (strData.charCodeAt(ai + i) & 0x3F));
            }
            if (seqlen === 4) {
                c1 -= 0x10000;
                tmpArr.push(String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF)));
                tmpArr.push(String.fromCharCode(0xDC00 | (c1 & 0x3FF)));
            }
            else {
                tmpArr.push(String.fromCharCode(c1));
            }
            i += seqlen;
        }
        return tmpArr.join('');
    }
    zanejs.utf8_decode = utf8_decode;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function utf8_encode(argString) {
        if (argString === null || typeof argString === 'undefined') {
            return '';
        }
        var str = (argString + '');
        var utftext = '';
        var start;
        var end;
        var stringl = 0;
        start = end = 0;
        stringl = str.length;
        for (var n = 0; n < stringl; n++) {
            var c1 = str.charCodeAt(n);
            var enc = null;
            if (c1 < 128) {
                end++;
            }
            else if (c1 > 127 && c1 < 2048) {
                enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
            }
            else if ((c1 & 0xF800) !== 0xD800) {
                enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
            }
            else {
                if ((c1 & 0xFC00) !== 0xD800) {
                    throw new RangeError('Unmatched trail surrogate at ' + n);
                }
                var c2 = str.charCodeAt(++n);
                if ((c2 & 0xFC00) !== 0xDC00) {
                    throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
                }
                c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
                enc = String.fromCharCode((c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
            }
            if (enc !== null) {
                if (end > start) {
                    utftext += str.slice(start, end);
                }
                utftext += enc;
                start = end = n + 1;
            }
        }
        if (end > start) {
            utftext += str.slice(start, stringl);
        }
        return utftext;
    }
    zanejs.utf8_encode = utf8_encode;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function xtrim(str) {
        if (str === void 0) { str = ''; }
        str = (!str) ? '' : str;
        var o = '';
        var TAB = 9;
        var LINEFEED = 10;
        var CARRIAGE = 13;
        var SPACE = 32;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) !== SPACE &&
                str.charCodeAt(i) !== CARRIAGE &&
                str.charCodeAt(i) !== LINEFEED &&
                str.charCodeAt(i) !== TAB) {
                o += str.charAt(i);
            }
        }
        return o;
    }
    zanejs.xtrim = xtrim;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function stringToXMLDom(str) {
        var xmlDoc = null;
        if (window.DOMParser) {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(str, 'text/xml');
        }
        else {
            var ActiveXObject = window.ActiveXObject;
            xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
            xmlDoc.async = 'false';
            xmlDoc.loadXML(str);
        }
        return xmlDoc;
    }
    zanejs.stringToXMLDom = stringToXMLDom;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var WS = (function () {
        function WS(url, protocols, options) {
            if (protocols === void 0) { protocols = []; }
            if (options === void 0) { options = {}; }
            var _this = this;
            this._url = url;
            this._protocols = protocols;
            this._websocket = null;
            this._reconnectLock = false;
            this._heartBeatTime = 60000;
            this._heartBeatData = '';
            this._timeout = 10000;
            this._heartBeatTimer = null;
            this._closeTimer = null;
            Object.keys(options).forEach(function (key) {
                var _key = '_' + key;
                if (_this.hasOwnProperty(_key)) {
                    _this[_key] = options[key];
                }
            });
            this.initWebsocket();
        }
        WS.prototype.send = function (data) {
            var $ws = window.wx;
            if ($ws) {
                this._websocket.send({
                    data: data
                });
            }
            else {
                this._websocket.send(data);
            }
        };
        WS.prototype.close = function (code, reason) {
            var $ws = window.wx;
            if ($ws) {
                this._websocket.close({
                    code: code,
                    reason: reason
                });
            }
            else {
                this._websocket.close(code, reason);
            }
        };
        WS.prototype.initWebsocket = function () {
            var _this = this;
            try {
                var $ws = window.wx;
                if ($ws) {
                    this._websocket = $ws.connectSocket({
                        url: this._url,
                        protocols: this._protocols,
                        header: this._header
                    });
                    this._websocket.onClose = function () {
                        if (_this._onclose)
                            _this._onclose();
                        _this.reconnect();
                    };
                    this._websocket.onError = function (errMsg) {
                        if (_this._onerror)
                            _this._onerror(errMsg);
                        _this.reconnect();
                    };
                    this._websocket.onOpen = function (header) {
                        if (_this._onopen)
                            _this._onopen(header);
                        _this.heartCheck();
                    };
                    this._websocket.onMessage = function (data) {
                        if (_this._onmessage)
                            _this._onmessage(data);
                        _this.heartCheck();
                    };
                }
                else {
                    this._websocket = new WebSocket(this._url, this._protocols);
                    this._websocket.onclose = function () {
                        if (_this._onclose)
                            _this._onclose();
                        _this.reconnect();
                    };
                    this._websocket.onerror = function () {
                        if (_this._onerror)
                            _this._onerror();
                        _this.reconnect();
                    };
                    this._websocket.onopen = function () {
                        if (_this._onopen)
                            _this._onopen();
                        _this.heartCheck();
                    };
                    this._websocket.onmessage = function (evt) {
                        if (_this._onmessage)
                            _this._onmessage(evt.data);
                        _this.heartCheck();
                    };
                }
            }
            catch (e) {
                this.reconnect();
            }
        };
        WS.prototype.reconnect = function () {
            var _this = this;
            if (this._reconnectLock)
                return;
            this._reconnectLock = true;
            setTimeout(function () {
                _this.initWebsocket();
                _this._reconnectLock = false;
            }, this._timeout);
        };
        WS.prototype.heartCheck = function () {
            var _this = this;
            clearTimeout(this._closeTimer);
            clearTimeout(this._heartBeatTimer);
            this._heartBeatTimer = setTimeout(function () {
                _this._websocket.send('');
                _this._closeTimer = setTimeout(function () {
                    _this._websocket.close();
                    _this._websocket = null;
                }, _this._heartBeatTime);
            }, this._heartBeatTime);
        };
        return WS;
    }());
    zanejs.WS = WS;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var WSManager = (function () {
        function WSManager() {
            throw new Error('This is a STATIC CLASS and should not be instantiated.');
        }
        WSManager.subscribe = function (url, protocols, options) {
            if (protocols === void 0) { protocols = []; }
            if (options === void 0) { options = {}; }
            if (!WSManager.connections[url]) {
                WSManager.connections[url] = new zanejs.WS(url, protocols, options);
            }
            return WSManager.connections[url];
        };
        WSManager.unSubscribe = function (url, code, reason) {
            var ws = WSManager.connections[url];
            if (ws) {
                ws.close(code, reason);
            }
        };
        WSManager.getConnectionsFrom = function (url) {
            return WSManager.connections[url];
        };
        WSManager.connections = {};
        return WSManager;
    }());
    zanejs.WSManager = WSManager;
})(zanejs || (zanejs = {}));
//# sourceMappingURL=zanejs.js.map