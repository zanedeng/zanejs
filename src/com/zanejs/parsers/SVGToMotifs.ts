module zanejs {

    export class SVGToMotifs {

        private static _eWarnings: any[] = [];    // Elements warnings
        private static _aWarnings: any[] = [];    // Attributes warnings
        private static _pWarnings: any[] = [];    // Path draw warnings
        private static _tWarnings: any[] = [];    // Transform warnings
        private static _motifs: any[] = [];       // Graphics3D motifs
        private static _initAnchor: PIXI.Point;   // Store Path initial anchor point for close path command
        private static _prevAnchor: PIXI.Point;   // Store Path previous anchor point for relative draw
        private static _prevControl: PIXI.Point;  // Store Path previous anchor point for smooth curves
        private static _prevCommand: string;      // Store Path previous command (used for smooth bezier)
        private static _curMatrix: PIXI.Matrix;   // Current Transformation Matrix
                                                  //    (applied to objects that have transformation matrix)
        private static _hasTransform: boolean;    // If the element has a transformation Matrix
                                                  //    applied (used to avoid aplying transform to all elements)
        private static _warnings: string = '';    // Warnings text

        private static SUPPORTED_ATT: string[] = [
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

        private static SUPPORTED_TAG: string[] = [
            'circle',
            'ellipse',
            'line',
            'path',
            'polygon',
            'polyline',
            'rect'
        ];

        public static getWarnings(): string { return SVGToMotifs._warnings; }

        public static parse(svg: string): any[] {
            SVGToMotifs._motifs.length = 0;
            SVGToMotifs.clearWarnings();

            SVGToMotifs._initAnchor  = new PIXI.Point();
            SVGToMotifs._prevAnchor  = new PIXI.Point();
            SVGToMotifs._prevControl = new PIXI.Point();

            SVGToMotifs._curMatrix = new PIXI.Matrix();

            // parse SVG tags
            let xmlObject: any = stringToXMLDom(svg);
            SVGToMotifs.parseTags(xmlObject.children);

            // WARNINGS / ERRORS
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
        }

        private static parseTags(elm: any, parentAtt: any = null): void {
            let tag: any;
            let tagName: string = '';
            let elmAtt: any = {};
            let m: number = elm.length;
            for (let i: number = 0; i < m; i++) {
                tag = elm[i];
                tagName = tag.nodeName;
                tagName = tagName.replace(/.*::/, ''); // remove namespace and capture only tag name
                elmAtt = SVGToMotifs.mergeAttributes(
                    parentAtt,
                    SVGToMotifs.parseAttributes(tag.attributes)
                ); // inheritance
                if (SVGToMotifs.SUPPORTED_TAG.indexOf(tagName) > -1) {
                    SVGToMotifs.parseElements(tagName, elmAtt);
                } else {
                    SVGToMotifs.parseTags(tag.children, elmAtt); // inheritance
                }
            }
        }

        private static parseAttributes(attList: any): any {
            let n: number = attList.length;
            let att: any = {};
            let aName: string = '';
            while (n--) {
                aName = attList[n].nodeName + '';
                att[aName] = (aName !== 'transform')
                    ? attList[n].value
                    : SVGToMotifs.parseTransform(attList[n]);
                SVGToMotifs.validateAttribute(aName);
            }
            // inline style support (overwrite all attributes/css classes)
            if (att.style !== undefined) {
                let styleStr: string = (att.style + '').replace(/\;/g, ',');
                let styleObj: any = toObject(styleStr);
                Object.keys(styleObj).map(key => {
                    att[key] = styleObj[key];
                });
            }
            return att;
        }

        private static parseElements(type: string, att: any): void {
            // beginFill
            if (att.fill !== 'none') {
                var fillColor: number = (att.fill !== undefined) ? colorToUint(att.fill) : 0;
                var fillOpacity: number = (att['fill-opacity'] !== undefined) ? att['fill-opacity'] : 1;
                fillOpacity *= (att.opacity !== undefined) ? att.opacity : 1;
                SVGToMotifs._motifs.push( ['B', [fillColor, limitPrecision(fillOpacity)]] );
            } else if (type === 'line') {
                att.fill = 0;
                SVGToMotifs._motifs.push( ['B', []] ); // fix unfilled line bug
            }

            // lineStyle
            if (att.stroke !== undefined || att['stroke-width'] !== undefined) {
                var thickness: number = (att['stroke-width'] !== undefined) ? att['stroke-width'] : 1;
                var strokeColor: number = (att.stroke !== undefined) ? colorToUint(att.stroke) : 0;
                var strokeOpacity: number = (att['stroke-opacity'] !== undefined) ? att['stroke-opacity'] : 1;
                strokeOpacity *= (att.opacity !== undefined) ? att.opacity : 1;
                var caps: string = (att['stroke-linecap'] !== undefined && att['stroke-linecap'] !== 'butt')
                    ? att['stroke-linecap']
                    : 'none';
                var joints: string = (att['stroke-linejoin'] !== undefined) ? att['stroke-linejoin'] : null;
                var miterlimit: Number = (att['stroke-miterlimit'] !== undefined) ? att['stroke-miterlimit'] : 3;
                SVGToMotifs._motifs.push( ['S', [limitPrecision(thickness), strokeColor,
                    limitPrecision(strokeOpacity), false, 'normal', caps, joints, miterlimit]] );
            } else {
                SVGToMotifs._motifs.push( ['S', []] ); // clear lineStyle
            }

            // transform matrix
            if (att.transform) {
                SVGToMotifs._curMatrix = att.transform;
                SVGToMotifs._hasTransform = true;
            } else {
                SVGToMotifs._hasTransform = false;
            }

            // shapes
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
                    SVGToMotifs.eRect(
                        parseFloat(att.x),
                        parseFloat(att.y),
                        parseFloat(att.width),
                        parseFloat(att.height),
                        parseFloat(att.rx),
                        parseFloat(att.ry)
                    );
                    break;
                default:
                    if (SVGToMotifs._eWarnings.indexOf(type) < 0) {
                        SVGToMotifs._eWarnings.push(type); // Add element warning
                    }
                    break;
            }

            // endFill
            if (att.fill !== 'none') {
                SVGToMotifs._motifs.push( ['E'] );
            }
        }

        private static parseTransform(str: string): PIXI.Matrix {
            let mat: PIXI.Matrix = new PIXI.Matrix();
            let transforms: any = str.match(/[a-zA-Z]+\([\d\-\., ]+\)/g); // split all commands and params
            let parts: any;
            let command: string;
            let params: any;
            let n: number = transforms.length;
            while (n--) {
                parts = (transforms[n] + '').split('(');
                command = parts[0] + '';
                params = (parts[1] + '').match(/[\d\-\.]+/g);
                switch (command) {
                    case 'matrix':
                        mat = concat(
                            mat,
                            new PIXI.Matrix(params[0], params[1], params[2], params[3], params[4], params[5])
                        );
                        break;
                    case 'rotate':
                        if (params.length > 1) {
                            mat = rotateAroundExternalPoint(mat, new PIXI.Point(params[1], params[2]), params[0]);
                        } else {
                            mat.rotate(degreeToRadians(params[0]));
                        }
                        break;
                    case 'scale':
                        // If <sy> is not provided, it is assumed to be equal to <sx>
                        if (params.length === 1) {
                            params[1] = params[0];
                        }
                        mat.scale(params[0], params[1]);
                        break;
                    case 'skewX':
                        var sX: number = getSkewX(mat);
                        mat = setSkewX(mat, sX + params[0]);
                        break;
                    case 'skewY':
                        var sY: number = getSkewY(mat);
                        mat = setSkewY(mat, sY + params[0]);
                        break;
                    case 'translate':
                        mat.translate(params[0], params[1]);
                        break;
                    default:
                        // Add transform warning
                        if (SVGToMotifs._tWarnings.indexOf(command) < 0) {
                            SVGToMotifs._tWarnings.push(command);
                        }
                        break;
                }
            }
            return mat;
        }

        private static validateAttribute(att: string): void {
            if (SVGToMotifs.SUPPORTED_ATT.indexOf(att) < 0) {
                if (SVGToMotifs._aWarnings.indexOf(att) < 0) {
                    SVGToMotifs._aWarnings.push(att);
                }
            }
        }

        private static mergeAttributes(base: any, extend: any): any {
            let merged: any = {};
            if (base) {

                Object.keys(base).map(key => {
                    merged[key] = base[key];
                });
            }

            if (extend) {

                Object.keys(extend).map(key => {
                    if (key === 'opacity' && merged.hasOwnProperty(key)) {

                        merged[key] = parseFloat(merged[key]) * parseFloat(extend[key]);

                    } else if (key === 'transform' && merged.hasOwnProperty(key)) {
                        // Matrix(extend[key]).concat(Matrix(merged[key]));
                        // merged[key] = extend[key];
                        // todo
                    } else {
                        merged[key] = extend[key];
                    }
                });
            }
            return merged;
        }

        private static clearWarnings(): void {
            SVGToMotifs._eWarnings.length = 0;
            SVGToMotifs._aWarnings.length = 0;
            SVGToMotifs._pWarnings.length = 0;
            SVGToMotifs._tWarnings.length = 0;
            SVGToMotifs._warnings = '';
        }

        private static eCircle(cx: number, cy: number, r: number): void {
            let circle: Ellipse = new Ellipse(cx, cy, r, r);
            if (SVGToMotifs._hasTransform) {
                circle = circle.transform(SVGToMotifs._curMatrix);
            }
            SVGToMotifs._motifs = SVGToMotifs._motifs.concat(circle.toMotifs());
        }

        private static eEllipse(cx: number, cy: number, rx: number, ry: number): void {
            let ellipse: Ellipse = new Ellipse(cx, cy, rx, ry);
            if (SVGToMotifs._hasTransform) {
                ellipse = ellipse.transform(SVGToMotifs._curMatrix);
            }
            SVGToMotifs._motifs = SVGToMotifs._motifs.concat(ellipse.toMotifs());
        }

        private static eLine(x1: number, y1: number, x2: number, y2: number): void {
            let line: Line = new Line(new PIXI.Point(x1, y1), new PIXI.Point(x2, y2));
            if (SVGToMotifs._hasTransform) {
                line = line.transform(SVGToMotifs._curMatrix);
            }
            SVGToMotifs._motifs = SVGToMotifs._motifs.concat(line.toMotifs());
        }

        private static ePolygon(pts: string, isClosed: boolean = true): void {
            // used /\s+/ instead of " " because tabs and multiple spaces are alowed inside commands
            let pArr: any = trim(pts).split(/\s+/);
            let n: number = pArr.length;

            while (n--) {
                pArr[n] = pArr[n].split(',');
                pArr[n] = new PIXI.Point(pArr[n][0], pArr[n][1]);
            }

            if (isClosed) {
                let polygon: Polygon = new Polygon(pArr);
                if (SVGToMotifs._hasTransform) {
                    polygon = polygon.transform(SVGToMotifs._curMatrix);
                }
                SVGToMotifs._motifs = SVGToMotifs._motifs.concat(polygon.toMotifs());
            } else {
                let polyline: Polyline = new Polyline(pArr);
                if (SVGToMotifs._hasTransform) {
                    polyline = polyline.transform(SVGToMotifs._curMatrix);
                }
                SVGToMotifs._motifs = SVGToMotifs._motifs.concat(polyline.toMotifs());
            }
        }

        private static ePolyline(pts: string): void {
            SVGToMotifs.ePolygon(pts, false);
        }

        private static eRect(x: number, y: number, wid: number,
                             hei: number, rx: number = 0, ry: number = 0): void {
            let rect: Rect = new Rect(x, y, wid, hei, rx, ry);
            if (SVGToMotifs._hasTransform) {
                rect = rect.transform(SVGToMotifs._curMatrix);
            }
            SVGToMotifs._motifs = SVGToMotifs._motifs.concat(rect.toMotifs());
        }

        private static ePath(d: string): void {
            if (!d) return;

            SVGToMotifs._initAnchor.x  = SVGToMotifs._initAnchor.y  = 0;
            SVGToMotifs._prevAnchor.x  = SVGToMotifs._prevAnchor.y  = 0;
            SVGToMotifs._prevControl.x = SVGToMotifs._prevControl.y = 0;
            SVGToMotifs._prevControl.x = SVGToMotifs._prevControl.y = 0;

            let commands: any = d.match(/(?:[a-zA-Z] ?(?:[0-9.-],? ?)+)|(?:z|Z)/g); // split all commands
            let n: number = commands.length;
            let temp: string = '';

            for (let i: number = 0; i < n; i++) {
                temp = trim(removeMultipleSpaces(commands[i]));
                temp = temp.replace(/([a-zA-Z]) /g, '$1'); // remove space after "command char"
                temp = removeAllWhiteSpaces(temp, ',');
                // add "," before all "-" but the ones that already
                // have a comma before it and the ones that are just after a "commmand char"
                // temp = temp.replace(/((?<![a-zA-Z]|,)-)/g, ',$&');
                // [command, [params...]]
                commands[i] = (temp.length > 1)
                    ? [temp.substr(0, 1), temp.substr(1).split(',')]
                    : [parseFloat(temp.substr(0, 1))];
            }

            // TODO: check first command that isn't "m" since path may have multiple moveTo commands at the beginning
            if ((commands[0][0] + '').toLowerCase() === 'm') {
                SVGToMotifs._initAnchor.x = commands[0][1][0];
                SVGToMotifs._initAnchor.y = commands[0][1][1];
                if (SVGToMotifs._hasTransform) {
                    SVGToMotifs._initAnchor = transformPoint(SVGToMotifs._curMatrix, SVGToMotifs._initAnchor);
                }
            }

            SVGToMotifs._prevCommand = '';

            for (let j: number = 0; j < n; j++) {

                if (SVGToMotifs._prevCommand && SVGToMotifs._prevCommand.toLowerCase() === 'z') {
                    SVGToMotifs._initAnchor.x = commands[j][1][0];
                    SVGToMotifs._initAnchor.y = commands[j][1][1];
                    if (SVGToMotifs._hasTransform) {
                        SVGToMotifs._initAnchor = transformPoint(SVGToMotifs._curMatrix, SVGToMotifs._initAnchor);
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
                        SVGToMotifs.pLine(
                            SVGToMotifs.toAbsoluteX(commands[j][1][0]),
                            SVGToMotifs.toAbsoluteY(commands[j][1][1])
                        );
                        break;
                    case 'M':
                        SVGToMotifs.pMove(commands[j][1][0], commands[j][1][1]);
                        break;
                    case 'm':
                        SVGToMotifs.pMove(
                            SVGToMotifs.toAbsoluteX(commands[j][1][0]),
                            SVGToMotifs.toAbsoluteY(commands[j][1][1])
                        );
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
                        } // Add path drawing warning
                        break;
                }

                SVGToMotifs._prevCommand = commands[j][0];

            }

            if ((commands[commands.length - 1][0] + '').toLowerCase() !== 'z' ||
                commands[commands.length - 1][1] !== commands[0][1]) {
                SVGToMotifs._motifs.push( ['S', []] );
            } // remove last line if path is not closed
        }

        private static pArc(params: any[], isRelative: boolean = false): void {
            let end: PIXI.Point = new PIXI.Point(params[5], params[6]);
            if (isRelative)	SVGToMotifs.toAbsolute(end);
            let arc: SVGArc = new SVGArc(
                SVGToMotifs._prevAnchor, end,
                params[0], params[1], params[2], (params[3] === '1'), (params[4] === '1'));
            if (SVGToMotifs._hasTransform) {
                arc.matrix = SVGToMotifs._curMatrix;
                end = transformPoint(SVGToMotifs._curMatrix, end);
            }
            SVGToMotifs._motifs = SVGToMotifs._motifs.concat(arc.toMotifs(false));
            SVGToMotifs._prevAnchor = end;
        }

        private static pCubic(params: any[], isRelative: boolean = false): void {
            let _params = [];
            let c1: PIXI.Point = new PIXI.Point(params[0], params[1]);
            let c2: PIXI.Point = new PIXI.Point(params[2], params[3]);
            let p2: PIXI.Point = new PIXI.Point(params[4], params[5]);
            for (let i = 0; i < params.length; ++i) {
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
                    let bezier: CubicBezier = new CubicBezier(c1, c2, SVGToMotifs._prevAnchor, p2);
                    if (SVGToMotifs._hasTransform) {
                        bezier = bezier.transform(SVGToMotifs._curMatrix);
                    }
                    SVGToMotifs._motifs = SVGToMotifs._motifs.concat(bezier.toMotifs());
                    _params = [];
                }
            }

            SVGToMotifs._prevAnchor = p2;
            SVGToMotifs._prevControl = c2;
        }

        private static pSmoothCubic(params: any[], isRelative: boolean = false): void {
            let c1: PIXI.Point = (
                SVGToMotifs._prevCommand.toUpperCase() === 'C' ||
                SVGToMotifs._prevCommand.toUpperCase() === 'S')
                ? reflectPoint(SVGToMotifs._prevControl, SVGToMotifs._prevAnchor)
                : SVGToMotifs._prevAnchor;
            if (isRelative) SVGToMotifs.toRelative(c1);
            SVGToMotifs.pCubic(
                [c1.x, c1.y, params[0], params[1], params[2], params[3]],
                isRelative
            );
        }

        private static pLine(endX: number, endY: number): void {
            let p: PIXI.Point = new PIXI.Point(endX, endY);
            SVGToMotifs._prevAnchor = p; // should be stored before transform
            if (SVGToMotifs._hasTransform) {
                p = transformPoint(SVGToMotifs._curMatrix, p);
            }
            SVGToMotifs._motifs.push(['L', [limitPrecision(p.x), limitPrecision(p.y)]]);
        }

        private static pMove(x: number, y: number): void {
            let p: PIXI.Point = new PIXI.Point(x, y);
            SVGToMotifs._prevAnchor = p; // should be stored before transform
            if (SVGToMotifs._hasTransform) {
                p = transformPoint(SVGToMotifs._curMatrix, p);
            }
            SVGToMotifs._motifs.push(['M', [limitPrecision(p.x), limitPrecision(p.y)]]);
        }

        private static pQuad(params: any[], isRelative: boolean = false): void {
            let _params = [];
            let c: PIXI.Point = new PIXI.Point(params[0], params[1]);
            let p2: PIXI.Point = new PIXI.Point(params[2], params[3]);
            for (let i = 0; i < params.length; ++i) {
                _params.push(params[i]);
                if (_params.length === 4) {
                    c.set(_params[0], _params[1]);
                    p2.set(_params[2], _params[3]);
                    if (isRelative) {
                        SVGToMotifs.toRelative(c);
                        SVGToMotifs.toRelative(p2);
                    }
                    let quad: QuadraticBezier = new QuadraticBezier(c, SVGToMotifs._prevAnchor, p2);
                    if (SVGToMotifs._hasTransform) {
                        quad.transform(SVGToMotifs._curMatrix);
                    }
                    SVGToMotifs._motifs = SVGToMotifs._motifs.concat(quad.toMotifs());
                    _params = [];
                }
            }

            SVGToMotifs._prevControl = c;
            SVGToMotifs._prevAnchor = p2;
        }

        private static pSmoothQuad(params: any[], isRelative: boolean = false): void {
            let c: PIXI.Point = (
                SVGToMotifs._prevCommand.toUpperCase() === 'Q' ||
                SVGToMotifs._prevCommand.toUpperCase() === 'T')
                ? reflectPoint(SVGToMotifs._prevControl, SVGToMotifs._prevAnchor)
                : SVGToMotifs._prevAnchor;
            SVGToMotifs.pQuad([c.x, c.y, params[0], params[1]], isRelative);
        }

        private static pClose(): void {
            SVGToMotifs._motifs.push(['L', [SVGToMotifs._initAnchor.x, SVGToMotifs._initAnchor.y]]);
        }

        private static toAbsolute(p: PIXI.Point): void {
            p.x += SVGToMotifs._prevAnchor.x;
            p.y += SVGToMotifs._prevAnchor.y;
        }

        private static toRelative(p: PIXI.Point): void {
            p.x -= SVGToMotifs._prevAnchor.x;
            p.y -= SVGToMotifs._prevAnchor.y;
        }

        private static toAbsoluteX(x: number): number {
            return x + SVGToMotifs._prevAnchor.x;
        }

        private static toAbsoluteY(y: number): number {
            return y + SVGToMotifs._prevAnchor.y;
        }

        constructor() {
            throw new Error('This is a STATIC CLASS and should not be instantiated.');
        }
    }
}
