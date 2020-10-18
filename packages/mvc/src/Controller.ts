import { View, IViewType } from "./View"
import { Model, IModelType } from "./Model"

export type IControllerType = {
    new (cmd: string): Controller;
}

/**
 * @class Controller
 */
export class Controller {

    public static controllerDict: Map<string, Controller> = new Map();

    public cmd: string;

    public static notifyControllers(cmd: string, data: any = null, sponsor: any = null): void {
        const controller = Controller.controllerDict.get(cmd);
        if (controller) {
            controller.execute(data, sponsor);
        }
    }

    public static hasController(cmd: string): boolean {
        return Controller.controllerDict.has(cmd);
    }

    public static removeController(cmd: string): void {
        const controller = Controller.controllerDict.get(cmd);
        if (controller) {
            controller.onRemove();
            Controller.controllerDict.delete(cmd);
        }
    }

    constructor(cmd: string) {
        if (Controller.controllerDict.has(cmd)) {
            throw new Error('指令名为 [' + cmd + '] 的控制器已经存在!');
        }
        this.cmd = cmd;
        Controller.controllerDict.set(cmd, this);
        this.onRegister();
    }

    /**
     * 注册附加操作，需在子类中覆盖使用
     */
    public onRegister(): void {
        // overwrite
    }

    /**
     * 注销附加操作，需在子类中覆盖使用
     */
    public onRemove(): void {
        // overwrite
    }

    /**
     * 执行Controller逻辑处理，需在子类中覆盖使用
     */
    public execute(_data: any = null, _sponsor: any = null): void {
        // overwrite
    }

    public sendEvent(cmd: string, data: any = null, strict: boolean = false): void {
        if (!strict) {
            View.notifyViews(cmd, data, this);
        }
        Controller.notifyControllers(cmd, data, this);
    }

    public registerView(clazz: IViewType, viewComponent: Object): View {
        return new clazz(viewComponent);
    }

    public retrieveView(clazz: IViewType): View {
        return View.retrieveView(clazz);
    }

    public removeView(clazz: IViewType): void {
        View.removeView(clazz);
    }

    public registerController(cmd: string, clazz: IControllerType): Controller {
        return new clazz(cmd);
    }

    public removeController(cmd: string): void {
        Controller.removeController(cmd);
    }

    public registerModel(clazz: IModelType, data: any = null): Model {
        return new clazz(data);
    }

    public retrieveModel(clazz: IModelType): Model {
        return Model.retrieveModel(clazz);
    }

    public removeModel(clazz: IModelType): void {
        Model.removeModel(clazz);
    }
}
