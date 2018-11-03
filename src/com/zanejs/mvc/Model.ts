module zanejs {

    export interface IModelClass {
        new (name: string, data?: any): Model;
    }

    export class Model {

        public static modelList: Model[] = [];

        public name: string;
        public data: any = {};

        public static retrieveModel(name: string): Model {
            var len: number = Model.modelList.length;
            for (let i: number = 0; i < len; ++i) {
                if (Model.modelList[i].name === name) {
                    return Model.modelList[i];
                }
            }
            return null;
        }

        public static removeModel(name: string): void {
            var len: number = Model.modelList.length;
            for (let i: number = len - 1; i >= 0; --i) {
                if (Model.modelList[i].name === name) {
                    Model.modelList[i].onRemove();
                    Model.modelList[i].data = null;
                    Model.modelList[i] = null;
                    Model.modelList.splice(i, 1);
                    break;
                }
            }
        }

        constructor(name: string, data: any = null) {
            if (name === undefined || name === '') {
                throw new Error('Model name can not undefined!');
            }
            if (Model.retrieveModel(name) != null) {
                throw new Error('Model[' + name + ']' + ' instance  already constructed !');
            }
            this.name = name;
            if (data != null) {
                Object.keys(data).map(key => {
                    this.data[key] = data[key];
                });
            }

            Model.modelList.push(this);
            this.onRegister();
        }

        public onRegister(): void {
            // overwrite
        }

        public onRemove(): void {
            // overwrite
        }

        public sendEvent(type: string, data: any = null): void {
            View.notifyViews(type, data, this);
        }
    }

}
