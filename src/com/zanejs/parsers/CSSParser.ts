module zanejs {

    export class CSSParser {

        private _css: any;

        constructor() {
            this._css = {};
        }

        public parseCSS(cssStr: string): void {
            cssStr = removeAllComments(cssStr); // remove comments
            let cssArr: any = cssStr.match(/([\w \.:\#]+\{.+?\})/g); // split all slectors{properties:values}
            this.parseSelectors(cssArr);
        }

        public get selectors(): string[] {
            let selectors: string[] = [];
            Object.keys(this._css).map(key => {
                selectors.push(key);
            });
            return selectors;
        }

        public getStyle(selector: string): any { return this._css[selector]; }

        public setStyle(selector: string, styleObj: any) {
            if (this._css[selector] === undefined) this._css[selector] = { };
            this._css[selector] = styleObj;
        }

        public clear() { this._css = {}; }

        private parseSelectors(cssArr: any): void {
            let selector: string;
            let properties: string;
            let n: number = cssArr.length;
            for (let i: number = 0; i < n; i++) {
                selector = trim(cssArr[i].match(/.+(?=\{)/g)[0]); // everything before {
                properties = cssArr[i].match(/(?<=\{).+(?=\})/g)[0]; // everything inside {}
                this.setStyle(selector, this.parseProperties(properties));
            }
        }

        private parseProperties(propStr: string): any {
            let result: any = {};
            let properties: any = propStr.match(/\b\w[\w-:\#\/ ,]+/g); // split properties
            let curProp: any;
            let n: number = properties.length;
            for (let j: number = 0; j < n; j++) {
                curProp = properties[j].split(':');
                result[toCamelCase(curProp[0])] = trim(curProp[1]);
            }
            return result;
        }
    }

}
