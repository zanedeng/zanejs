import { View } from "./View";

export type IModelType = {
    new (name: string, data?: any): Model;
}

/**
 * @class Model
 */
export class Model {

    public static modelDict = new WeakMap();

    public data: any = {};

    public static retrieveModel(clzz: IModelType): Model {
        return this.modelDict.get(clzz);
    }

    public static removeModel(clazz: IModelType): void {
        this.modelDict.delete(clazz);
    }

    constructor(data: any = null) {
        if (Model.retrieveModel(this.constructor as IModelType) != null) {
            throw new Error('名为[' + this.constructor.name + '] 的 Model 实例已经存在!');
        }
        if (data != null) {
            Object.keys(data).map(key => {
                this.data[key] = data[key];
            });
        }

        Model.modelDict.set(this.constructor, this);
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
