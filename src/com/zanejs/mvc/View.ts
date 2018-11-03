module zanejs {

    export interface IViewClass {
        new (name: string, viewComponent: any): View;
    }

    export class View {

        public static viewList: View[] = [];

        public name: string;

        public viewComponent: any;

        public eventList: string[] = [];

        public static retrieveView(name: string): View {
            var len: number = View.viewList.length;
            for (var i: number = 0; i < len; ++i) {
                if (View.viewList[i].name === name) {
                    return View.viewList[i];
                }
            }
            return null;
        }

        public static removeView(name: string): void {
            var len: number = View.viewList.length;
            for (var i: number = 0; i < len; ++i) {
                if (View.viewList[i].name === name) {
                    View.viewList[i].onRemove();
                    View.viewList[i].viewComponent = null;
                    View.viewList[i].eventList = null;
                    View.viewList[i] = null;
                    View.viewList.splice(i, 1);
                    break;
                }
            }
        }

        public static removeViews(...argArray: string[]): void {
            var len: number = argArray.length;
            for (var i: number = 0; i < len; ++i) {
                View.removeView(argArray[i]);
            }
        }

        public static removeAllView(...exception: string[]): void {
            var len: number = View.viewList.length;
            for (var i: number = len - 1; i >= 0; i--) {
                if (exception.indexOf(View.viewList[i].name) === -1) {
                    View.viewList[i].onRemove();
                    View.viewList[i].viewComponent = null;
                    View.viewList[i].eventList = null;
                    View.viewList[i] = null;
                    View.viewList.splice(i, 1);
                }
            }
        }

        public static notifyViews(type: string, data: any = null, sponsor: any = null): void {
            var len: number = View.viewList.length;
            var motifyList: View[] = [];
            for (var i: number = 0; i < len; ++i) {
                var eventLen: number = View.viewList[i].eventList.length;
                for (var k: number = 0; k < eventLen; ++k) {
                    if (View.viewList[i].eventList[k] === type) {
                        motifyList.push(View.viewList[i]);
                    }
                }
            }

            for (var j: number = 0; j < motifyList.length; j++) {
                motifyList[j].handleEvent(type, data, sponsor);
            }
        }

        constructor(name: string, viewComponent: any) {
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

        public onRegister(): void {
            // overwrite
        }

        public onRemove(): void {
            // overwrite
        }

        public listEventInterests(): string[] {
            return [];
        }

        public handleEvent(type: string, data: any = null, sponsor: any = null): void {
            // overwrite
        }

        public sendEvent(type: string, data: any = null, strict: boolean = false): void {
            if (!strict) {
                Controller.notifyControllers(type, data, this);
            }
            View.notifyViews(type, data, this);
        }

        public registerView(name: string, viewClass: IViewClass, viewComponent: Object): View {
            return new viewClass(name, viewComponent);
        }

        public retrieveView(name: string): View {
            return View.retrieveView(name);
        }

        public retrieveModel(name: string): Model {
            return Model.retrieveModel(name);
        }
    }

}
