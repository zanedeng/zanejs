var zanejs;
(function (zanejs) {
    var Symbol = window.Symbol;
    var idCounter = 0;
    if (!Symbol) {
        Symbol = function (key) {
            return "__" + key + "_" + Math.floor(Math.random() * 1e9) + "_" + ++idCounter + "__";
        };
        Symbol.iterator = Symbol('Symbol.iterator');
    }
    window.Symbol = Symbol;
    var __ = {
        poolDic: Symbol('poolDic')
    };
    var Pool = (function () {
        function Pool() {
            this[__.poolDic] = {};
        }
        Pool.prototype.getPoolBySign = function (name) {
            return this[__.poolDic][name] || (this[__.poolDic][name] = []);
        };
        Pool.prototype.getItemByClass = function (name, ClassName) {
            var pool = this.getPoolBySign(name);
            var result = (pool.length ?
                pool.shift() :
                new ClassName());
            return result;
        };
        Pool.prototype.recover = function (name, instance) {
            this.getPoolBySign(name).push(instance);
        };
        return Pool;
    }());
    zanejs.Pool = Pool;
    zanejs.pool = new Pool();
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var State = (function () {
        function State(state) {
            this.state = state;
            this.last = '';
            this.count = -1;
            this.locked = false;
        }
        State.prototype.setTo = function (state) {
            if (this.locked) {
                return;
            }
            this.last = this.state;
            this.state = state;
            this.count = -1;
        };
        State.prototype.value = function () { return this.state; };
        State.prototype.tick = function () {
            this.count++;
        };
        State.prototype.first = function () {
            return this.count === 0;
        };
        State.prototype.equal = function (state) {
            return state === this.state;
        };
        State.prototype.isIn = function () {
            var state = this.state, args = Array.prototype.slice.call(arguments);
            return args.some(function (s) {
                return s === state;
            });
        };
        State.prototype.isNotIn = function () {
            return !(this.isIn.apply(this, arguments));
        };
        return State;
    }());
    zanejs.State = State;
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
    var AssetsBundle = (function (_super) {
        __extends(AssetsBundle, _super);
        function AssetsBundle() {
            var _this = _super.call(this) || this;
            _this._assets = [];
            _this._afterMiddlewares = [];
            _this._beforeMiddlewares = [];
            return _this;
        }
        Object.defineProperty(AssetsBundle.prototype, "afterMiddlewares", {
            get: function () {
                return this._afterMiddlewares;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AssetsBundle.prototype, "beforeMiddlewares", {
            get: function () {
                return this._beforeMiddlewares;
            },
            enumerable: true,
            configurable: true
        });
        AssetsBundle.prototype.getAssets = function () {
            return this._assets;
        };
        AssetsBundle.prototype.addBeforeMiddleware = function (func) {
            if (this._beforeMiddlewares.indexOf(func) === -1) {
                this._beforeMiddlewares.push(func);
            }
        };
        AssetsBundle.prototype.addAfterMiddleware = function (func) {
            if (this._afterMiddlewares.indexOf(func) === -1) {
                this._afterMiddlewares.push(func);
            }
        };
        AssetsBundle.prototype.add = function (name, url, options, cb) {
            if (!this.isExist(name)) {
                this._assets.push({ name: name, url: url, options: options, cb: cb });
            }
            return this;
        };
        AssetsBundle.prototype.isExist = function (name) {
            return this._checkExist(name);
        };
        AssetsBundle.prototype.onDispose = function () {
            this.progress = 0;
            this.removeAllListeners();
            this._assets = [];
            this._afterMiddlewares = [];
            this._beforeMiddlewares = [];
        };
        AssetsBundle.prototype.reset = function () {
            this.onDispose();
        };
        AssetsBundle.prototype._checkExist = function (name) {
            for (var i = 0, l = this._assets.length; i < l; ++i) {
                if (name === this._assets[i].name) {
                    return true;
                }
            }
            return false;
        };
        return AssetsBundle;
    }(PIXI.utils.EventEmitter));
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
    var _resLoader = new PIXI.loaders.Loader('', 6);
    var _ignoreFileList = [];
    var _waitBundles = [];
    var _currentBundle = null;
    var _resLoaderIdle = true;
    var AssetsManager = (function () {
        function AssetsManager() {
            throw new Error('This is a STATIC CLASS and should not be instantiated.');
        }
        Object.defineProperty(AssetsManager, "loader", {
            get: function () {
                return _resLoader;
            },
            enumerable: true,
            configurable: true
        });
        AssetsManager.addIgnoreFile = function (file) {
            if (_ignoreFileList.indexOf(file) === -1) {
                _ignoreFileList.push(file);
            }
        };
        AssetsManager.addIgnoreFiles = function (files) {
            var len = files.length;
            for (var i = 0; i < len; i++) {
                AssetsManager.addIgnoreFile(files[i]);
            }
        };
        AssetsManager.deleteIgnoreFiles = function (files) {
            var len = files.length;
            for (var i = len - 1; i >= 0; i--) {
                var pos = _ignoreFileList.indexOf(files[i]);
                if (pos !== -1) {
                    _ignoreFileList.splice(pos, 1);
                }
            }
        };
        AssetsManager.clearIgnoreFiles = function () {
            _ignoreFileList = [];
        };
        AssetsManager.loadAssetBundle = function (bundle) {
            if (_waitBundles.indexOf(bundle) === -1) {
                _waitBundles.push(bundle);
            }
            AssetsManager._loadAssetBundle();
        };
        AssetsManager.getResById = function (id) {
            return _resLoader.resources[id];
        };
        AssetsManager.getResByUrl = function (url) {
            Object.keys(_resLoader.resources).map(function (key) {
                var resInfo = _resLoader.resources[key];
                if (resInfo.url === url) {
                    return resInfo;
                }
            });
            return null;
        };
        AssetsManager.clearResLoader = function (destroyBase, otherHandler) {
            if (destroyBase === void 0) { destroyBase = false; }
            if (otherHandler === void 0) { otherHandler = null; }
            destroyBase = !!destroyBase;
            Object.keys(_resLoader.resources).map(function (key) {
                if (_ignoreFileList.indexOf(key) !== -1) {
                    return;
                }
                var resource = _resLoader.resources[key];
                if (resource.texture) {
                    resource.texture.destroy(destroyBase);
                }
                if (otherHandler) {
                    otherHandler(resource);
                }
                delete _resLoader.resources[key];
            });
        };
        AssetsManager._loadAssetBundle = function () {
            if (_resLoaderIdle) {
                _currentBundle = _waitBundles.shift();
                if (_currentBundle) {
                    _resLoaderIdle = false;
                    _resLoader.progress = 0;
                    _resLoader.loading = false;
                    var count_1 = 0;
                    var res = _currentBundle.getAssets();
                    res.map(function (item) {
                        if (!_resLoader.resources[item.name]) {
                            _resLoader.add(item.name, item.url, item.options, item.cb);
                            count_1++;
                        }
                    });
                    if (count_1 > 0) {
                        _resLoader.onError.once(AssetsManager._onLoadAssetError);
                        _resLoader.onComplete.once(AssetsManager._onLoadAssetComplete);
                        _resLoader.onProgress.add(AssetsManager._onLoadAssetProgress);
                        var beforeMiddlewares = _currentBundle.beforeMiddlewares;
                        beforeMiddlewares.forEach(function (func) {
                            _resLoader.pre(func);
                        });
                        var afterMiddlewares = _currentBundle.afterMiddlewares;
                        afterMiddlewares.forEach(function (func) {
                            _resLoader.pre(func);
                        });
                        _resLoader.load();
                    }
                    else {
                        AssetsManager._onLoadAssetComplete(_resLoader, _resLoader.resources);
                    }
                }
            }
        };
        AssetsManager._onLoadAssetError = function (errMsg, loader, res) {
            if (_currentBundle) {
                _currentBundle.emit(zanejs.AssetsBundleEvent.ERROR, {
                    name: res.name,
                    url: res.url
                });
            }
            if (res.texture) {
                res.texture.destroy(true);
            }
            delete loader.resources[res.name];
            res = null;
        };
        AssetsManager._onLoadAssetProgress = function (loader, res) {
            if (_currentBundle) {
                _currentBundle.emit(zanejs.AssetsBundleEvent.PROGRESS, loader.progress);
            }
        };
        AssetsManager._onLoadAssetComplete = function (loader, resources) {
            if (_currentBundle) {
                _currentBundle.progress = 1;
                _currentBundle.emit(zanejs.AssetsBundleEvent.COMPLETE, resources);
            }
            _resLoaderIdle = true;
            AssetsManager._loadAssetBundle();
        };
        return AssetsManager;
    }());
    zanejs.AssetsManager = AssetsManager;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function paserFui(file, relativePath, callback) {
        var baseName = file.name.substring(file.name.lastIndexOf('/') + 1, file.name.lastIndexOf('.'));
        file.async('arraybuffer').then(function (content) {
            var _a;
            var res = new PIXI.loaders.Resource(baseName, relativePath);
            res.data = content;
            fgui.utils.AssetLoader.addResources((_a = {},
                _a[baseName] = res,
                _a));
            if (callback) {
                callback();
            }
        });
    }
    function base64ToImage(data, onCompleteFunc, onCompleteArgArray, onCompleteThisArg) {
        if (onCompleteArgArray === void 0) { onCompleteArgArray = null; }
        if (onCompleteThisArg === void 0) { onCompleteThisArg = null; }
        var img = new Image();
        img.src = 'data:image/png;base64,' + data;
        img.onload = function (e) {
            if (onCompleteFunc) {
                onCompleteArgArray = onCompleteArgArray == null ? [img] : [img].concat(onCompleteArgArray);
                onCompleteFunc.apply(onCompleteThisArg, onCompleteArgArray);
            }
        };
        return img;
    }
    function paserImage(file, relativePath, callback) {
        var baseName = file.name.substring(file.name.lastIndexOf('/') + 1, file.name.lastIndexOf('.'));
        file.async('base64').then(function (content) {
            base64ToImage(content, function (img) {
                var _a;
                var res = new PIXI.loaders.Resource(baseName, relativePath);
                res.data = img;
                res.texture = new PIXI.Texture(new PIXI.BaseTexture(img));
                fgui.utils.AssetLoader.addResources((_a = {},
                    _a[baseName] = res,
                    _a));
                if (callback) {
                    callback();
                }
            });
        });
    }
    function paserZipMiddleware(resource, next) {
        if (resource.extension === 'zip') {
            var zip = new JSZip();
            zip.loadAsync(resource.data).then(function ($zip) {
                var fileNum = 0;
                var totalFileNum = Object.keys($zip.files).length;
                $zip.forEach(function (relativePath, file) {
                    var callback = function () {
                        fileNum++;
                        if (fileNum === totalFileNum) {
                            next();
                        }
                    };
                    var extension = file.name.split('.').pop();
                    switch (extension) {
                        case 'fui':
                            paserFui(file, relativePath, callback);
                            break;
                        case 'png':
                        case 'jpeg':
                        case 'jpg':
                            paserImage(file, relativePath, callback);
                            break;
                        default:
                            next();
                    }
                });
            });
        }
        else {
            next();
        }
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
    var ByteArraySize;
    (function (ByteArraySize) {
        ByteArraySize[ByteArraySize["SIZE_OF_BOOLEAN"] = 1] = "SIZE_OF_BOOLEAN";
        ByteArraySize[ByteArraySize["SIZE_OF_INT8"] = 1] = "SIZE_OF_INT8";
        ByteArraySize[ByteArraySize["SIZE_OF_INT16"] = 2] = "SIZE_OF_INT16";
        ByteArraySize[ByteArraySize["SIZE_OF_INT32"] = 4] = "SIZE_OF_INT32";
        ByteArraySize[ByteArraySize["SIZE_OF_UINT8"] = 1] = "SIZE_OF_UINT8";
        ByteArraySize[ByteArraySize["SIZE_OF_UINT16"] = 2] = "SIZE_OF_UINT16";
        ByteArraySize[ByteArraySize["SIZE_OF_UINT32"] = 4] = "SIZE_OF_UINT32";
        ByteArraySize[ByteArraySize["SIZE_OF_FLOAT32"] = 4] = "SIZE_OF_FLOAT32";
        ByteArraySize[ByteArraySize["SIZE_OF_FLOAT64"] = 8] = "SIZE_OF_FLOAT64";
    })(ByteArraySize || (ByteArraySize = {}));
    var ByteArray = (function () {
        function ByteArray(buffer, bufferExtSize) {
            if (bufferExtSize === void 0) { bufferExtSize = 0; }
            this._bufferExtSize = 0;
            this.EOFByte = -1;
            this.EOFCodePoint = -1;
            if (bufferExtSize < 0) {
                bufferExtSize = 0;
            }
            this._bufferExtSize = bufferExtSize;
            var bytes, wpos = 0;
            if (buffer) {
                var uint8 = void 0;
                if (buffer instanceof Uint8Array) {
                    uint8 = buffer;
                    wpos = buffer.length;
                }
                else {
                    wpos = buffer.byteLength;
                    uint8 = new Uint8Array(buffer);
                }
                if (bufferExtSize === 0) {
                    bytes = new Uint8Array(wpos);
                }
                else {
                    var multi = (wpos / bufferExtSize | 0) + 1;
                    bytes = new Uint8Array(multi * bufferExtSize);
                }
                bytes.set(uint8);
            }
            else {
                bytes = new Uint8Array(bufferExtSize);
            }
            this._writePosition = wpos;
            this._position = 0;
            this._bytes = bytes;
            this._data = new DataView(bytes.buffer);
            this.endian = zanejs.Endian.BIG_ENDIAN;
        }
        Object.defineProperty(ByteArray.prototype, "readAvailable", {
            get: function () {
                return this._writePosition - this._position;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "bytesAvailable", {
            get: function () {
                return this._data.byteLength - this._position;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "bytes", {
            get: function () {
                return this._bytes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "dataView", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this.buffer = value.buffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "rawBuffer", {
            get: function () {
                return this._data.buffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "buffer", {
            get: function () {
                return this._data.buffer.slice(0, this._writePosition);
            },
            set: function (value) {
                var wpos = value.byteLength;
                var uint8 = new Uint8Array(value);
                var bufferExtSize = this._bufferExtSize;
                var bytes;
                if (bufferExtSize === 0) {
                    bytes = new Uint8Array(wpos);
                }
                else {
                    var multi = (wpos / bufferExtSize | 0) + 1;
                    bytes = new Uint8Array(multi * bufferExtSize);
                }
                bytes.set(uint8);
                this._writePosition = wpos;
                this._bytes = bytes;
                this._data = new DataView(bytes.buffer);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "bufferOffset", {
            get: function () {
                return this._data.byteOffset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "position", {
            get: function () {
                return this._position;
            },
            set: function (value) {
                this._position = value;
                if (value > this._writePosition) {
                    this._writePosition = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "length", {
            get: function () {
                return this._writePosition;
            },
            set: function (value) {
                this._writePosition = value;
                if (this._data.byteLength > value) {
                    this._position = value;
                }
                this._validateBuffer(value);
            },
            enumerable: true,
            configurable: true
        });
        ByteArray.prototype.readBoolean = function () {
            if (this.validate(1)) {
                return !!this._bytes[this.position++];
            }
        };
        ByteArray.prototype.readByte = function () {
            if (this.validate(1)) {
                return this._data.getInt8(this.position++);
            }
        };
        ByteArray.prototype.readBytes = function (bytes, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            if (!bytes) {
                return;
            }
            var pos = this._position;
            var available = this._writePosition - pos;
            if (available < 0) {
                throw new Error('遇到文件尾');
                return;
            }
            if (length === 0) {
                length = available;
            }
            else if (length > available) {
                throw new Error('遇到文件尾');
                return;
            }
            var position = bytes._position;
            bytes._position = 0;
            bytes._validateBuffer(offset + length);
            bytes._position = position;
            bytes._bytes.set(this._bytes.subarray(pos, pos + length), offset);
            this.position += length;
        };
        ByteArray.prototype.readDouble = function () {
            if (this.validate(8)) {
                var value = this._data.getFloat64(this._position, this.endian === zanejs.Endian.LITTLE_ENDIAN);
                this.position += 8;
                return value;
            }
        };
        ByteArray.prototype.readFloat = function () {
            if (this.validate(4)) {
                var value = this._data.getFloat32(this._position, this.endian === zanejs.Endian.LITTLE_ENDIAN);
                this.position += 4;
                return value;
            }
        };
        ByteArray.prototype.readInt = function () {
            if (this.validate(4)) {
                var value = this._data.getInt32(this._position, this.endian === zanejs.Endian.LITTLE_ENDIAN);
                this.position += 4;
                return value;
            }
        };
        ByteArray.prototype.readShort = function () {
            if (this.validate(2)) {
                var value = this._data.getInt16(this._position, this.endian === zanejs.Endian.LITTLE_ENDIAN);
                this.position += 2;
                return value;
            }
        };
        ByteArray.prototype.readUnsignedByte = function () {
            if (this.validate(1)) {
                return this._bytes[this.position++];
            }
        };
        ByteArray.prototype.readUnsignedInt = function () {
            if (this.validate(4)) {
                var value = this._data.getUint32(this._position, this.endian === zanejs.Endian.LITTLE_ENDIAN);
                this.position += 4;
                return value;
            }
        };
        ByteArray.prototype.readUnsignedShort = function () {
            if (this.validate(2)) {
                var value = this._data.getUint16(this._position, this.endian === zanejs.Endian.LITTLE_ENDIAN);
                this.position += 2;
                return value;
            }
        };
        ByteArray.prototype.readUTF = function () {
            var length = this.readUnsignedShort();
            if (length > 0) {
                return this.readUTFBytes(length);
            }
            else {
                return '';
            }
        };
        ByteArray.prototype.readUTFBytes = function (length) {
            if (!this.validate(length)) {
                return;
            }
            var data = this._data;
            var bytes = new Uint8Array(data.buffer, data.byteOffset + this._position, length);
            this.position += length;
            return this._decodeUTF8(bytes);
        };
        ByteArray.prototype.writeBoolean = function (value) {
            this._validateBuffer(1);
            this._bytes[this.position++] = +value;
        };
        ByteArray.prototype.writeByte = function (value) {
            this._validateBuffer(1);
            this._bytes[this.position++] = value & 0xff;
        };
        ByteArray.prototype.writeBytes = function (bytes, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            var writeLength;
            if (offset < 0) {
                return;
            }
            if (length < 0) {
                return;
            }
            else if (length === 0) {
                writeLength = bytes.length - offset;
            }
            else {
                writeLength = Math.min(bytes.length - offset, length);
            }
            if (writeLength > 0) {
                this._validateBuffer(writeLength);
                this._bytes.set(bytes._bytes.subarray(offset, offset + writeLength), this._position);
                this.position = this._position + writeLength;
            }
        };
        ByteArray.prototype.writeDouble = function (value) {
            this._validateBuffer(8);
            this._data.setFloat64(this._position, value, this.endian === zanejs.Endian.LITTLE_ENDIAN);
            this.position += 8;
        };
        ByteArray.prototype.writeFloat = function (value) {
            this._validateBuffer(4);
            this._data.setFloat32(this._position, value, this.endian === zanejs.Endian.LITTLE_ENDIAN);
            this.position += 4;
        };
        ByteArray.prototype.writeInt = function (value) {
            this._validateBuffer(4);
            this._data.setInt32(this._position, value, this.endian === zanejs.Endian.LITTLE_ENDIAN);
            this.position += 4;
        };
        ByteArray.prototype.writeShort = function (value) {
            this._validateBuffer(2);
            this._data.setInt16(this._position, value, this.endian === zanejs.Endian.LITTLE_ENDIAN);
            this.position += 2;
        };
        ByteArray.prototype.writeUnsignedInt = function (value) {
            this._validateBuffer(4);
            this._data.setUint32(this._position, value, this.endian === zanejs.Endian.LITTLE_ENDIAN);
            this.position += 4;
        };
        ByteArray.prototype.writeUnsignedShort = function (value) {
            this._validateBuffer(2);
            this._data.setUint16(this._position, value, this.endian === zanejs.Endian.LITTLE_ENDIAN);
            this.position += 2;
        };
        ByteArray.prototype.writeUTF = function (value) {
            var utf8bytes = this._encodeUTF8(value);
            var length = utf8bytes.length;
            this._validateBuffer(2 + length);
            this._data.setUint16(this._position, length, this.endian === zanejs.Endian.LITTLE_ENDIAN);
            this.position += 2;
            this.writeUint8Array(utf8bytes, false);
        };
        ByteArray.prototype.writeUTFBytes = function (value) {
            this.writeUint8Array(this._encodeUTF8(value));
        };
        ByteArray.prototype.writeUint8Array = function (bytes, validateBuffer) {
            if (validateBuffer === void 0) { validateBuffer = true; }
            var pos = this._position;
            var npos = pos + bytes.length;
            if (validateBuffer) {
                this._validateBuffer(npos);
            }
            this.bytes.set(bytes, pos);
            this.position = npos;
        };
        ByteArray.prototype.validate = function (len) {
            var bl = this._bytes.length;
            if (bl > 0 && this._position + len <= bl) {
                return true;
            }
            else {
                throw new Error('遇到文件尾');
            }
        };
        ByteArray.prototype.clear = function () {
            var buffer = new ArrayBuffer(this._bufferExtSize);
            this._data = new DataView(buffer);
            this._bytes = new Uint8Array(buffer);
            this._position = 0;
            this._writePosition = 0;
        };
        ByteArray.prototype._validateBuffer = function (value) {
            if (this._data.byteLength < value) {
                var be = this._bufferExtSize;
                var tmp = void 0;
                if (be === 0) {
                    tmp = new Uint8Array(value);
                }
                else {
                    var nLen = ((value / be >> 0) + 1) * be;
                    tmp = new Uint8Array(nLen);
                }
                tmp.set(this._bytes);
                this._bytes = tmp;
                this._data = new DataView(tmp.buffer);
            }
        };
        ByteArray.prototype._encodeUTF8 = function (str) {
            var pos = 0;
            var codePoints = this._stringToCodePoints(str);
            var outputBytes = [];
            while (codePoints.length > pos) {
                var codePoint = codePoints[pos++];
                if (zanejs.inRange(codePoint, 0xD800, 0xDFFF)) {
                    this._encoderError(codePoint);
                }
                else if (zanejs.inRange(codePoint, 0x0000, 0x007f)) {
                    outputBytes.push(codePoint);
                }
                else {
                    var count = void 0, offset = void 0;
                    if (zanejs.inRange(codePoint, 0x0080, 0x07FF)) {
                        count = 1;
                        offset = 0xC0;
                    }
                    else if (zanejs.inRange(codePoint, 0x0800, 0xFFFF)) {
                        count = 2;
                        offset = 0xE0;
                    }
                    else if (zanejs.inRange(codePoint, 0x10000, 0x10FFFF)) {
                        count = 3;
                        offset = 0xF0;
                    }
                    outputBytes.push(Math.floor(codePoint / Math.pow(64, count)) + offset);
                    while (count > 0) {
                        var temp = Math.floor(codePoint / Math.pow(64, count - 1));
                        outputBytes.push(0x80 + (temp % 64));
                        count -= 1;
                    }
                }
            }
            return new Uint8Array(outputBytes);
        };
        ByteArray.prototype._decodeUTF8 = function (data) {
            var fatal = false;
            var pos = 0;
            var result = '';
            var codePoint;
            var utf8CodePoint = 0;
            var utf8BytesNeeded = 0;
            var utf8BytesSeen = 0;
            var utf8LowerBoundary = 0;
            while (data.length > pos) {
                var _byte = data[pos++];
                if (_byte === this.EOFByte) {
                    if (utf8BytesNeeded !== 0) {
                        codePoint = this._decoderError(fatal);
                    }
                    else {
                        codePoint = this.EOFCodePoint;
                    }
                }
                else {
                    if (utf8BytesNeeded === 0) {
                        if (zanejs.inRange(_byte, 0x00, 0x7F)) {
                            codePoint = _byte;
                        }
                        else {
                            if (zanejs.inRange(_byte, 0xC2, 0xDF)) {
                                utf8BytesNeeded = 1;
                                utf8LowerBoundary = 0x80;
                                utf8CodePoint = _byte - 0xC0;
                            }
                            else if (zanejs.inRange(_byte, 0xE0, 0xEF)) {
                                utf8BytesNeeded = 2;
                                utf8LowerBoundary = 0x800;
                                utf8CodePoint = _byte - 0xE0;
                            }
                            else if (zanejs.inRange(_byte, 0xF0, 0xF4)) {
                                utf8BytesNeeded = 3;
                                utf8LowerBoundary = 0x10000;
                                utf8CodePoint = _byte - 0xF0;
                            }
                            else {
                                this._decoderError(fatal);
                            }
                            utf8CodePoint = utf8CodePoint * Math.pow(64, utf8BytesNeeded);
                            codePoint = null;
                        }
                    }
                    else if (!zanejs.inRange(_byte, 0x80, 0xBF)) {
                        utf8CodePoint = 0;
                        utf8BytesNeeded = 0;
                        utf8BytesSeen = 0;
                        utf8LowerBoundary = 0;
                        pos--;
                        codePoint = this._decoderError(fatal, _byte);
                    }
                    else {
                        utf8BytesSeen += 1;
                        utf8CodePoint = utf8CodePoint +
                            (_byte - 0x80) * Math.pow(64, utf8BytesNeeded - utf8BytesSeen);
                        if (utf8BytesSeen !== utf8BytesNeeded) {
                            codePoint = null;
                        }
                        else {
                            var cp = utf8CodePoint;
                            var lowerBoundary = utf8LowerBoundary;
                            utf8CodePoint = 0;
                            utf8BytesNeeded = 0;
                            utf8BytesSeen = 0;
                            utf8LowerBoundary = 0;
                            if (zanejs.inRange(cp, lowerBoundary, 0x10FFFF) && !zanejs.inRange(cp, 0xD800, 0xDFFF)) {
                                codePoint = cp;
                            }
                            else {
                                codePoint = this._decoderError(fatal, _byte);
                            }
                        }
                    }
                }
                if (codePoint !== null && codePoint !== this.EOFCodePoint) {
                    if (codePoint <= 0xFFFF) {
                        if (codePoint > 0)
                            result += String.fromCharCode(codePoint);
                    }
                    else {
                        codePoint -= 0x10000;
                        result += String.fromCharCode(0xD800 + ((codePoint >> 10) & 0x3ff));
                        result += String.fromCharCode(0xDC00 + (codePoint & 0x3ff));
                    }
                }
            }
            return result;
        };
        ByteArray.prototype._encoderError = function (codePoint) {
            throw new Error('EncodingError! The code point ' + codePoint + ' could not be encoded.');
        };
        ByteArray.prototype._decoderError = function (fatal, optCodePoint) {
            if (fatal) {
                throw new Error('DecodingError!');
            }
            return optCodePoint || 0xFFFD;
        };
        ByteArray.prototype._stringToCodePoints = function (str) {
            var cps = [];
            var i = 0, n = str.length;
            while (i < str.length) {
                var c = str.charCodeAt(i);
                if (!zanejs.inRange(c, 0xD800, 0xDFFF)) {
                    cps.push(c);
                }
                else if (zanejs.inRange(c, 0xDC00, 0xDFFF)) {
                    cps.push(0xFFFD);
                }
                else {
                    if (i === n - 1) {
                        cps.push(0xFFFD);
                    }
                    else {
                        var d = str.charCodeAt(i + 1);
                        if (zanejs.inRange(d, 0xDC00, 0xDFFF)) {
                            var a = c & 0x3FF;
                            var b = d & 0x3FF;
                            i += 1;
                            cps.push(0x10000 + (a << 10) + b);
                        }
                        else {
                            cps.push(0xFFFD);
                        }
                    }
                }
                i += 1;
            }
            return cps;
        };
        return ByteArray;
    }());
    zanejs.ByteArray = ByteArray;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var Endian = (function () {
        function Endian() {
        }
        Endian.LITTLE_ENDIAN = 'littleEndian';
        Endian.BIG_ENDIAN = 'bigEndian';
        return Endian;
    }());
    zanejs.Endian = Endian;
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
    function array_chunk(input, size, preserveKeys) {
        if (preserveKeys === void 0) { preserveKeys = false; }
        var x;
        var p = '';
        var i = 0;
        var c = -1;
        var l = input.length || 0;
        var n = [];
        if (size < 1) {
            return null;
        }
        if (Object.prototype.toString.call(input) === '[object Array]') {
            if (preserveKeys) {
                while (i < l) {
                    (x = i % size)
                        ? n[c][i] = input[i]
                        : n[++c] = {};
                    n[c][i] = input[i];
                    i++;
                }
            }
            else {
                while (i < l) {
                    (x = i % size)
                        ? n[c][x] = input[i]
                        : n[++c] = [input[i]];
                    i++;
                }
            }
        }
        else {
            if (preserveKeys) {
                for (p in input) {
                    if (input.hasOwnProperty(p)) {
                        (x = i % size)
                            ? n[c][p] = input[p]
                            : n[++c] = {};
                        n[c][p] = input[p];
                        i++;
                    }
                }
            }
            else {
                for (p in input) {
                    if (input.hasOwnProperty(p)) {
                        (x = i % size)
                            ? n[c][x] = input[p]
                            : n[++c] = [input[p]];
                        i++;
                    }
                }
            }
        }
        return n;
    }
    zanejs.array_chunk = array_chunk;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function array_combine(keys, values) {
        var newArray = {};
        if (typeof keys !== 'object') {
            return false;
        }
        if (typeof values !== 'object') {
            return false;
        }
        if (typeof keys.length !== 'number') {
            return false;
        }
        if (typeof values.length !== 'number') {
            return false;
        }
        if (!keys.length) {
            return false;
        }
        if (keys.length !== values.length) {
            return false;
        }
        for (var i = 0; i < keys.length; i++) {
            newArray[keys[i]] = values[i];
        }
        return newArray;
    }
    zanejs.array_combine = array_combine;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function array_count_values(array) {
        var tmpArr = {};
        var key = '';
        var _getType = function (obj) {
            var _t = typeof obj;
            _t = _t.toLowerCase();
            if (_t === 'object') {
                _t = 'array';
            }
            return _t;
        };
        var _countValue = function (_tmpArr, value) {
            if (typeof value === 'number') {
                if (Math.floor(value) !== value) {
                    return;
                }
            }
            else if (typeof value !== 'string') {
                return;
            }
            if (value in _tmpArr && _tmpArr.hasOwnProperty(value)) {
                ++_tmpArr[value];
            }
            else {
                _tmpArr[value] = 1;
            }
        };
        var t = _getType(array);
        if (t === 'array') {
            for (key in array) {
                if (array.hasOwnProperty(key)) {
                    _countValue.call(this, tmpArr, array[key]);
                }
            }
        }
        return tmpArr;
    }
    zanejs.array_count_values = array_count_values;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function array_diff() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var retArr = {};
        var arr1 = args[0];
        var argLen = args.length;
        var arr = {};
        function arr1keys() {
            Object.keys(arr1).map(function (k1) {
                for (var i = 1; i < argLen; i++) {
                    arr = args[i];
                    for (var k in arr) {
                        if (arr[k] === arr1[k1]) {
                            arr1keys();
                        }
                    }
                    retArr[k1] = arr1[k1];
                }
            });
        }
        arr1keys();
        return retArr;
    }
    zanejs.array_diff = array_diff;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function array_diff_assoc() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var retArr = {};
        var arr1 = args[0];
        var argl = args.length;
        var i = 1;
        var k = '';
        var arr = {};
        function arr1keys() {
            Object.keys(arr1).map(function (k1) {
                for (i = 1; i < argl; i++) {
                    arr = args[i];
                    for (k in arr) {
                        if (arr[k] === arr1[k1] && k === k1) {
                            arr1keys();
                        }
                    }
                    retArr[k1] = arr1[k1];
                }
            });
        }
        arr1keys();
        return retArr;
    }
    zanejs.array_diff_assoc = array_diff_assoc;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function array_diff_key() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var arr1 = args[0];
        var argl = args.length;
        var retArr = {};
        var arr = {};
        function arr1keys() {
            Object.keys(arr1).map(function (k1) {
                for (var i = 1; i < argl; i++) {
                    arr = args[i];
                    for (var k in arr) {
                        if (k === k1) {
                            arr1keys();
                        }
                    }
                    retArr[k1] = arr1[k1];
                }
            });
        }
        arr1keys();
        return retArr;
    }
    zanejs.array_diff_key = array_diff_key;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function array_diff_uassoc() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var retArr = {};
        var arr1 = args[0];
        var arglm1 = args.length - 1;
        var cb = args[arglm1];
        var arr = {};
        cb = (typeof cb === 'string')
            ? window[cb]
            : (Object.prototype.toString.call(cb) === '[object Array]')
                ? window[cb[0]][cb[1]]
                : cb;
        function arr1keys() {
            Object.keys(arr1).map(function (k1) {
                for (var i = 1; i < arglm1; i++) {
                    arr = args[i];
                    for (var k in arr) {
                        if (arr[k] === arr1[k1] && cb(k, k1) === 0) {
                            arr1keys();
                        }
                    }
                    retArr[k1] = arr1[k1];
                }
            });
        }
        arr1keys();
        return retArr;
    }
    zanejs.array_diff_uassoc = array_diff_uassoc;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function array_diff_ukey() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var retArr = {};
        var arr1 = args[0];
        var arglm1 = args.length - 1;
        var cb = args[arglm1];
        var arr = {};
        cb = (typeof cb === 'string')
            ? window[cb]
            : (Object.prototype.toString.call(cb) === '[object Array]')
                ? window[cb[0]][cb[1]]
                : cb;
        function arr1keys() {
            Object.keys(arr1).map(function (k1) {
                for (var i = 1; i < arglm1; i++) {
                    arr = args[i];
                    for (var k in arr) {
                        if (cb(k, k1) === 0) {
                            arr1keys();
                        }
                    }
                    retArr[k1] = arr1[k1];
                }
            });
        }
        arr1keys();
        return retArr;
    }
    zanejs.array_diff_ukey = array_diff_ukey;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function array_fill(startIndex, num, mixedVal) {
        var key;
        var tmpArr = {};
        if (!isNaN(startIndex) && !isNaN(num)) {
            for (key = 0; key < num; key++) {
                tmpArr[(key + startIndex)] = mixedVal;
            }
        }
        return tmpArr;
    }
    zanejs.array_fill = array_fill;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function array_fill_keys(keys, value) {
        var retObj = {};
        Object.keys(keys).map(function (key) {
            retObj[keys[key]] = value;
        });
        return retObj;
    }
    zanejs.array_fill_keys = array_fill_keys;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function array_filter(arr, func) {
        var retObj = {};
        var k;
        func = func || function (v) {
            return v;
        };
        if (Object.prototype.toString.call(arr) === '[object Array]') {
            retObj = [];
        }
        for (k in arr) {
            if (func(arr[k])) {
                retObj[k] = arr[k];
            }
        }
        return retObj;
    }
    zanejs.array_filter = array_filter;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function array_flip(trans) {
        var key;
        var tmpArr = {};
        for (key in trans) {
            if (!trans.hasOwnProperty(key)) {
                continue;
            }
            tmpArr[trans[key]] = key;
        }
        return tmpArr;
    }
    zanejs.array_flip = array_flip;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function array_intersect() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var retArr = {};
        var arr1 = args[0];
        var argl = args.length;
        var arglm1 = argl - 1;
        function arr1keys() {
            Object.keys(arr1).map(function (k1) {
                function arrs() {
                    for (var i = 1; i < argl; i++) {
                        var arr = arguments[i];
                        for (var k in arr) {
                            if (arr[k] === arr1[k1]) {
                                if (i === arglm1) {
                                    retArr[k1] = arr1[k1];
                                }
                                arrs();
                            }
                        }
                        arr1keys();
                    }
                }
                arrs();
            });
        }
        arr1keys();
        return retArr;
    }
    zanejs.array_intersect = array_intersect;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function array_intersect_assoc() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var retArr = {};
        var arr1 = args[0];
        var argl = args.length;
        var arglm1 = argl - 1;
        function arr1keys() {
            Object.keys(arr1).map(function (k1) {
                function arrs() {
                    for (var i = 1; i < argl; i++) {
                        var arr = args[i];
                        for (var k in arr) {
                            if (arr[k] === arr1[k1] && k === k1) {
                                if (i === arglm1) {
                                    retArr[k1] = arr1[k1];
                                }
                                arrs();
                            }
                        }
                        arr1keys();
                    }
                }
                arrs();
            });
        }
        arr1keys();
        return retArr;
    }
    zanejs.array_intersect_assoc = array_intersect_assoc;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function array_merge() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var argl = args.length;
        var arg;
        var retObj = {};
        var k = '';
        var argil = 0;
        var j = 0;
        var i = 0;
        var ct = 0;
        var toStr = Object.prototype.toString;
        var retArr = true;
        for (i = 0; i < argl; i++) {
            if (toStr.call(args[i]) !== '[object Array]') {
                retArr = false;
                break;
            }
        }
        if (retArr) {
            retArr = [];
            for (i = 0; i < argl; i++) {
                retArr = Array(retArr).concat(args[i]);
            }
            return retArr;
        }
        for (i = 0, ct = 0; i < argl; i++) {
            arg = args[i];
            if (toStr.call(arg) === '[object Array]') {
                for (j = 0, argil = arg.length; j < argil; j++) {
                    retObj[ct++] = arg[j];
                }
            }
            else {
                for (k in arg) {
                    if (arg.hasOwnProperty(k)) {
                        if (parseInt(k, 10) + '' === k) {
                            retObj[ct++] = arg[k];
                        }
                        else {
                            retObj[k] = arg[k];
                        }
                    }
                }
            }
        }
        return retObj;
    }
    zanejs.array_merge = array_merge;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function array_unique(inputArr) {
        var tmpArr2 = {};
        var _arraySearch = function (needle, haystack) {
            var keys = Object.keys(haystack);
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                if ((haystack[key] + '') === (needle + '')) {
                    return key;
                }
            }
            return false;
        };
        Object.keys(inputArr).map(function (key) {
            var val = inputArr[key];
            if (_arraySearch(val, tmpArr2) === false) {
                tmpArr2[key] = val;
            }
        });
        return tmpArr2;
    }
    zanejs.array_unique = array_unique;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function array_values(input) {
        var tmpArr = [];
        Object.keys(input).map(function (key) {
            tmpArr[tmpArr.length] = input[key];
        });
        return tmpArr;
    }
    zanejs.array_values = array_values;
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
    function getRandomArrayElements(arr, count) {
        var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(min);
    }
    zanejs.getRandomArrayElements = getRandomArrayElements;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function indexByObjectValue(arr, attribute, value) {
        for (var i = 0, l = arr.length; i < l; ++i) {
            var o = arr[i];
            if (o[attribute] === value) {
                return i;
            }
        }
        return -1;
    }
    zanejs.indexByObjectValue = indexByObjectValue;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function is_array(input) {
        return typeof (input) === 'object' && (input instanceof Array);
    }
    zanejs.is_array = is_array;
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
    function arrayBufferToString(buffer) {
        return zanejs.binaryToString(String.fromCharCode.apply(null, Array.prototype.slice.apply(new Uint8Array(buffer))));
    }
    zanejs.arrayBufferToString = arrayBufferToString;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function binaryToString(binary) {
        var error;
        try {
            return decodeURIComponent(escape(binary));
        }
        catch (_error) {
            error = _error;
            if (error instanceof URIError) {
                return binary;
            }
            else {
                throw error;
            }
        }
    }
    zanejs.binaryToString = binaryToString;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function stringToArrayBuffer(str) {
        return zanejs.stringToUint8Array(str).buffer;
    }
    zanejs.stringToArrayBuffer = stringToArrayBuffer;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function stringToBinary(str) {
        var chars, code, i, isUCS2, len, _i;
        len = str.length;
        chars = [];
        isUCS2 = false;
        for (i = _i = 0; 0 <= len ? _i < len : _i > len; i = 0 <= len ? ++_i : --_i) {
            code = String.prototype.charCodeAt.call(str, i);
            if (code > 255) {
                isUCS2 = true;
                chars = null;
                break;
            }
            else {
                chars.push(code);
            }
        }
        if (isUCS2 === true) {
            return unescape(encodeURIComponent(str));
        }
        else {
            return String.fromCharCode.apply(null, Array.prototype.slice.apply(chars));
        }
    }
    zanejs.stringToBinary = stringToBinary;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function stringToUint8Array(str) {
        var binary, binLen, buffer, chars, i, _i;
        binary = zanejs.stringToBinary(str);
        binLen = binary.length;
        buffer = new ArrayBuffer(binLen);
        chars = new Uint8Array(buffer);
        for (i = _i = 0; 0 <= binLen ? _i < binLen : _i > binLen; i = 0 <= binLen ? ++_i : --_i) {
            chars[i] = String.prototype.charCodeAt.call(binary, i);
        }
        return chars;
    }
    zanejs.stringToUint8Array = stringToUint8Array;
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
    function lightenDarkenColor(col, amt) {
        var usePound = false;
        if (col[0] === '#') {
            col = col.slice(1);
            usePound = true;
        }
        var num = parseInt(col, 16);
        var r = (num >> 16) + amt;
        if (r > 255) {
            r = 255;
        }
        else if (r < 0) {
            r = 0;
        }
        var b = ((num >> 8) & 0x00FF) + amt;
        if (b > 255) {
            b = 255;
        }
        else if (b < 0) {
            b = 0;
        }
        var g = (num & 0x0000FF) + amt;
        if (g > 255) {
            g = 255;
        }
        else if (g < 0) {
            g = 0;
        }
        return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
    }
    zanejs.lightenDarkenColor = lightenDarkenColor;
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
    function deleteCookie(name) {
        zanejs.setCookie(name, '', -1);
    }
    zanejs.deleteCookie = deleteCookie;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function getCookie(name) {
        name = name + '=';
        var carray = document.cookie.split(';');
        for (var i = 0; i < carray.length; i++) {
            var c = carray[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    }
    zanejs.getCookie = getCookie;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function setCookie(name, value, seconds) {
        var expires;
        if (typeof (seconds) !== 'undefined') {
            var date_1 = new Date();
            date_1.setTime(date_1.getTime() + (seconds * 1000));
            expires = '; expires=' + date_1.toUTCString();
        }
        else {
            expires = '';
        }
        document.cookie = name + '=' + value + expires + '; path=/';
    }
    zanejs.setCookie = setCookie;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function checkdate(m, d, y) {
        return m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0))
            .getDate();
    }
    zanejs.checkdate = checkdate;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function date(format, timestamp) {
        var jsdate, f;
        var txtWords = [
            'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        var formatChr = /\\?(.?)/gi;
        var formatChrCb = function (t, s) {
            return f[t] ? f[t]() : s;
        };
        var _pad = function (n, c) {
            n = String(n);
            while (n.length < c) {
                n = '0' + n;
            }
            return n;
        };
        f = {
            d: function () {
                return _pad(f.j(), 2);
            },
            D: function () {
                return f.l()
                    .slice(0, 3);
            },
            j: function () {
                return jsdate.getDate();
            },
            l: function () {
                return txtWords[f.w()] + 'day';
            },
            N: function () {
                return f.w() || 7;
            },
            S: function () {
                var j = f.j();
                var i = j % 10;
                if (i <= 3 && parseInt(((j % 100) / 10) + '', 10) === 1) {
                    i = 0;
                }
                return ['st', 'nd', 'rd'][i - 1] || 'th';
            },
            w: function () {
                return jsdate.getDay();
            },
            z: function () {
                var a = new Date(f.Y(), f.n() - 1, f.j());
                var b = new Date(f.Y(), 0, 1);
                return Math.round((a - b) / 864e5);
            },
            W: function () {
                var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
                var b = new Date(a.getFullYear(), 0, 4);
                return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
            },
            F: function () {
                return txtWords[6 + f.n()];
            },
            m: function () {
                return _pad(f.n(), 2);
            },
            M: function () {
                return f.F()
                    .slice(0, 3);
            },
            n: function () {
                return jsdate.getMonth() + 1;
            },
            t: function () {
                return (new Date(f.Y(), f.n(), 0))
                    .getDate();
            },
            L: function () {
                var j = f.Y();
                return (j % 4 === 0) && (j % 100 !== 0) || (j % 400 === 0);
            },
            o: function () {
                var n = f.n();
                var W = f.W();
                var Y = f.Y();
                return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
            },
            Y: function () {
                return jsdate.getFullYear();
            },
            y: function () {
                return f.Y()
                    .toString()
                    .slice(-2);
            },
            a: function () {
                return jsdate.getHours() > 11 ? 'pm' : 'am';
            },
            A: function () {
                return f.a()
                    .toUpperCase();
            },
            B: function () {
                var H = jsdate.getUTCHours() * 36e2;
                var i = jsdate.getUTCMinutes() * 60;
                var s = jsdate.getUTCSeconds();
                return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
            },
            g: function () {
                return f.G() % 12 || 12;
            },
            G: function () {
                return jsdate.getHours();
            },
            h: function () {
                return _pad(f.g(), 2);
            },
            H: function () {
                return _pad(f.G(), 2);
            },
            i: function () {
                return _pad(jsdate.getMinutes(), 2);
            },
            s: function () {
                return _pad(jsdate.getSeconds(), 2);
            },
            u: function () {
                return _pad(jsdate.getMilliseconds() * 1000, 6);
            },
            e: function () {
                var msg = 'Not supported (see source code of date() for timezone on how to add support)';
                throw new Error(msg);
            },
            I: function () {
                var a = new Date(f.Y(), 0);
                var c = Date.UTC(f.Y(), 0);
                var b = new Date(f.Y(), 6);
                var d = Date.UTC(f.Y(), 6);
                return ((a - c) !== (b - d)) ? 1 : 0;
            },
            O: function () {
                var tzo = jsdate.getTimezoneOffset();
                var a = Math.abs(tzo);
                return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
            },
            P: function () {
                var O = f.O();
                return (O.substr(0, 3) + ':' + O.substr(3, 2));
            },
            T: function () {
                return 'UTC';
            },
            Z: function () {
                return -jsdate.getTimezoneOffset() * 60;
            },
            c: function () {
                return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
            },
            r: function () {
                return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
            },
            U: function () {
                return Math.floor(jsdate / 1000);
            }
        };
        var _date = function (_format, _timestamp) {
            jsdate = (_timestamp === undefined ? new Date()
                : (_timestamp instanceof Date) ? new Date(_timestamp + '')
                    : new Date(_timestamp * 1000 + ''));
            return _format.replace(formatChr, formatChrCb);
        };
        return _date(format, timestamp);
    }
    zanejs.date = date;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function getdate(timestamp) {
        if (timestamp === void 0) { timestamp = undefined; }
        var _w = ['Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur'];
        var _m = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        var d = ((typeof timestamp === 'undefined') ? new Date()
            : (timestamp instanceof Date) ? new Date(timestamp + '')
                : new Date(timestamp * 1000 + ''));
        var w = d.getDay();
        var m = d.getMonth();
        var y = d.getFullYear();
        var d1 = new Date(y, 0, 1);
        var r = {};
        r.seconds = d.getSeconds();
        r.minutes = d.getMinutes();
        r.hours = d.getHours();
        r.mday = d.getDate();
        r.wday = w;
        r.mon = m + 1;
        r.year = y;
        r.yday = Math.floor((d - d1) / 86400000);
        r.weekday = _w[w] + 'day';
        r.month = _m[m];
        r['0'] = parseInt((d.getTime() / 1000) + '', 10);
        return r;
    }
    zanejs.getdate = getdate;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function gettimeofday(returnFloat) {
        if (returnFloat === void 0) { returnFloat = false; }
        var t = new Date();
        if (returnFloat) {
            return t.getTime() / 1000;
        }
        var y = t.getFullYear();
        var d1 = new Date(y, 0);
        var d2 = Date.UTC(y, 0);
        var d3 = new Date(y, 6);
        var d4 = Date.UTC(y, 6);
        return {
            sec: t.getUTCSeconds(),
            usec: t.getUTCMilliseconds() * 1000,
            minuteswest: t.getTimezoneOffset(),
            dsttime: d1 - d2 !== d3 - d4
        };
    }
    zanejs.gettimeofday = gettimeofday;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function gmdate(format, timestamp) {
        var dt = typeof timestamp === 'undefined' ? new Date()
            : timestamp instanceof Date ? new Date(timestamp + '')
                : new Date(timestamp * 1000 + '');
        timestamp = Date.parse(dt.toUTCString().slice(0, -4)) / 1000;
        return zanejs.date(format, timestamp);
    }
    zanejs.gmdate = gmdate;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function gmmktime() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var d = new Date();
        var e = ['Hours', 'Minutes', 'Seconds', 'Month', 'Date', 'FullYear'];
        for (var i = 0; i < e.length; i++) {
            if (typeof args[i] === 'undefined') {
                args[i] = d['getUTC' + e[i]]();
                args[i] += (i === 3);
            }
            else {
                args[i] = parseInt(args[i], 10);
                if (isNaN(args[i])) {
                    return false;
                }
            }
        }
        args[5] += (args[5] >= 0 ? (args[5] <= 69 ? 2e3 : (args[5] <= 100 ? 1900 : 0)) : 0);
        d.setUTCFullYear(args[5], args[3] - 1, args[4]);
        d.setUTCHours(args[0], args[1], args[2]);
        var _time = d.getTime();
        return Math.floor(_time / 1e3) - (_time < 0 ? 1 : 0);
    }
    zanejs.gmmktime = gmmktime;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function idate(format, timestamp) {
        if (format === undefined) {
            throw new Error('idate() expects at least 1 parameter, 0 given');
        }
        if (!format.length || format.length > 1) {
            throw new Error('idate format is one char');
        }
        var _date = (typeof timestamp === 'undefined')
            ? new Date()
            : (timestamp instanceof Date)
                ? new Date(timestamp + '')
                : new Date(timestamp * 1000 + '');
        var a, d;
        switch (format) {
            case 'B':
                return Math.floor(((_date.getUTCHours() * 36e2) +
                    (_date.getUTCMinutes() * 60) +
                    _date.getUTCSeconds() + 36e2) / 86.4) % 1e3;
            case 'd':
                return _date.getDate();
            case 'h':
                return _date.getHours() % 12 || 12;
            case 'H':
                return _date.getHours();
            case 'i':
                return _date.getMinutes();
            case 'I':
                a = _date.getFullYear();
                var d01 = new Date(a, 0);
                var d02 = Date.UTC(a, 0);
                var d61 = new Date(a, 6);
                var d62 = Date.UTC(a, 6);
                return d01 - d02 !== d61 - d62;
            case 'L':
                a = _date.getFullYear();
                return (!(a & 3) && (a % 1e2 || !(a % 4e2))) ? 1 : 0;
            case 'm':
                return _date.getMonth() + 1;
            case 's':
                return _date.getSeconds();
            case 't':
                return (new Date(_date.getFullYear(), _date.getMonth() + 1, 0))
                    .getDate();
            case 'U':
                return Math.round(_date.getTime() / 1000);
            case 'w':
                return _date.getDay();
            case 'W':
                a = new Date(_date.getFullYear(), _date.getMonth(), _date.getDate() - (_date.getDay() || 7) + 3);
                d = new Date(a.getFullYear(), 0, 4);
                return 1 + Math.round((a - d) / 864e5 / 7);
            case 'y':
                return parseInt((_date.getFullYear() + '').slice(2), 10);
            case 'Y':
                return _date.getFullYear();
            case 'z':
                d = new Date(_date.getFullYear(), 0, 1);
                return Math.floor((_date - d) / 864e5);
            case 'Z':
                return -_date.getTimezoneOffset() * 60;
            default:
                throw new Error('Unrecognized _date format token');
        }
    }
    zanejs.idate = idate;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function microtime(getAsFloat) {
        var s;
        var now;
        if (typeof performance !== 'undefined' && performance.now) {
            now = (performance.now() + performance.timing.navigationStart) / 1e3;
            if (getAsFloat) {
                return now;
            }
            s = now | 0;
            return (Math.round((now - s) * 1e6) / 1e6) + ' ' + s;
        }
        else {
            now = (Date.now ? Date.now() : new Date().getTime()) / 1e3;
            if (getAsFloat) {
                return now;
            }
            s = now | 0;
            return (Math.round((now - s) * 1e3) / 1e3) + ' ' + s;
        }
    }
    zanejs.microtime = microtime;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function mktime() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var d = new Date();
        var r = arguments;
        var e = ['Hours', 'Minutes', 'Seconds', 'Month', 'Date', 'FullYear'];
        for (var i = 0; i < e.length; i++) {
            if (typeof r[i] === 'undefined') {
                r[i] = d['get' + e[i]]();
                r[i] += (i === 3);
            }
            else {
                r[i] = parseInt(r[i], 10);
                if (isNaN(r[i])) {
                    return false;
                }
            }
        }
        r[5] += (r[5] >= 0 ? (r[5] <= 69 ? 2e3 : (r[5] <= 100 ? 1900 : 0)) : 0);
        d.setFullYear(r[5], r[3] - 1, r[4]);
        d.setHours(r[0], r[1], r[2]);
        var _time = d.getTime();
        return Math.floor(_time / 1e3) - (_time < 0 ? 1 : 0);
    }
    zanejs.mktime = mktime;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function strtotime(text, now) {
        var parsed, match, today;
        var year, $date, days, ranges, len, times, regex, d;
        var i;
        var fail = false;
        if (!text) {
            return fail;
        }
        text = text
            .replace(/^\s+|\s+$/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/[\t\r\n]/g, '')
            .toLowerCase();
        var pattern = new RegExp([
            '^(\\d{1,4})',
            '([\\-\\.\\/:])',
            '(\\d{1,2})',
            '([\\-\\.\\/:])',
            '(\\d{1,4})',
            '(?:\\s(\\d{1,2}):(\\d{2})?:?(\\d{2})?)?',
            '(?:\\s([A-Z]+)?)?$'
        ].join(''));
        match = text.match(pattern);
        if (match && match[2] === match[4]) {
            if (match[1] > 1901) {
                switch (match[2]) {
                    case '-':
                        if (match[3] > 12 || match[5] > 31) {
                            return fail;
                        }
                        d = new Date(match[1], parseInt(match[3], 10) - 1, match[5], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0);
                        return d / 1000;
                    case '.':
                        return fail;
                    case '/':
                        if (match[3] > 12 || match[5] > 31) {
                            return fail;
                        }
                        d = new Date(match[1], parseInt(match[3], 10) - 1, match[5], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0);
                        return d / 1000;
                    default:
                        return fail;
                }
            }
            else if (match[5] > 1901) {
                switch (match[2]) {
                    case '-':
                        if (match[3] > 12 || match[1] > 31) {
                            return fail;
                        }
                        d = new Date(match[5], parseInt(match[3], 10) - 1, match[1], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0);
                        return d / 1000;
                    case '.':
                        if (match[3] > 12 || match[1] > 31) {
                            return fail;
                        }
                        d = new Date(match[5], parseInt(match[3], 10) - 1, match[1], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0);
                        return d / 1000;
                    case '/':
                        if (match[1] > 12 || match[3] > 31) {
                            return fail;
                        }
                        d = new Date(match[5], parseInt(match[1], 10) - 1, match[3], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0);
                        return d / 1000;
                    default:
                        return fail;
                }
            }
            else {
                switch (match[2]) {
                    case '-':
                        if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
                            return fail;
                        }
                        year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
                        d = new Date(year, parseInt(match[3], 10) - 1, match[5], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0);
                        return d / 1000;
                    case '.':
                        if (match[5] >= 70) {
                            if (match[3] > 12 || match[1] > 31) {
                                return fail;
                            }
                            d = new Date(match[5], parseInt(match[3], 10) - 1, match[1], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0);
                            return d / 1000;
                        }
                        if (match[5] < 60 && !match[6]) {
                            if (match[1] > 23 || match[3] > 59) {
                                return fail;
                            }
                            today = new Date();
                            d = new Date(today.getFullYear(), today.getMonth(), today.getDate(), match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0);
                            return d / 1000;
                        }
                        return fail;
                    case '/':
                        if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
                            return fail;
                        }
                        year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
                        d = new Date(year, parseInt(match[1], 10) - 1, match[3], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0);
                        return d / 1000;
                    case ':':
                        if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
                            return fail;
                        }
                        today = new Date();
                        d = new Date(today.getFullYear(), today.getMonth(), today.getDate(), match[1] || 0, match[3] || 0, match[5] || 0);
                        return d / 1000;
                    default:
                        return fail;
                }
            }
        }
        if (text === 'now') {
            return now === null || isNaN(now)
                ? new Date().getTime() / 1000 | 0
                : now | 0;
        }
        if (!isNaN(parsed = Date.parse(text))) {
            return parsed / 1000 | 0;
        }
        pattern = new RegExp([
            '^([0-9]{4}-[0-9]{2}-[0-9]{2})',
            '[ t]',
            '([0-9]{2}:[0-9]{2}:[0-9]{2}(\\.[0-9]+)?)',
            '([\\+-][0-9]{2}(:[0-9]{2})?|z)'
        ].join(''));
        match = text.match(pattern);
        if (match) {
            if (match[4] === 'z') {
                match[4] = 'Z';
            }
            else if (match[4].match(/^([\+-][0-9]{2})$/)) {
                match[4] = match[4] + ':00';
            }
            if (!isNaN(parsed = $date.parse(match[1] + 'T' + match[2] + match[4]))) {
                return parsed / 1000 | 0;
            }
        }
        $date = now ? new Date(now * 1000) : new Date();
        days = {
            'sun': 0,
            'mon': 1,
            'tue': 2,
            'wed': 3,
            'thu': 4,
            'fri': 5,
            'sat': 6
        };
        ranges = {
            'yea': 'FullYear',
            'mon': 'Month',
            'day': 'Date',
            'hou': 'Hours',
            'min': 'Minutes',
            'sec': 'Seconds'
        };
        function lastNext(type, range, modifier) {
            var diff;
            var day = days[range];
            if (typeof day !== 'undefined') {
                diff = day - $date.getDay();
                if (diff === 0) {
                    diff = 7 * modifier;
                }
                else if (diff > 0 && type === 'last') {
                    diff -= 7;
                }
                else if (diff < 0 && type === 'next') {
                    diff += 7;
                }
                $date.setDate($date.getDate() + diff);
            }
        }
        function process(val) {
            var splt = val.split(' ');
            var type = splt[0];
            var range = splt[1].substring(0, 3);
            var typeIsNumber = /\d+/.test(type);
            var ago = splt[2] === 'ago';
            var num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);
            if (typeIsNumber) {
                num *= parseInt(type, 10);
            }
            if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
                return $date['set' + ranges[range]]($date['get' + ranges[range]]() + num);
            }
            if (range === 'wee') {
                return $date.setDate($date.getDate() + (num * 7));
            }
            if (type === 'next' || type === 'last') {
                lastNext(type, range, num);
            }
            else if (!typeIsNumber) {
                return false;
            }
            return true;
        }
        times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
            '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
            '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
        regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';
        match = text.match(new RegExp(regex, 'gi'));
        if (!match) {
            return fail;
        }
        for (i = 0, len = match.length; i < len; i++) {
            if (!process(match[i])) {
                return fail;
            }
        }
        return ($date.getTime() / 1000);
    }
    zanejs.strtotime = strtotime;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function time() {
        return Math.floor(new Date().getTime() / 1000);
    }
    zanejs.time = time;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function basename(path, suffix) {
        if (suffix === void 0) { suffix = null; }
        var b = path;
        var lastChar = b.charAt(b.length - 1);
        if (lastChar === '/' || lastChar === '\\') {
            b = b.slice(0, -1);
        }
        b = b.replace(/^.*[\/\\]/g, '');
        if (typeof suffix === 'string' && b.substr(b.length - suffix.length) === suffix) {
            b = b.substr(0, b.length - suffix.length);
        }
        return b;
    }
    zanejs.basename = basename;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function dirname(path) {
        return path.replace(/\\/g, '/')
            .replace(/\/[^\/]*\/?$/, '');
    }
    zanejs.dirname = dirname;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function getExtension(filePath) {
        return filePath.split('.').pop();
    }
    zanejs.getExtension = getExtension;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function getFileNameFromUrl(url) {
        if (url) {
            return url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
        }
        return '';
    }
    zanejs.getFileNameFromUrl = getFileNameFromUrl;
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
    function addLeadingZeroes(n, zeroes) {
        if (zeroes === void 0) { zeroes = 1; }
        var out = n + '';
        if (n < 0 || zeroes < 1) {
            return out;
        }
        while (out.length < zeroes + 1) {
            out = '0' + out;
        }
        return out;
    }
    zanejs.addLeadingZeroes = addLeadingZeroes;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function clamp(val, min, max) {
        return Math.max(Math.min(val, max), min);
    }
    zanejs.clamp = clamp;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function createStepsBetween(begin, end, steps) {
        steps++;
        var i = 0;
        var stepsBetween = [];
        var increment = (end - begin) / steps;
        while (++i < steps) {
            stepsBetween.push((i * increment) + begin);
        }
        return stepsBetween;
    }
    zanejs.createStepsBetween = createStepsBetween;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function inRange(a, min, max) {
        return min <= a && a <= max;
    }
    zanejs.inRange = inRange;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function isBetween(value, firstValue, secondValue) {
        return !(value < Math.min(firstValue, secondValue) || value > Math.max(firstValue, secondValue));
    }
    zanejs.isBetween = isBetween;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function isEqual(val1, val2, precision) {
        if (precision === void 0) { precision = 0; }
        return Math.abs(val1 - val2) <= Math.abs(precision);
    }
    zanejs.isEqual = isEqual;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function isEven(value) {
        return (value & 1) === 0;
    }
    zanejs.isEven = isEven;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function isInteger(value) {
        return (value % 1) === 0;
    }
    zanejs.isInteger = isInteger;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function isNegative(value) {
        return !zanejs.isPositive(value);
    }
    zanejs.isNegative = isNegative;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function isOdd(value) {
        return !zanejs.isEven(value);
    }
    zanejs.isOdd = isOdd;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function isOne(value, tolerance) {
        if (tolerance === void 0) { tolerance = 0; }
        return (value + tolerance >= 1) && (value - tolerance <= 1);
    }
    zanejs.isOne = isOne;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function isPositive(value) {
        return value >= 0;
    }
    zanejs.isPositive = isPositive;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function isPowerOf2() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var result = true;
        for (var i = 0, l = args.length; i < l; ++i) {
            var num = args[i];
            if (num <= 0 || (num & (num - 1)) !== 0) {
                result = false;
                break;
            }
        }
        return result;
    }
    zanejs.isPowerOf2 = isPowerOf2;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function isPrime(value) {
        if (value === 1 || value === 2) {
            return true;
        }
        if (zanejs.isEven(value)) {
            return false;
        }
        var s = Math.sqrt(value);
        for (var i = 3; i <= s; i++) {
            if (value % i === 0) {
                return false;
            }
        }
        return true;
    }
    zanejs.isPrime = isPrime;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function isZero(value, tolerance) {
        if (tolerance === void 0) { tolerance = 0; }
        return (value < tolerance) && (value > -tolerance);
    }
    zanejs.isZero = isZero;
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
    function randomIntegerWithinRange(min, max) {
        return Math.round(zanejs.randomWithinRange(min, max));
    }
    zanejs.randomIntegerWithinRange = randomIntegerWithinRange;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function randomSign(chance) {
        if (chance === void 0) { chance = 0.5; }
        return (Math.random() < chance) ? 1 : -1;
    }
    zanejs.randomSign = randomSign;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function randomWithinRange(min, max) {
        if (min > max) {
            var temp = max;
            max = min;
            min = temp;
        }
        return min + (Math.random() * (max - min));
    }
    zanejs.randomWithinRange = randomWithinRange;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function round(value, digits) {
        digits = Math.pow(10, digits);
        return Math.round(value * digits) / digits;
    }
    zanejs.round = round;
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
    function assign(obj, params) {
        Object.keys(params).map(function (name) {
            obj[name] = params[name];
        });
        return obj;
    }
    zanejs.assign = assign;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function combine(defaultVars, additionalVars) {
        var combinedObject = {};
        Object.keys(defaultVars).map(function (key) {
            combinedObject[key] = defaultVars[key];
        });
        Object.keys(additionalVars).map(function (key) {
            combinedObject[key] = additionalVars[key];
        });
        return combinedObject;
    }
    zanejs.combine = combine;
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
    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
    zanejs.isArray = isArray;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function isBool(obj) {
        return obj === true || obj === false;
    }
    zanejs.isBool = isBool;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function isEmpty(val) {
        if (val) {
            return ((val === null) || val.length === 0 || /^\s+$/.test(val));
        }
        else {
            return true;
        }
    }
    zanejs.isEmpty = isEmpty;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function isFunction(obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
    }
    zanejs.isFunction = isFunction;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
    zanejs.isObject = isObject;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function isSpecial(obj) {
        var undef;
        return obj === undef || obj === null;
    }
    zanejs.isSpecial = isSpecial;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function isString(obj) {
        return Object.prototype.toString.call(obj) === '[object String]';
    }
    zanejs.isString = isString;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function isUndefined(obj) {
        return obj === void 0;
    }
    zanejs.isUndefined = isUndefined;
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
    function object_change_key_case(obj, cs) {
        if (cs === void 0) { cs = 'CASE_LOWER'; }
        var tmpArr = {};
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            return obj;
        }
        if (obj && typeof obj === 'object') {
            Object.keys(obj).map(function (key) {
                var _key = (!cs || cs === 'CASE_LOWER') ? key.toLowerCase() : key.toUpperCase();
                tmpArr[_key] = obj[key];
            });
            return tmpArr;
        }
        return false;
    }
    zanejs.object_change_key_case = object_change_key_case;
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
    var Random = (function () {
        function Random(seed) {
            this.seed = seed;
        }
        Random.prototype.next = function () {
            return this.nextSeed() * Random.MAX_RATIO;
        };
        Random.prototype.nextSeed = function () {
            this.seed ^= (this.seed << 21);
            this.seed ^= (this.seed >> 35);
            this.seed ^= (this.seed << 4);
            this.seed = (this.seed >>> 32);
            return this.seed;
        };
        Random.MAX_UINT = 0xFFFFFFFF;
        Random.MAX_RATIO = 1.0 / Random.MAX_UINT;
        return Random;
    }());
    zanejs.Random = Random;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function mt_rand(min, max) {
        var argc = arguments.length;
        if (argc === 0) {
            min = 0;
            max = 2147483647;
        }
        else if (argc === 1) {
            throw new Error('Warning: mt_rand() expects exactly 2 parameters, 1 given');
        }
        else {
            min = parseInt(String(min), 10);
            max = parseInt(String(max), 10);
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    zanejs.mt_rand = mt_rand;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function randomBoolean() {
        return zanejs.randomChance(0.5);
    }
    zanejs.randomBoolean = randomBoolean;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function randomChance(percent) {
        return Math.random() < percent;
    }
    zanejs.randomChance = randomChance;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function randomCharacters(amount, charSet) {
        if (charSet === void 0) { charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; }
        var alphabet = charSet.split('');
        var alphabetLength = alphabet.length;
        var randomLetters = '';
        for (var j = 0; j < amount; j++) {
            var r = Math.random() * alphabetLength;
            var s = Math.floor(r);
            randomLetters += alphabet[s];
        }
        return randomLetters;
    }
    zanejs.randomCharacters = randomCharacters;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function randomLowercaseCharacters(amount) {
        var str = '';
        for (var i = 0; i < amount; i++) {
            str += String.fromCharCode(Math.round(Math.random() * (122 - 97)) + 97);
        }
        return str;
    }
    zanejs.randomLowercaseCharacters = randomLowercaseCharacters;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function randomNumberString(amount) {
        var str = '';
        for (var i = 0; i < amount; i++) {
            str += String.fromCharCode(Math.round(Math.random() * (57 - 48)) + 48);
        }
        return str;
    }
    zanejs.randomNumberString = randomNumberString;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function randomSpecialCharacters(amount) {
        var str = '';
        for (var i = 0; i < amount; i++) {
            str += String.fromCharCode(Math.round(Math.random() * (64 - 33)) + 33);
        }
        return str;
    }
    zanejs.randomSpecialCharacters = randomSpecialCharacters;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function randomToken() {
        return Math.random().toString(36).substr(2);
    }
    zanejs.randomToken = randomToken;
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
        var s = value + '';
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
        var s = value + '';
        while (s.length < length) {
            s += padChar;
        }
        return s;
    }
    zanejs.padRight = padRight;
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
    var re = {
        not_string: /[^s]/,
        not_bool: /[^t]/,
        not_type: /[^T]/,
        not_primitive: /[^v]/,
        number: /[diefg]/,
        numeric_arg: /[bcdiefguxX]/,
        json: /[j]/,
        not_json: /[^j]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[\+\-]/
    };
    var sprintfCache = {};
    function sprintfParse(fmt) {
        if (sprintfCache[fmt]) {
            return sprintfCache[fmt];
        }
        var _fmt = fmt, match, parseTree = [], argNames = 0;
        while (_fmt) {
            if ((match = re.text.exec(_fmt)) !== null) {
                parseTree.push(match[0]);
            }
            else if ((match = re.modulo.exec(_fmt)) !== null) {
                parseTree.push('%');
            }
            else if ((match = re.placeholder.exec(_fmt)) !== null) {
                if (match[2]) {
                    argNames |= 1;
                    var fieldList = [], replacementField = match[2], fieldMatch = [];
                    if ((fieldMatch = re.key.exec(replacementField)) !== null) {
                        fieldList.push(fieldMatch[1]);
                        while ((replacementField = replacementField.substring(fieldMatch[0].length)) !== '') {
                            if ((fieldMatch = re.key_access.exec(replacementField)) !== null) {
                                fieldList.push(fieldMatch[1]);
                            }
                            else if ((fieldMatch = re.index_access.exec(replacementField)) !== null) {
                                fieldList.push(fieldMatch[1]);
                            }
                            else {
                                throw new SyntaxError('[sprintf] failed to parse named argument key');
                            }
                        }
                    }
                    else {
                        throw new SyntaxError('[sprintf] failed to parse named argument key');
                    }
                    match[2] = fieldList;
                }
                else {
                    argNames |= 2;
                }
                if (argNames === 3) {
                    throw new Error('[sprintf] mixing positional and named placeholders is not (yet) supported');
                }
                parseTree.push({
                    placeholder: match[0],
                    param_no: match[1],
                    keys: match[2],
                    sign: match[3],
                    pad_char: match[4],
                    align: match[5],
                    width: match[6],
                    precision: match[7],
                    type: match[8]
                });
            }
            else {
                throw new SyntaxError('[sprintf] unexpected placeholder');
            }
            _fmt = _fmt.substring(match[0].length);
        }
        return sprintfCache[fmt] = parseTree;
    }
    function sprintfFormat(parseTree, argv) {
        var cursor = 0, treeLength = parseTree.length, arg, output = '', i, k, ph, pad, padCharacter, padLength, isPositive, sign;
        for (i = 0; i < treeLength; i++) {
            if (typeof parseTree[i] === 'string') {
                output += parseTree[i];
            }
            else if (typeof parseTree[i] === 'object') {
                ph = parseTree[i];
                if (ph.keys) {
                    arg = argv[cursor];
                    for (k = 0; k < ph.keys.length; k++) {
                        if (arg === undefined) {
                            throw new Error(sprintf('[sprintf] Cannot access property "%s" of undefined value "%s"', ph.keys[k], ph.keys[k - 1]));
                        }
                        arg = arg[ph.keys[k]];
                    }
                }
                else if (ph.param_no) {
                    arg = argv[ph.param_no];
                }
                else {
                    arg = argv[cursor++];
                }
                if (re.not_type.test(ph.type) &&
                    re.not_primitive.test(ph.type) &&
                    arg instanceof Function) {
                    arg = arg();
                }
                if (re.numeric_arg.test(ph.type) &&
                    (typeof arg !== 'number' && isNaN(arg))) {
                    throw new TypeError(sprintf('[sprintf] expecting number but found %T', arg));
                }
                if (re.number.test(ph.type)) {
                    isPositive = arg >= 0;
                }
                switch (ph.type) {
                    case 'b':
                        arg = parseInt(arg, 10).toString(2);
                        break;
                    case 'c':
                        arg = String.fromCharCode(parseInt(arg, 10));
                        break;
                    case 'd':
                    case 'i':
                        arg = parseInt(arg, 10);
                        break;
                    case 'j':
                        arg = JSON.stringify(arg, null, ph.width ? parseInt(ph.width, 10) : 0);
                        break;
                    case 'e':
                        arg = ph.precision
                            ? parseFloat(arg).toExponential(ph.precision)
                            : parseFloat(arg).toExponential();
                        break;
                    case 'f':
                        arg = ph.precision
                            ? parseFloat(arg).toFixed(ph.precision)
                            : parseFloat(arg);
                        break;
                    case 'g':
                        arg = ph.precision
                            ? String(Number(arg.toPrecision(ph.precision)))
                            : parseFloat(arg);
                        break;
                    case 'o':
                        arg = (parseInt(arg, 10) >>> 0).toString(8);
                        break;
                    case 's':
                        arg = String(arg);
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg);
                        break;
                    case 't':
                        arg = String(!!arg);
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg);
                        break;
                    case 'T':
                        arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase();
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg);
                        break;
                    case 'u':
                        arg = parseInt(arg, 10) >>> 0;
                        break;
                    case 'v':
                        arg = arg.valueOf();
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg);
                        break;
                    case 'x':
                        arg = (parseInt(arg, 10) >>> 0).toString(16);
                        break;
                    case 'X':
                        arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase();
                        break;
                    default:
                }
                if (re.json.test(ph.type)) {
                    output += arg;
                }
                else {
                    if (re.number.test(ph.type) && (!isPositive || ph.sign)) {
                        sign = isPositive ? '+' : '-';
                        arg = arg.toString().replace(re.sign, '');
                    }
                    else {
                        sign = '';
                    }
                    padCharacter = ph.pad_char ? ph.pad_char === '0' ? '0' : ph.pad_char.charAt(1) : ' ';
                    padLength = ph.width - (sign + arg).length;
                    pad = ph.width ? (padLength > 0 ? padCharacter.repeat(padLength) : '') : '';
                    output += ph.align
                        ? sign + arg + pad
                        : (padCharacter === '0'
                            ? sign + pad + arg
                            : pad + sign + arg);
                }
            }
        }
        return output;
    }
    function sprintf(fmt) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return sprintfFormat(sprintfParse(fmt), args);
    }
    zanejs.sprintf = sprintf;
    function vsprintf(fmt, argv) {
        return sprintf.apply(null, [fmt].concat(argv || []));
    }
    zanejs.vsprintf = vsprintf;
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
    function _isOldIOS() {
        var win = window;
        var ver = '' + (/CPU.*OS ([0-9_]{3,4})[0-9_]{0,1}|(CPU like).*AppleWebKit.*Mobile/i.exec(zanejs.ua)
            || [0, ''])[1];
        ver = ver
            .replace('undefined', '3_2')
            .replace('_', '.')
            .replace('_', '');
        return parseFloat(ver) < 10 && !win.MSStream;
    }
    zanejs.isOldIOS = _isOldIOS();
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    zanejs.emptyVideoData = '' +
        'data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC8wYF///v3EXpveb' +
        'ZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0MiByMjQ3OSBkZDc5YTYxIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIw' +
        'MDMtMjAxNCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTEgZGVibG9jaz0xO' +
        'jA6MCBhbmFseXNlPTB4MToweDExMSBtZT1oZXggc3VibWU9MiBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0wIG1lX3Jhbm' +
        'dlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MCA4eDhkY3Q9MCBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3F' +
        'wX29mZnNldD0wIHRocmVhZHM9NiBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVy' +
        'bGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfY' +
        'mlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MSBrZXlpbnQ9MzAwIGtleWludF9taW49MzAgc2NlbmVjdX' +
        'Q9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD0xMCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIwLjAgcWNvbXA9MC42MCBxcG1pbj0' +
        'wIHFwbWF4PTY5IHFwc3RlcD00IHZidl9tYXhyYXRlPTIwMDAwIHZidl9idWZzaXplPTI1MDAwIGNyZl9tYXg9MC4wIG5hbF9ocmQ9bm9u' +
        'ZSBmaWxsZXI9MCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAOWWIhAA3//p+C7v8tDDSTjf97w55i3SbRPO4ZY+hkjD5hbkAkL3zp' +
        'J6h/LR1CAABzgB1kqqzUorlhQAAAAxBmiQYhn/+qZYADLgAAAAJQZ5CQhX/AAj5IQADQGgcIQADQGgcAAAACQGeYUQn/wALKCEAA0BoHA' +
        'AAAAkBnmNEJ/8ACykhAANAaBwhAANAaBwAAAANQZpoNExDP/6plgAMuSEAA0BoHAAAAAtBnoZFESwr/wAI+SEAA0BoHCEAA0BoHAAAAAk' +
        'BnqVEJ/8ACykhAANAaBwAAAAJAZ6nRCf/AAsoIQADQGgcIQADQGgcAAAADUGarDRMQz/+qZYADLghAANAaBwAAAALQZ7KRRUsK/8ACPkh' +
        'AANAaBwAAAAJAZ7pRCf/AAsoIQADQGgcIQADQGgcAAAACQGe60Qn/wALKCEAA0BoHAAAAA1BmvA0TEM//qmWAAy5IQADQGgcIQADQGgcA' +
        'AAAC0GfDkUVLCv/AAj5IQADQGgcAAAACQGfLUQn/wALKSEAA0BoHCEAA0BoHAAAAAkBny9EJ/8ACyghAANAaBwAAAANQZs0NExDP/6plg' +
        'AMuCEAA0BoHAAAAAtBn1JFFSwr/wAI+SEAA0BoHCEAA0BoHAAAAAkBn3FEJ/8ACyghAANAaBwAAAAJAZ9zRCf/AAsoIQADQGgcIQADQGg' +
        'cAAAADUGbeDRMQz/+qZYADLkhAANAaBwAAAALQZ+WRRUsK/8ACPghAANAaBwhAANAaBwAAAAJAZ+1RCf/AAspIQADQGgcAAAACQGft0Qn' +
        '/wALKSEAA0BoHCEAA0BoHAAAAA1Bm7w0TEM//qmWAAy4IQADQGgcAAAAC0Gf2kUVLCv/AAj5IQADQGgcAAAACQGf+UQn/wALKCEAA0BoH' +
        'CEAA0BoHAAAAAkBn/tEJ/8ACykhAANAaBwAAAANQZvgNExDP/6plgAMuSEAA0BoHCEAA0BoHAAAAAtBnh5FFSwr/wAI+CEAA0BoHAAAAA' +
        'kBnj1EJ/8ACyghAANAaBwhAANAaBwAAAAJAZ4/RCf/AAspIQADQGgcAAAADUGaJDRMQz/+qZYADLghAANAaBwAAAALQZ5CRRUsK/8ACPk' +
        'hAANAaBwhAANAaBwAAAAJAZ5hRCf/AAsoIQADQGgcAAAACQGeY0Qn/wALKSEAA0BoHCEAA0BoHAAAAA1Bmmg0TEM//qmWAAy5IQADQGgc' +
        'AAAAC0GehkUVLCv/AAj5IQADQGgcIQADQGgcAAAACQGepUQn/wALKSEAA0BoHAAAAAkBnqdEJ/8ACyghAANAaBwAAAANQZqsNExDP/6pl' +
        'gAMuCEAA0BoHCEAA0BoHAAAAAtBnspFFSwr/wAI+SEAA0BoHAAAAAkBnulEJ/8ACyghAANAaBwhAANAaBwAAAAJAZ7rRCf/AAsoIQADQG' +
        'gcAAAADUGa8DRMQz/+qZYADLkhAANAaBwhAANAaBwAAAALQZ8ORRUsK/8ACPkhAANAaBwAAAAJAZ8tRCf/AAspIQADQGgcIQADQGgcAAA' +
        'ACQGfL0Qn/wALKCEAA0BoHAAAAA1BmzQ0TEM//qmWAAy4IQADQGgcAAAAC0GfUkUVLCv/AAj5IQADQGgcIQADQGgcAAAACQGfcUQn/wAL' +
        'KCEAA0BoHAAAAAkBn3NEJ/8ACyghAANAaBwhAANAaBwAAAANQZt4NExC//6plgAMuSEAA0BoHAAAAAtBn5ZFFSwr/wAI+CEAA0BoHCEAA' +
        '0BoHAAAAAkBn7VEJ/8ACykhAANAaBwAAAAJAZ+3RCf/AAspIQADQGgcAAAADUGbuzRMQn/+nhAAYsAhAANAaBwhAANAaBwAAAAJQZ/aQh' +
        'P/AAspIQADQGgcAAAACQGf+UQn/wALKCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHAAACiFtb292AAAAbG12aGQAAAA' +
        'A1YCCX9WAgl8AAAPoAAAH/AABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAA' +
        'AAAAAAAAAAAAAAAAAAAAAAADAAAAGGlvZHMAAAAAEICAgAcAT////v7/AAAF+XRyYWsAAABcdGtoZAAAAAPVgIJf1YCCXwAAAAEAAAAAA' +
        'AAH0AAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAygAAAMoAAAAAACRlZHRzAAAAHGVsc3' +
        'QAAAAAAAAAAQAAB9AAABdwAAEAAAAABXFtZGlhAAAAIG1kaGQAAAAA1YCCX9WAgl8AAV+QAAK/IFXEAAAAAAAtaGRscgAAAAAAAAAAdml' +
        'kZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAUcbWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAAB' +
        'AAAADHVybCAAAAABAAAE3HN0YmwAAACYc3RzZAAAAAAAAAABAAAAiGF2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAygDKAEgAAABIA' +
        'AAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAyYXZjQwFNQCj/4QAbZ01AKOyho3ySTUBAQFAAAAMAEA' +
        'Ar8gDxgxlgAQAEaO+G8gAAABhzdHRzAAAAAAAAAAEAAAA8AAALuAAAABRzdHNzAAAAAAAAAAEAAAABAAAB8GN0dHMAAAAAAAAAPAAAAAE' +
        'AABdwAAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAA' +
        'AQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAA' +
        'AABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mA' +
        'AAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAA' +
        'AAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAA' +
        'OpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAAC7gAAAAAQAAF3AAAAABA' +
        'AAAAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAEEc3RzegAAAAAAAAAAAAAAPAAAAzQAAAAQAAAADQAAAA0AAAANAAAAEQAAAA' +
        '8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAA' +
        'ADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEA' +
        'AAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAANAAAADQAAAQBzdGNvAAAAAAAAADwAAAAwAAADZ' +
        'AAAA3QAAAONAAADoAAAA7kAAAPQAAAD6wAAA/4AAAQXAAAELgAABEMAAARcAAAEbwAABIwAAAShAAAEugAABM0AAATkAAAE/wAABRIAAA' +
        'UrAAAFQgAABV0AAAVwAAAFiQAABaAAAAW1AAAFzgAABeEAAAX+AAAGEwAABiwAAAY/AAAGVgAABnEAAAaEAAAGnQAABrQAAAbPAAAG4gA' +
        'ABvUAAAcSAAAHJwAAB0AAAAdTAAAHcAAAB4UAAAeeAAAHsQAAB8gAAAfjAAAH9gAACA8AAAgmAAAIQQAACFQAAAhnAAAIhAAACJcAAAMs' +
        'dHJhawAAAFx0a2hkAAAAA9WAgl/VgIJfAAAAAgAAAAAAAAf8AAAAAAAAAAAAAAABAQAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAA' +
        'AAAAAAAQAAAAAAAAAAAAAAAAAACsm1kaWEAAAAgbWRoZAAAAADVgIJf1YCCXwAArEQAAWAAVcQAAAAAACdoZGxyAAAAAAAAAABzb3VuAA' +
        'AAAAAAAAAAAAAAU3RlcmVvAAAAAmNtaW5mAAAAEHNtaGQAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQA' +
        'AAidzdGJsAAAAZ3N0c2QAAAAAAAAAAQAAAFdtcDRhAAAAAAAAAAEAAAAAAAAAAAACABAAAAAArEQAAAAAADNlc2RzAAAAAAOAgIAiAAIA' +
        'BICAgBRAFQAAAAADDUAAAAAABYCAgAISEAaAgIABAgAAABhzdHRzAAAAAAAAAAEAAABYAAAEAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAA' +
        'QAAAAEAAAAUc3RzegAAAAAAAAAGAAAAWAAAAXBzdGNvAAAAAAAAAFgAAAOBAAADhwAAA5oAAAOtAAADswAAA8oAAAPfAAAD5QAAA/gAAA' +
        'QLAAAEEQAABCgAAAQ9AAAEUAAABFYAAARpAAAEgAAABIYAAASbAAAErgAABLQAAATHAAAE3gAABPMAAAT5AAAFDAAABR8AAAUlAAAFPAA' +
        'ABVEAAAVXAAAFagAABX0AAAWDAAAFmgAABa8AAAXCAAAFyAAABdsAAAXyAAAF+AAABg0AAAYgAAAGJgAABjkAAAZQAAAGZQAABmsAAAZ+' +
        'AAAGkQAABpcAAAauAAAGwwAABskAAAbcAAAG7wAABwYAAAcMAAAHIQAABzQAAAc6AAAHTQAAB2QAAAdqAAAHfwAAB5IAAAeYAAAHqwAAB' +
        '8IAAAfXAAAH3QAAB/AAAAgDAAAICQAACCAAAAg1AAAIOwAACE4AAAhhAAAIeAAACH4AAAiRAAAIpAAACKoAAAiwAAAItgAACLwAAAjCAA' +
        'AAFnVkdGEAAAAObmFtZVN0ZXJlbwAAAHB1ZHRhAAAAaG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAO2l' +
        'sc3QAAAAzqXRvbwAAACtkYXRhAAAAAQAAAABIYW5kQnJha2UgMC4xMC4yIDIwMTUwNjExMDA=';
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var NoSleep = (function () {
        function NoSleep() {
        }
        NoSleep.enable = function () {
            NoSleep.initVideo();
            if (zanejs.isOldIOS) {
                NoSleep.disable();
                NoSleep.timer = window.setInterval(function () {
                    window.location.href = '/';
                    window.setTimeout(window.stop, 0);
                }, 15000);
            }
            else {
                NoSleep.video.play();
            }
        };
        NoSleep.disable = function () {
            NoSleep.initVideo();
            if (zanejs.isOldIOS) {
                if (NoSleep.timer) {
                    window.clearInterval(NoSleep.timer);
                    NoSleep.timer = null;
                }
            }
            else {
                NoSleep.video.pause();
            }
        };
        NoSleep.initVideo = function () {
            if (!NoSleep.video) {
                var video_1 = document.createElement('video');
                video_1.setAttribute('playsinline', 'true');
                video_1.setAttribute('type', 'video/mp4');
                video_1.setAttribute('x5-video-player-type', 'h5');
                video_1.setAttribute('src', zanejs.emptyVideoData);
                video_1.addEventListener('timeupdate', function () {
                    if (video_1.currentTime > 0.5) {
                        video_1.currentTime = Math.random();
                    }
                });
                NoSleep.video = video_1;
            }
        };
        return NoSleep;
    }());
    zanejs.NoSleep = NoSleep;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function buildBridgedWorker(workerFunction, workerExportNames, mainExportNames, mainExportHandles) {
        var baseWorkerStr = workerFunction.toString().match(/^\s*function\s*\(\s*\)\s*\{(([\s\S](?!\}$))*[\s\S])/)[1];
        var extraWorkerStr = [];
        extraWorkerStr.push('var main = {};\n');
        for (var i = 0; i < mainExportNames.length; i++) {
            var name_1 = mainExportNames[i];
            if (name_1.charAt(name_1.length - 1) === '*') {
                name_1 = name_1.substr(0, name_1.length - 1);
                mainExportNames[i] = name_1;
                extraWorkerStr.push('main.' + name_1 + ' = function(/* arguments */){\n ' +
                    'var args = Array.prototype.slice.call(arguments); ' +
                    'var buffers = args.pop(); \n ' +
                    'self.postMessage({foo:\'' + name_1 + '\', args:args}, buffers)\n' +
                    '}; \n');
            }
            else {
                extraWorkerStr.push('main.' + name_1 + ' = function(/* arguments */){\n ' +
                    'var args = Array.prototype.slice.call(arguments); \n ' +
                    'self.postMessage({foo:\'' + name_1 + '\', args:args})\n' +
                    '}; \n');
            }
        }
        var tmpStr = [];
        for (var i = 0; i < workerExportNames.length; i++) {
            var name_2 = workerExportNames[i];
            name_2 = name_2.charAt(name_2.length - 1) === '*'
                ? name_2.substr(0, name_2.length - 1)
                : name_2;
            tmpStr.push(name_2 + ': ' + name_2);
        }
        extraWorkerStr.push('var foos={' + tmpStr.join(',') + '};\n');
        extraWorkerStr.push('self.onmessage = function(e){\n');
        extraWorkerStr.push('if(e.data.foo in foos) \n  ' +
            'foos[e.data.foo].apply(null, e.data.args); \n ' +
            'else \n ' +
            'throw(new Error(\'Main thread requested function \' + e.data.foo + \'. But it is not available.\'));\n');
        extraWorkerStr.push('\n};\n');
        var fullWorkerStr = baseWorkerStr +
            '\n\n/*==== STUFF ADDED BY BuildBridgeWorker ==== */\n\n' + extraWorkerStr.join('');
        var url = window.URL.createObjectURL(new Blob([fullWorkerStr], { type: 'text/javascript' }));
        var theWorker = new Worker(url);
        theWorker.onmessage = function (e) {
            var fooInd = mainExportNames.indexOf(e.data.foo);
            if (fooInd !== -1) {
                mainExportHandles[fooInd].apply(null, e.data.args);
            }
            else {
                throw (new Error('Worker requested function ' + e.data.foo + '. But it is not available.'));
            }
        };
        var ret = { blobURL: url };
        var makePostMessageForFunction = function (name, hasBuffers) {
            if (hasBuffers) {
                return function () {
                    var args = Array.prototype.slice.call(arguments);
                    var buffers = args.pop();
                    theWorker.postMessage({ foo: name, args: args }, buffers);
                };
            }
            else {
                return function () {
                    var args = Array.prototype.slice.call(arguments);
                    theWorker.postMessage({ foo: name, args: args });
                };
            }
        };
        for (var i = 0; i < workerExportNames.length; i++) {
            var name_3 = workerExportNames[i];
            if (name_3.charAt(name_3.length - 1) === '*') {
                name_3 = name_3.substr(0, name_3.length - 1);
                ret[name_3] = makePostMessageForFunction(name_3, true);
            }
            else {
                ret[name_3] = makePostMessageForFunction(name_3, false);
            }
        }
        return ret;
    }
    zanejs.buildBridgedWorker = buildBridgedWorker;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function call_user_func(cb, parameters) {
        parameters = Array.prototype.slice.call(arguments, 1);
        return zanejs.call_user_func_array(cb, parameters);
    }
    zanejs.call_user_func = call_user_func;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function call_user_func_array(cb, parameters) {
        var func;
        var scope = null;
        var validJSFunctionNamePattern = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/;
        if (typeof cb === 'string') {
            if (typeof window[cb] === 'function') {
                func = window[cb];
            }
            else if (cb.match(validJSFunctionNamePattern)) {
                func = (new Function(null, 'return ' + cb)());
            }
        }
        else if (Object.prototype.toString.call(cb) === '[object Array]') {
            if (typeof cb[0] === 'string') {
                if (cb[0].match(validJSFunctionNamePattern)) {
                    func = eval(cb[0] + '[\'' + cb[1] + '\']');
                }
            }
            else {
                func = cb[0][cb[1]];
            }
            if (typeof cb[0] === 'string') {
                if (typeof window[cb[0]] === 'function') {
                    scope = window[cb[0]];
                }
                else if (cb[0].match(validJSFunctionNamePattern)) {
                    scope = eval(cb[0]);
                }
            }
            else if (typeof cb[0] === 'object') {
                scope = cb[0];
            }
        }
        else if (typeof cb === 'function') {
            func = cb;
        }
        if (typeof func !== 'function') {
            throw new Error(func + ' is not a valid function');
        }
        return func.apply(scope, parameters);
    }
    zanejs.call_user_func_array = call_user_func_array;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function cancelRequestAnimationFrame() {
        var w = window;
        return w.cancelAnimationFrame ||
            w.webkitCancelAnimationFrame ||
            w.webkitCancelRequestAnimationFrame ||
            w.mozCancelAnimationFrame ||
            w.mozCancelRequestAnimationFrame ||
            w.oCancelRequestAnimationFrame ||
            w.msCancelRequestAnimationFrame ||
            function (timeoutId) {
                return window.clearTimeout(timeoutId);
            };
    }
    zanejs.cancelRequestAnimationFrame = cancelRequestAnimationFrame;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function cookie(name, value, options) {
        if (value === void 0) { value = void 0; }
        if (options === void 0) { options = void 0; }
        if (typeof value !== 'undefined') {
            options = options || {};
            if (value === null) {
                value = '';
                options = zanejs.merge({}, options);
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires === 'number' || options.expires.toUTCString)) {
                var date_2;
                if (typeof options.expires === 'number') {
                    date_2 = new Date();
                    date_2.setTime(date_2.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                }
                else {
                    date_2 = options.expires;
                }
                expires = '; expires=' + date_2.toUTCString();
            }
            var path = options.path ? '; path=' + (options.path) : '';
            var domain = options.domain ? '; domain=' + (options.domain) : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        }
        else {
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var _cookie = zanejs.trim(cookies[i]);
                    if (_cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(_cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    }
    zanejs.cookie = cookie;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function createInstance(clazz, args, props) {
        if (args === void 0) { args = []; }
        if (props === void 0) { props = null; }
        if (!clazz)
            return null;
        if (!zanejs.is_array(args)) {
            args = [args];
        }
        var instance;
        if (args) {
            switch (args.length) {
                case 0:
                    instance = new clazz();
                    break;
                case 1:
                    instance = new clazz(args[0]);
                    break;
                case 2:
                    instance = new clazz(args[0], args[1]);
                    break;
                case 3:
                    instance = new clazz(args[0], args[1], args[2]);
                    break;
                case 4:
                    instance = new clazz(args[0], args[1], args[2], args[3]);
                    break;
                case 5:
                    instance = new clazz(args[0], args[1], args[2], args[3], args[4]);
                    break;
                case 6:
                    instance = new clazz(args[0], args[1], args[2], args[3], args[4], args[5]);
                    break;
                case 7:
                    instance = new clazz(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
                    break;
                case 8:
                    instance = new clazz(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
                    break;
                case 9:
                    instance = new clazz(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
                    break;
                case 10:
                    instance = new clazz(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
                    break;
                default:
                    return null;
            }
        }
        else {
            instance = new clazz();
        }
        if (props) {
            Object.keys(props).map(function (key) {
                if (instance.hasOwnProperty(key)) {
                    instance[key] = props[key];
                }
            });
        }
        return instance;
    }
    zanejs.createInstance = createInstance;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    zanejs.emptyImageData = '' +
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2l' +
        'DQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjo' +
        'CMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+P' +
        'DwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBbl' +
        'CEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqA' +
        'AB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAA' +
        'OF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyX' +
        'YFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQW' +
        'HTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAH' +
        'HJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxU' +
        'opUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAux' +
        'sNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hIL' +
        'CPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqS' +
        'hnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx' +
        '4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVq' +
        'p1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZ' +
        'j8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNP' +
        'Tr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o' +
        '9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuh' +
        'Vo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyF' +
        'DpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7' +
        'ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F3' +
        '0N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ' +
        '4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F' +
        '5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMD' +
        'UzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7' +
        'cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1' +
        '+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g' +
        '7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA' +
        '/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0' +
        'dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qd' +
        'Oo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3' +
        'Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6' +
        'xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAA' +
        'HUwAADqYAAAOpgAABdvkl/FRgAAAKtJREFUeNrs2ksKgDAMBcBUekePo8fRU9YbpAspfjrZSjYDj5SHZTtai2T2NUr6/Yyh+xH5fsS9/SUmH' +
        'wAAAAAAMPOUlj8DPn/ne/siAAAAAAAAJp46+s7rA0QAAAAAAADoA/QBIgAAAAAAAN73Duj9H/D0ndYHiAAAAAAAABg29e93Xh8gAgAAAAAAI' +
        'H0H6ANEAAAAAAAA6AP0ASIAAAAAAADmmgsAAP//AwCuazpEOXa+fwAAAABJRU5ErkJggg==';
    zanejs.emptyImageElement = document.createElement('img');
    if (zanejs.emptyImageElement && zanejs.emptyImageElement.setAttribute) {
        zanejs.emptyImageElement.setAttribute('src', zanejs.emptyImageData);
    }
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    var fn = (function () {
        var val;
        var fnMap = [
            [
                'requestFullscreen', 'exitFullscreen', 'fullscreenElement',
                'fullscreenEnabled', 'fullscreenchange', 'fullscreenerror'
            ],
            [
                'webkitRequestFullscreen', 'webkitExitFullscreen', 'webkitFullscreenElement',
                'webkitFullscreenEnabled', 'webkitfullscreenchange', 'webkitfullscreenerror'
            ],
            [
                'webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitCurrentFullScreenElement',
                'webkitCancelFullScreen', 'webkitfullscreenchange', 'webkitfullscreenerror'
            ],
            [
                'mozRequestFullScreen', 'mozCancelFullScreen', 'mozFullScreenElement',
                'mozFullScreenEnabled', 'mozfullscreenchange', 'mozfullscreenerror'
            ],
            [
                'msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement',
                'msFullscreenEnabled', 'MSFullscreenChange', 'MSFullscreenError'
            ]
        ];
        var ret = {};
        for (var i = 0, l = fnMap.length; i < l; i++) {
            val = fnMap[i];
            if (val && val[1] in document) {
                for (i = 0; i < val.length; i++) {
                    ret[fnMap[0][i]] = val[i];
                }
                return ret;
            }
        }
        return false;
    })();
    var keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;
    function requestFullscreen(elem) {
        if (elem === void 0) { elem = null; }
        var request = fn.requestFullscreen;
        elem = elem || document.documentElement;
        if (/ Version\/5\.1(?:\.\d+)? Safari\//.test(navigator.userAgent)) {
            elem[request]();
        }
        else {
            var el = Element;
            elem[request](keyboardAllowed && el.ALLOW_KEYBOARD_INPUT);
        }
    }
    zanejs.requestFullscreen = requestFullscreen;
    function exitFullscreen() {
        document[fn.exitFullscreen]();
    }
    zanejs.exitFullscreen = exitFullscreen;
    function isFullscreen() {
        return Boolean(document[fn.fullscreenElement]);
    }
    zanejs.isFullscreen = isFullscreen;
    function toggleFullscreen(elem) {
        if (elem === void 0) { elem = null; }
        if (isFullscreen()) {
            this.exitFullscreen();
        }
        else {
            this.requestFullscreen(elem);
        }
    }
    zanejs.toggleFullscreen = toggleFullscreen;
    function onFullscreenChange(callback) {
        document.addEventListener(fn.fullscreenchange, callback, false);
    }
    zanejs.onFullscreenChange = onFullscreenChange;
    function onFullscreenError(callback) {
        document.addEventListener(fn.fullscreenerror, callback, false);
    }
    zanejs.onFullscreenError = onFullscreenError;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function getOrientation() {
        if (typeof window.orientation === 'undefined') {
            var w = zanejs.innerWidth();
            var h = zanejs.innerHeight();
            return w > h ? 1 : 2;
        }
        else {
            if (window.orientation === 180 || window.orientation === 0) {
                return 2;
            }
            else if (window.orientation === 90 || window.orientation === -90) {
                return 1;
            }
            return 0;
        }
    }
    zanejs.getOrientation = getOrientation;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function getParams() {
        return zanejs.getUrlParams(document.location.href);
    }
    zanejs.getParams = getParams;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function getUrlParams(url) {
        url = url.split('?')[1];
        var pl = /\+/g;
        var search = /([^&=]+)=?([^&]*)/g;
        var decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); };
        var urlParams = {};
        var match;
        while (match = search.exec(url)) {
            urlParams[decode(match[1])] = decode(match[2]);
        }
        return urlParams;
    }
    zanejs.getUrlParams = getUrlParams;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function _iOSVersion() {
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || '0', 10)];
        }
        return [0, 0, 0];
    }
    zanejs.iOSVersion = _iOSVersion();
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function innerHeight() {
        var _height;
        if (window.innerHeight) {
            _height = window.innerHeight;
        }
        else {
            if (document.compatMode === 'CSS1Compat') {
                _height = document.documentElement.clientHeight;
            }
            else {
                _height = document.body.clientHeight;
            }
        }
        return _height;
    }
    zanejs.innerHeight = innerHeight;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function innerWidth() {
        var _width;
        if (window.innerWidth) {
            _width = window.innerWidth;
        }
        else {
            if (document.compatMode === 'CSS1Compat') {
                _width = document.documentElement.clientWidth;
            }
            else {
                _width = document.body.clientWidth;
            }
        }
        return _width;
    }
    zanejs.innerWidth = innerWidth;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    zanejs.ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    function _isIE() {
        return zanejs.ua.match(/msie/i) != null;
    }
    zanejs.isIE = _isIE();
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function _isAndroid() {
        return zanejs.ua.match(/android/i) != null;
    }
    zanejs.isAndroid = _isAndroid();
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function _isChrome() {
        return zanejs.ua.match(/chrome/i) != null;
    }
    zanejs.isChrome = _isChrome();
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function _isIOS() {
        return zanejs.ua.match(/(ipad|iphone|ipod)/i) != null;
    }
    zanejs.isIOS = _isIOS();
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function _isOpera() {
        return zanejs.ua.match(/opera/i) != null;
    }
    zanejs.isOpera = _isOpera();
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function _isQQBrowser() {
        return zanejs.ua.match(/MQQBrowser/i) != null;
    }
    zanejs.isQQBrowser = _isQQBrowser();
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function _isSafari() {
        return (zanejs.ua.toLowerCase().indexOf('safari') !== -1);
    }
    zanejs.isSafari = _isSafari();
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function _isWebkit() {
        return zanejs.ua.match(/webkit/i) != null;
    }
    zanejs.isWebkit = _isWebkit();
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function _isWeiXin() {
        return zanejs.ua.match(/MicroMessenger/i) != null;
    }
    zanejs.isWeiXin = _isWeiXin();
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function magical(Class) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return new window.Proxy(new (Class.bind.apply(Class, [void 0].concat(args)))(), {
                get: function (target, key, receiver) {
                    if (typeof target[key] !== 'undefined') {
                        return target[key];
                    }
                    if (typeof target.__get === 'function') {
                        return target.__get(key);
                    }
                    else if (typeof target.__call === 'function') {
                        return function () {
                            var $args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                $args[_i] = arguments[_i];
                            }
                            target.__call.apply(this, [key].concat($args));
                        };
                    }
                },
                set: function (target, key, value, receiver) {
                    if (typeof target[key] !== 'undefined') {
                        target[key] = value;
                        return;
                    }
                    if (typeof target.__set === 'function') {
                        target.__set(key, value);
                        return;
                    }
                }
            });
        };
    }
    zanejs.magical = magical;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function _mobileHTML5() {
        return (zanejs.ua.match(/(mobile|pre\/|xoom)/i) != null || zanejs.isIOS || zanejs.isAndroid);
    }
    zanejs.mobileHTML5 = _mobileHTML5();
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function onVisibilityChange(callback) {
        var state, visibilityChange, doc = document;
        if (typeof doc.hidden !== 'undefined') {
            visibilityChange = 'visibilitychange';
            state = 'visibilityState';
        }
        else if (typeof doc.mozHidden !== 'undefined') {
            visibilityChange = 'mozvisibilitychange';
            state = 'mozVisibilityState';
        }
        else if (typeof doc.msHidden !== 'undefined') {
            visibilityChange = 'msvisibilitychange';
            state = 'msVisibilityState';
        }
        else if (typeof doc.webkitHidden !== 'undefined') {
            visibilityChange = 'webkitvisibilitychange';
            state = 'webkitVisibilityState';
        }
        doc.addEventListener(visibilityChange, function () {
            if (callback) {
                callback(document[state]);
            }
        }, false);
    }
    zanejs.onVisibilityChange = onVisibilityChange;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function openWindow(anchor, options) {
        var args = '';
        if (typeof (options) === 'undefined') {
            options = {};
        }
        if (typeof (options.name) === 'undefined') {
            options.name = 'win' + Math.round(Math.random() * 100000);
        }
        if (typeof (options.height) !== 'undefined' && typeof (options.fullscreen) === 'undefined') {
            args += 'height=' + options.height + ',';
        }
        if (typeof (options.width) !== 'undefined' && typeof (options.fullscreen) === 'undefined') {
            args += 'width=' + options.width + ',';
        }
        if (typeof (options.fullscreen) !== 'undefined') {
            args += 'width=' + screen.availWidth + ',';
            args += 'height=' + screen.availHeight + ',';
        }
        if (typeof (options.center) === 'undefined') {
            options.x = 0;
            options.y = 0;
            args += 'screenx=' + options.x + ',';
            args += 'screeny=' + options.y + ',';
            args += 'left=' + options.x + ',';
            args += 'top=' + options.y + ',';
        }
        if (typeof (options.center) !== 'undefined' && typeof (options.fullscreen) === 'undefined') {
            options.y = Math.floor((screen.availHeight - (options.height || screen.height)) / 2)
                - (screen.height - screen.availHeight);
            options.x = Math.floor((screen.availWidth - (options.width || screen.width)) / 2)
                - (screen.width - screen.availWidth);
            args += 'screenx=' + options.x + ',';
            args += 'screeny=' + options.y + ',';
            args += 'left=' + options.x + ',';
            args += 'top=' + options.y + ',';
        }
        if (typeof (options.scrollbars) !== 'undefined') {
            args += 'scrollbars=1,';
        }
        if (typeof (options.menubar) !== 'undefined') {
            args += 'menubar=1,';
        }
        if (typeof (options.locationbar) !== 'undefined') {
            args += 'location=1,';
        }
        if (typeof (options.resizable) !== 'undefined') {
            args += 'resizable=1,';
        }
        var win = window.open(anchor, options.name, args);
        return false;
    }
    zanejs.openWindow = openWindow;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function parseUri(str, component, mode) {
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
            var name_4 = 'queryKey';
            parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
            uri[name_4] = {};
            query = uri[key[12]] || '';
            query.replace(parser, function ($0, $1, $2) {
                if ($1) {
                    uri[name_4][$1] = $2;
                }
            });
        }
        delete uri.source;
        return uri;
    }
    zanejs.parseUri = parseUri;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function requestAnimationFrame() {
        var w = window;
        return w.requestAnimationFrame ||
            w.webkitAnimationFrame ||
            w.webkitRequestAnimationFrame ||
            w.mozRequestAnimationFrame ||
            w.oRequestAnimationFrame ||
            w.msRequestAnimationFrame ||
            function (callback, element) {
                return window.setTimeout(callback, 1000 / 60);
            };
    }
    zanejs.requestAnimationFrame = requestAnimationFrame;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function touchSupported() {
        var win = window;
        var doc = document;
        return (('ontouchstart' in win) ||
            ('undefined' !== typeof win.TouchEvent) ||
            ('undefined' !== typeof doc.createTouch));
    }
    zanejs.touchSupported = touchSupported;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function create3DContext(canvas, webGLSettings) {
        var names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
        var context = null;
        for (var ii = 0; ii < names.length; ++ii) {
            try {
                context = canvas.getContext(names[ii], webGLSettings);
            }
            catch (e) {
            }
            if (context) {
                break;
            }
        }
        return context;
    }
    zanejs.create3DContext = create3DContext;
})(zanejs || (zanejs = {}));
var zanejs;
(function (zanejs) {
    function isWebGLSupported() {
        var contextOptions = { stencil: true, failIfMajorPerformanceCaveat: true };
        try {
            var win = window;
            if (!win.WebGLRenderingContext) {
                return false;
            }
            var canvas = document.createElement('canvas');
            var gl = zanejs.create3DContext(canvas, contextOptions);
            var success = !!(gl && gl.getContextAttributes().stencil);
            if (gl) {
                var loseContext = gl.getExtension('WEBGL_lose_context');
                if (loseContext) {
                    loseContext.loseContext();
                }
            }
            gl = null;
            return success;
        }
        catch (e) {
            return false;
        }
    }
    zanejs.isWebGLSupported = isWebGLSupported;
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
            this._binaryType = 'blob';
            this._reconnectLock = false;
            this._heartBeatTime = 60000;
            this._heartBeatHandler = null;
            this._timeout = 10000;
            this._heartBeatTimer = null;
            this._closeTimer = null;
            this._header = null;
            this._onclose = null;
            this._onerror = null;
            this._onopen = null;
            this._onmessage = null;
            this._autoReconnect = true;
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
                        if (_this._autoReconnect)
                            _this.reconnect();
                    };
                    this._websocket.onError = function (errMsg) {
                        if (_this._onerror)
                            _this._onerror(errMsg);
                        if (_this._autoReconnect)
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
                    this._websocket.binaryType = this._binaryType;
                    this._websocket.onclose = function (evt) {
                        if (_this._onclose)
                            _this._onclose(evt);
                        if (_this._autoReconnect)
                            _this.reconnect();
                    };
                    this._websocket.onerror = function (evt) {
                        if (_this._onerror)
                            _this._onerror(evt);
                        if (_this._autoReconnect)
                            _this.reconnect();
                    };
                    this._websocket.onopen = function (evt) {
                        if (_this._onopen)
                            _this._onopen(evt);
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
                if (this._autoReconnect)
                    this.reconnect();
            }
        };
        WS.prototype.heartCheck = function () {
            var _this = this;
            clearTimeout(this._closeTimer);
            clearTimeout(this._heartBeatTimer);
            this._heartBeatTimer = setTimeout(function () {
                if (_this._heartBeatHandler) {
                    _this._heartBeatHandler();
                }
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