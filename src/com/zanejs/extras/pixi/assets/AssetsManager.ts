module zanejs {

    /**
     * 资源加载器对象
     * @type {PIXI.loaders.Loader}
     * @private
     */
    let _resLoader: PIXI.loaders.Loader = new PIXI.loaders.Loader('', 6);

    /**
     * 不会释放的资源list
     * @type {Array}
     * @private
     */
    let _ignoreFileList: string[] = [];

    /**
     * 等待加载的资源包
     * @type {Array}
     * @private
     */
    let _waitBundles: AssetsBundle[] = [];

    /**
     *
     * @type {any}
     * @private
     */
    let _currentBundle: AssetsBundle = null;

    /**
     * 资源加载器是否闲置
     * @type {boolean}
     * @private
     */
    let _resLoaderIdle = true;

    export class AssetsManager {

        /**
         * 获得资源加载器对象
         * @returns {PIXI.loaders.Loader}
         */
        public static get loader(): PIXI.loaders.Loader {
            return _resLoader;
        }

        /**
         * 增加删除忽略文件
         * @param {string} file
         */
        public static addIgnoreFile(file: string) {
            if (_ignoreFileList.indexOf(file) === -1) {
                _ignoreFileList.push(file);
            }
        }

        /**
         * 增加删除忽略文件集合
         * @param {string[]} files
         */
        public static addIgnoreFiles(files: string[]) {
            let len = files.length;
            for (let i = 0; i < len; i++) {
                AssetsManager.addIgnoreFile(files[i]);
            }
        }

        /**
         * 删除忽略文件
         * @param {string[]} files
         */
        public static deleteIgnoreFiles(files: string[]) {
            let len = files.length;
            for (let i = len - 1; i >= 0; i--) {
                let pos = _ignoreFileList.indexOf(files[i]);
                if (pos !== -1) {
                    _ignoreFileList.splice(pos, 1);
                }
            }
        }

        /**
         * 清理忽略文件
         */
        public static clearIgnoreFiles() {
            _ignoreFileList = [];
        }

        /**
         *
         * @param bundle
         */
        public static loadAssetBundle (bundle: AssetsBundle): void {
            if (_waitBundles.indexOf(bundle) === -1) {
                _waitBundles.push(bundle);
            }
            AssetsManager._loadAssetBundle();
        }

        /**
         *
         * @param {string} id
         * @returns {PIXI.loaders.Resource}
         */
        public static getResById(id: string) {
            return _resLoader.resources[id];
        }

        /**
         *
         * @param {string} url
         * @returns {PIXI.loaders.Resource}
         */
        public static getResByUrl(url: string) {
            Object.keys(_resLoader.resources).map(key => {
                let resInfo = _resLoader.resources[key];
                if (resInfo.url === url) {
                    return resInfo;
                }
            });
            return null;
        }

        /**
         *
         * @param destroyBase
         * @param otherHandler
         */
        public static clearResLoader(destroyBase: boolean = false, otherHandler: Function = null): void {
            destroyBase = !!destroyBase;
            Object.keys(_resLoader.resources).map(key => {
                if (_ignoreFileList.indexOf(key) !== -1) {
                    return ;
                }
                let resource = _resLoader.resources[key];
                if (resource.texture) {
                    resource.texture.destroy(destroyBase);
                }
                if (otherHandler) {
                    otherHandler(resource);
                }
                delete _resLoader.resources[key];
            });
        }

        /**
         *
         * @private
         */
        private static _loadAssetBundle() {
            if (_resLoaderIdle) {
                _currentBundle = _waitBundles.shift();
                if (_currentBundle) {
                    _resLoaderIdle = false;
                    _resLoader.progress = 0;
                    _resLoader.loading = false;

                    let count = 0;
                    let res = _currentBundle.getAssets();
                    res.map(item => {
                        if (!_resLoader.resources[item.name]) {
                            _resLoader.add(item.name, item.url, item.options, item.cb);
                            count++;
                        }
                    });
                    if (count > 0) {
                        _resLoader.onError.once(AssetsManager._onLoadAssetError);
                        _resLoader.onComplete.once(AssetsManager._onLoadAssetComplete);
                        _resLoader.onProgress.add(AssetsManager._onLoadAssetProgress);

                        let beforeMiddlewares = _currentBundle.beforeMiddlewares;
                        beforeMiddlewares.forEach(func => {
                            _resLoader.pre(func);
                        });

                        let afterMiddlewares = _currentBundle.afterMiddlewares;
                        afterMiddlewares.forEach(func => {
                            _resLoader.pre(func);
                        });
                        _resLoader.load();
                    } else {
                        AssetsManager._onLoadAssetComplete(_resLoader, _resLoader.resources);
                    }
                }
            }
        }

        /**
         *
         * @param e
         * @private
         */
        private static _onLoadAssetError(errMsg: string, loader: PIXI.loaders.Loader, res: PIXI.loaders.Resource) {
            if (_currentBundle) {
                _currentBundle.emit(AssetsBundleEvent.ERROR, {
                    name: res.name,
                    url: res.url
                });
            }
            if (res.texture) {
                res.texture.destroy(true);
            }
            delete loader.resources[res.name];
            res = null;
        }

        /**
         *
         * @param e
         * @private
         */
        private static _onLoadAssetProgress(loader: PIXI.loaders.Loader, res: PIXI.loaders.Resource) {
            if (_currentBundle) {
                _currentBundle.emit(AssetsBundleEvent.PROGRESS, loader.progress);
            }
        }

        /**
         *
         * @param e
         * @private
         */
        private static _onLoadAssetComplete(loader: PIXI.loaders.Loader, resources: PIXI.loaders.ResourceDictionary) {
            if (_currentBundle) {
                _currentBundle.progress = 1;
                _currentBundle.emit(AssetsBundleEvent.COMPLETE, resources);
            }
            _resLoaderIdle = true;
            AssetsManager._loadAssetBundle();
        }

        constructor() {
            throw new Error('This is a STATIC CLASS and should not be instantiated.');
        }
    }
}
