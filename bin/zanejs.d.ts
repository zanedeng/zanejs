/// <reference types="pixi.js" />
declare module zanejs {
    class AssetsBundle {
    }
}
declare module zanejs {
    class AssetsBundleEvent {
        static ERROR: string;
        static PROGRESS: string;
        static COMPLETE: string;
    }
}
declare module zanejs {
    class AssetsManager {
        constructor();
    }
}
declare module zanejs {
    function paserZipMiddleware(resource: any, next: any): void;
}
declare module zanejs {
    class Arc {
        matrix: PIXI.Matrix;
        protected _cx: number;
        protected _cy: number;
        protected _rx: number;
        protected _ry: number;
        protected _rotation: number;
        protected _angleStart: number;
        protected _angleExtent: number;
        static toEndPoint(a: Arc): any;
        constructor(cx?: number, cy?: number, rx?: number, ry?: number, rotation?: number, angleStart?: number, angleExtent?: number);
        getCurves(): QuadraticBezier[];
        getBaseEllipse(): Ellipse;
        plot(g: PIXI.Graphics, moveTo?: boolean, endFill?: boolean): void;
        toMotifs(moveTo?: boolean, endFill?: boolean): any[];
        clone(): Arc;
        toString(): string;
    }
}
declare module zanejs {
    class CubicBezier {
        c1: PIXI.Point;
        c2: PIXI.Point;
        p1: PIXI.Point;
        p2: PIXI.Point;
        static toQuadratics(c: CubicBezier): any[];
        static getPoint(c: CubicBezier, ratio: number): PIXI.Point;
        static segment(c: CubicBezier, start?: number, end?: number): CubicBezier;
        static split(c: CubicBezier, ratio?: number): CubicBezier[];
        private static getBaseLines;
        private static getSubLines;
        constructor(c1: PIXI.Point, c2: PIXI.Point, p1: PIXI.Point, p2: PIXI.Point);
        setPoints(c1: PIXI.Point, c2: PIXI.Point, p1: PIXI.Point, p2: PIXI.Point): void;
        plot(g: PIXI.Graphics, moveTo?: boolean): void;
        toMotifs(moveTo?: boolean): any[];
        transform(t: PIXI.Matrix): CubicBezier;
        clone(): CubicBezier;
        toString(): String;
    }
}
declare module zanejs {
    class Ellipse {
        rotation: number;
        private static CONTROL_DISTANCE;
        cx: number;
        cy: number;
        rx: number;
        ry: number;
        matrix: PIXI.Matrix;
        constructor(cx: number, cy: number, rx: number, ry: number);
        getCurves(): CubicBezier[];
        transform(transformMatrix: PIXI.Matrix): Ellipse;
        plot(g: PIXI.Graphics, moveTo?: boolean, endFill?: boolean): void;
        toMotifs(moveTo?: boolean, endFill?: boolean): any[];
        getPoint(ratio: number): PIXI.Point;
        getPointByAngle(angle: number): PIXI.Point;
        getPointByRadianAngle(radAngle: number): PIXI.Point;
        clone(): Ellipse;
        toString(): string;
    }
}
declare module zanejs {
    class Line {
        readonly middle: PIXI.Point;
        readonly length: number;
        start: PIXI.Point;
        end: PIXI.Point;
        static getPoint(line: Line, ratio: number): PIXI.Point;
        static segment(line: Line, start?: number, end?: number): Line;
        static split(line: Line, ratio?: number): Line[];
        constructor(start: PIXI.Point, end: PIXI.Point);
        setPoints(start: PIXI.Point, end: PIXI.Point): void;
        transform(t: PIXI.Matrix): Line;
        plot(g: PIXI.Graphics, moveTo?: boolean): void;
        toMotifs(moveTo?: boolean): any[];
        clone(): Line;
        toString(): String;
    }
}
declare module zanejs {
    class Polygon extends Polyline {
        constructor(pts: PIXI.Point[]);
        points: PIXI.Point[];
        transform(matrix: PIXI.Matrix): Polygon;
        clone(): Polyline;
    }
}
declare module zanejs {
    class Polyline {
        protected _points: PIXI.Point[];
        constructor(pts: PIXI.Point[]);
        points: PIXI.Point[];
        readonly length: number;
        plot(g: PIXI.Graphics, moveTo?: boolean): void;
        toMotifs(moveTo?: boolean): any[];
        addPoints(...pts: PIXI.Point[]): void;
        transform(matrix: PIXI.Matrix): Polyline;
        clone(): Polyline;
        toString(): string;
    }
}
declare module zanejs {
    class QuadraticBezier {
        c: PIXI.Point;
        p1: PIXI.Point;
        p2: PIXI.Point;
        static getPoint(q: QuadraticBezier, ratio: number): PIXI.Point;
        static segment(q: QuadraticBezier, start?: number, end?: number): QuadraticBezier;
        static split(q: QuadraticBezier, ratio?: number): QuadraticBezier[];
        private static getBaseLines;
        private static getSubLine;
        constructor(c: PIXI.Point, p1: PIXI.Point, p2: PIXI.Point);
        plot(g: PIXI.Graphics, moveTo?: boolean, endFill?: boolean): void;
        toMotifs(moveTo?: boolean, endFill?: boolean): any[];
        transform(t: PIXI.Matrix): QuadraticBezier;
        clone(): QuadraticBezier;
        toString(): string;
    }
}
declare module zanejs {
    class Rect {
        private static CONTROL_DISTANCE;
        matrix: PIXI.Matrix;
        private _x;
        private _y;
        private _wid;
        private _hei;
        private _rx;
        private _ry;
        private _base;
        constructor(x: number, y: number, wid: number, hei: number, rx?: number, ry?: number);
        transform(transformMatrix: PIXI.Matrix): Rect;
        plot(g: PIXI.Graphics, moveTo?: boolean): void;
        toMotifs(moveTo?: boolean): any[];
        clone(): Rect;
    }
}
declare module zanejs {
    class SVGArc extends Arc {
        constructor(start: PIXI.Point, end: PIXI.Point, rx: number, ry: number, rotation?: number, isLarge?: boolean, isCounterClockwise?: boolean);
    }
}
declare module zanejs {
    interface IControllerClass {
        new (cmd: string): Controller;
    }
    class Controller {
        static controllerList: Controller[];
        cmd: string;
        static notifyControllers(cmd: string, data?: any, sponsor?: any): void;
        static hasController(cmd: string): boolean;
        static removeController(cmd: string): boolean;
        constructor(cmd: string);
        onRegister(): void;
        onRemove(): void;
        execute(data?: any, sponsor?: any): void;
        sendEvent(cmd: string, data?: any, strict?: boolean): void;
        registerView(name: string, ViewClass: IViewClass, viewComponent: Object): View;
        retrieveView(name: string): View;
        removeView(name: string): void;
        registerController(cmd: string, ControllClass: IControllerClass): Controller;
        removeController(cmd: string): void;
        registerModel(name: string, ModelClass: IModelClass, data?: any): Model;
        retrieveModel(name: string): Model;
        removeModel(name: string): void;
    }
}
declare module zanejs {
    interface IModelClass {
        new (name: string, data?: any): Model;
    }
    class Model {
        static modelList: Model[];
        name: string;
        data: any;
        static retrieveModel(name: string): Model;
        static removeModel(name: string): void;
        constructor(name: string, data?: any);
        onRegister(): void;
        onRemove(): void;
        sendEvent(type: string, data?: any): void;
    }
}
declare module zanejs {
    class MVCApp {
        registerController(cmd: string, controllClass: IControllerClass): Controller;
        registerModel(name: string, modelClass: IModelClass, data?: any): Model;
        registerView(name: string, viewClass: IViewClass, viewComponent: any): View;
    }
}
declare module zanejs {
    interface IViewClass {
        new (name: string, viewComponent: any): View;
    }
    class View {
        static viewList: View[];
        name: string;
        viewComponent: any;
        eventList: string[];
        static retrieveView(name: string): View;
        static removeView(name: string): void;
        static removeViews(...argArray: string[]): void;
        static removeAllView(...exception: string[]): void;
        static notifyViews(type: string, data?: any, sponsor?: any): void;
        constructor(name: string, viewComponent: any);
        onRegister(): void;
        onRemove(): void;
        listEventInterests(): string[];
        handleEvent(type: string, data?: any, sponsor?: any): void;
        sendEvent(type: string, data?: any, strict?: boolean): void;
        registerView(name: string, viewClass: IViewClass, viewComponent: Object): View;
        retrieveView(name: string): View;
        retrieveModel(name: string): Model;
    }
}
declare module zanejs {
    class CSSParser {
        private _css;
        constructor();
        parseCSS(cssStr: string): void;
        readonly selectors: string[];
        getStyle(selector: string): any;
        setStyle(selector: string, styleObj: any): void;
        clear(): void;
        private parseSelectors;
        private parseProperties;
    }
}
declare module zanejs {
    class MotifsToHTML5CanvasCommands {
        private static _prevFillStyle;
        private static _prevLineStyle;
        private static _prevCommand;
        private static _hasFill;
        private static _hasStroke;
        static toCommandsString(motifs: any[]): string;
        private static beginFill;
        private static parseColor;
        private static quadraticBezier;
        private static endFill;
        private static lineTo;
        private static moveTo;
        private static lineStyle;
        constructor();
    }
}
declare module zanejs {
    class MotifsToPixiGraphicsCommands {
        private static _prevFillStyle;
        private static _prevLineStyle;
        private static _prevCommand;
        private static _hasFill;
        private static _hasStroke;
        static toCommandsString(motifs: any[]): string;
        private static lineStyle;
        private static beginFill;
        private static lineTo;
        private static moveTo;
        private static quadraticBezier;
        private static endFill;
    }
}
declare module zanejs {
    class SVGToMotifs {
        private static _eWarnings;
        private static _aWarnings;
        private static _pWarnings;
        private static _tWarnings;
        private static _motifs;
        private static _initAnchor;
        private static _prevAnchor;
        private static _prevControl;
        private static _prevCommand;
        private static _curMatrix;
        private static _hasTransform;
        private static _warnings;
        private static SUPPORTED_ATT;
        private static SUPPORTED_TAG;
        static getWarnings(): string;
        static parse(svg: string): any[];
        private static parseTags;
        private static parseAttributes;
        private static parseElements;
        private static parseTransform;
        private static validateAttribute;
        private static mergeAttributes;
        private static clearWarnings;
        private static eCircle;
        private static eEllipse;
        private static eLine;
        private static ePolygon;
        private static ePolyline;
        private static eRect;
        private static ePath;
        private static pArc;
        private static pCubic;
        private static pSmoothCubic;
        private static pLine;
        private static pMove;
        private static pQuad;
        private static pSmoothQuad;
        private static pClose;
        private static toAbsolute;
        private static toRelative;
        private static toAbsoluteX;
        private static toAbsoluteY;
        constructor();
    }
}
declare module zanejs {
    interface IAjaxOptions {
        url: string;
        type?: string;
        data?: any;
        contentType?: string;
        dataType?: string;
        async?: boolean;
        timeOut?: number;
        before?: Function;
        error?: Function;
        success?: Function;
    }
    function ajax(options: IAjaxOptions): void;
}
declare module zanejs {
    function compare(arr1: any[], arr2: any[]): boolean;
}
declare module zanejs {
    function randomSort(arr: any[]): any[];
}
declare module zanejs {
    function removeEmptyItems(arr: any[]): any[];
}
declare module zanejs {
    function toStringArray(arr: any): string;
}
declare module zanejs {
    function colorToHex(color: any): any;
}
declare module zanejs {
    function colorToUint(color: string): number;
}
declare module zanejs {
    function fadeColor(startColor: number, endColor: number, position: number): number;
}
declare module zanejs {
    function getHtmlColors(): any;
    function cleanHtmlColors(): void;
}
declare module zanejs {
    function hexToUint(hex: string): number;
}
declare module zanejs {
    function htmlColorToHex(htmlColorName: string): string;
}
declare module zanejs {
    function htmlColorToUint(htmlColorName: string): number;
}
declare module zanejs {
    function percToUint(perc: string): number;
}
declare module zanejs {
    function rgbToHex(rgb: string): string;
}
declare module zanejs {
    function rgbToUint(rgb: string): number;
}
declare module zanejs {
    function uintToHex(u: number): string;
}
declare module zanejs {
    function uintToRGBA(color: number, alpha?: number): string;
}
declare module zanejs {
    let PI: number;
    let DEG_TO_RAD: number;
    let RAD_TO_DEG: number;
    function degreeToRadians(degree: number): number;
}
declare module zanejs {
    function plotPoint(g: PIXI.Graphics, p: PIXI.Point, color?: number, size?: number): void;
}
declare module zanejs {
    function radianToDegree(radian: number): number;
}
declare module zanejs {
    function reflectPoint(point: PIXI.Point, pivot: PIXI.Point): PIXI.Point;
}
declare module zanejs {
    function concat(m1: PIXI.Matrix, m2: PIXI.Matrix): PIXI.Matrix;
}
declare module zanejs {
    function getRotation(m: PIXI.Matrix): number;
}
declare module zanejs {
    function getRotationRadians(m: PIXI.Matrix): number;
}
declare module zanejs {
    function getScaleX(m: PIXI.Matrix): number;
}
declare module zanejs {
    function getScaleY(m: PIXI.Matrix): number;
}
declare module zanejs {
    function getSkewX(m: PIXI.Matrix): number;
}
declare module zanejs {
    function getSkewXRadians(m: PIXI.Matrix): number;
}
declare module zanejs {
    function getSkewY(m: PIXI.Matrix): number;
}
declare module zanejs {
    function getSkewYRadians(m: PIXI.Matrix): number;
}
declare module zanejs {
    function matchInternalPointWithExternal(m: PIXI.Matrix, internalPoint: PIXI.Point, externalPoint: PIXI.Point): PIXI.Matrix;
}
declare module zanejs {
    function rotateAroundExternalPoint(m: PIXI.Matrix, pivot: PIXI.Point, angleDegrees: number): PIXI.Matrix;
}
declare module zanejs {
    function rotateAroundInternalPoint(m: PIXI.Matrix, pivot: PIXI.Point, angleDegrees: number): PIXI.Matrix;
}
declare module zanejs {
    function setRotation(m: PIXI.Matrix, value: number): PIXI.Matrix;
}
declare module zanejs {
    function setRotationRadians(m: PIXI.Matrix, value: number): PIXI.Matrix;
}
declare module zanejs {
    function setScaleX(m: PIXI.Matrix, value: number): PIXI.Matrix;
}
declare module zanejs {
    function setScaleY(m: PIXI.Matrix, value: number): PIXI.Matrix;
}
declare module zanejs {
    function setSkewX(m: PIXI.Matrix, value: number): PIXI.Matrix;
}
declare module zanejs {
    function setSkewXRadians(m: PIXI.Matrix, value: number): PIXI.Matrix;
}
declare module zanejs {
    function setSkewY(m: PIXI.Matrix, value: number): PIXI.Matrix;
}
declare module zanejs {
    function setSkewYRadians(m: PIXI.Matrix, value: number): PIXI.Matrix;
}
declare module zanejs {
    function transformPoint(m: PIXI.Matrix, pivot: PIXI.Point, resultPoint?: PIXI.Point): PIXI.Point;
}
declare module zanejs {
    function limitPrecision(n: number, maxPrecision?: number): number;
}
declare module zanejs {
    function uint(value: any): number;
}
declare module zanejs {
    function getQualifiedClassName(value: any): string;
}
declare module zanejs {
    function merge(base: any, extend: any): any;
}
declare module zanejs {
    function toObject(objString: string): any;
}
declare module zanejs {
    function distance(p1: PIXI.Point, p2: PIXI.Point): number;
}
declare module zanejs {
    function addcslashes(str: string, charlist?: string): string;
}
declare module zanejs {
    function addslashes(str: string): string;
}
declare module zanejs {
    function bin2hex(s: string): string;
}
declare module zanejs {
    function chr(codePt: number): string;
}
declare module zanejs {
    function chunk_split(body: string, chunklen: number, end: string): any;
}
declare module zanejs {
    function count_chars(str: string, mode: number): any;
}
declare module zanejs {
    function echo(...args: any[]): void;
}
declare module zanejs {
    function endsWith(input: string, suffix: string): boolean;
}
declare module zanejs {
    function explode(delimiter: any, str: string, limit: number): false | string[] | {
        0: string;
    };
}
declare module zanejs {
    function firstToUpper(str: string): string;
}
declare module zanejs {
    function get_html_translation_table(table: string, quoteStyle?: string): any;
}
declare module zanejs {
    function hex2bin(s: string): any;
}
declare module zanejs {
    function html_entity_decode(str: string, quoteStyle?: string): any;
}
declare module zanejs {
    function http_build_query(formData: any, numericPrefix?: string, argSeparator?: string): any;
}
declare module zanejs {
    function implode(glue: string, pieces: any): any;
}
declare module zanejs {
    function ltrim(str: string): string;
}
declare module zanejs {
    function number_format(num: any, decimals: number, decPoint: string, thousandsSep: string): string;
}
declare module zanejs {
    function padLeft(value: string, padChar: string, length: number): string;
}
declare module zanejs {
    function padRight(value: string, padChar: string, length: number): string;
}
declare module zanejs {
    function parse_url(str: string, component: string, mode?: string): any;
}
declare module zanejs {
    function rawurldecode(str: string): string;
}
declare module zanejs {
    function rawurlencode(str: string): string;
}
declare module zanejs {
    function removeAllComments(str: string, replace?: string): string;
}
declare module zanejs {
    function removeAllWhiteSpaces(str: string, replace?: string): string;
}
declare module zanejs {
    function removeLineBreaks(str: string, replace?: string): string;
}
declare module zanejs {
    function removeMultiLineComments(str: string, replace?: string): string;
}
declare module zanejs {
    function removeMultipleSpaces(str: string, replace?: string): string;
}
declare module zanejs {
    function removeNonWordChars(str: string, replace?: string): string;
}
declare module zanejs {
    function removeSingleLineComments(str: string, replace?: string): string;
}
declare module zanejs {
    function removeSpaces(str: string, replace?: string): string;
}
declare module zanejs {
    function removeSpecialChars(str: string, replace?: string): string;
}
declare module zanejs {
    function removeTabs(str: string, replace?: string): string;
}
declare module zanejs {
    function replaceAccents(str: string): string;
}
declare module zanejs {
    function rtrim(str: string, charlist?: string): string;
    function chop(str: string, charlist?: string): string;
}
declare module zanejs {
    function serialize(mixedValue: any): any;
}
declare module zanejs {
    function stringsAreEqual(s1: string, s2: string, caseSensitive?: boolean): boolean;
}
declare module zanejs {
    function stringTruncate(value: string, length: number, suffix?: string): string;
}
declare module zanejs {
    function stripslashes(str: string): string;
}
declare module zanejs {
    function toCamelCase(str: string): string;
}
declare module zanejs {
    function toPathFormat(...rest: any[]): string;
}
declare module zanejs {
    function toProperCase(str: string): string;
}
declare module zanejs {
    function toTitleFormat(path: string, defaultTitle?: string, separator?: string): string;
}
declare module zanejs {
    function trim(str: string): string;
}
declare module zanejs {
    function unserialize(data: any): any;
}
declare module zanejs {
    function urldecode(str: string): string;
}
declare module zanejs {
    function urlencode(str: string): string;
}
declare module zanejs {
    function utf8_decode(strData: any): string;
}
declare module zanejs {
    function utf8_encode(argString: string): string;
}
declare module zanejs {
    function xtrim(str?: string): string;
}
declare module zanejs {
    function stringToXMLDom(str: string): any;
}
declare module zanejs {
    class WS {
        private _url;
        private _protocols;
        private _websocket;
        private _reconnectLock;
        private _heartBeatTime;
        private _heartBeatData;
        private _timeout;
        private _heartBeatTimer;
        private _closeTimer;
        private _header;
        private _onclose;
        private _onerror;
        private _onopen;
        private _onmessage;
        constructor(url: string, protocols?: string | string[], options?: any);
        send(data: any): void;
        close(code?: number, reason?: string): void;
        private initWebsocket;
        private reconnect;
        private heartCheck;
    }
}
declare module zanejs {
    class WSManager {
        static connections: any;
        static subscribe(url: string, protocols?: string | string[], options?: any): WS;
        static unSubscribe(url: string, code?: number, reason?: string): void;
        static getConnectionsFrom(url: string): WS;
        constructor();
    }
}
