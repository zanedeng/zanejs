module zanejs {

    export class AssetsBundle extends PIXI.utils.EventEmitter {

        public name: string;
        public progress: number;
        private _afterMiddlewares: Function[];
        private _beforeMiddlewares: Function[];
        private _assets: any[];

        constructor() {
            super();
            this._assets = [];
            this._afterMiddlewares = [];
            this._beforeMiddlewares = [];
        }

        public get afterMiddlewares(): Function[] {
            return this._afterMiddlewares;
        }

        public get beforeMiddlewares(): Function[] {
            return this._beforeMiddlewares;
        }

        public getAssets(): any[] {
            return this._assets;
        }

        public addBeforeMiddleware(func: Function): void {
            if (this._beforeMiddlewares.indexOf(func) === -1) {
                this._beforeMiddlewares.push(func);
            }
        }

        public addAfterMiddleware(func: Function): void {
            if (this._afterMiddlewares.indexOf(func) === -1) {
                this._afterMiddlewares.push(func);
            }
        }

        public add(name: string, url: string, options?: PIXI.loaders.LoaderOptions, cb?: Function): AssetsBundle {
            if (!this.isExist(name)) {
                this._assets.push({name: name, url: url, options: options, cb: cb});
            }
            return this;
        }

        public isExist(name: string) {
            return this._checkExist(name);
        }

        public onDispose() {
            this.progress = 0;
            this.removeAllListeners();
            this._assets = [];
            this._afterMiddlewares = [];
            this._beforeMiddlewares = [];
        }

        public reset() {
            this.onDispose();
        }

        private _checkExist(name: string) {
            for (let i = 0, l = this._assets.length; i < l; ++i) {
                if (name === this._assets[i].name) {
                    return true;
                }
            }
            return false;
        }
    }
}
