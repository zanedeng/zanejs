import { View, IViewType } from './View';
import { Model, IModelType } from './Model';

export type IControllerType = {
    new (cmd: string): Controller;
};

/**
 * @class Controller
 */
export class Controller
{
    public static controllerDict: Map<string, Controller> = new Map();

    public cmd: string;

    public static notifyControllers(cmd: string, data: any = null, sponsor: any = null): void
    {
        const controller = Controller.controllerDict.get(cmd);

        if (controller)
        {
            controller.execute(data, sponsor);
        }
    }

    public static hasController(cmd: string): boolean
    {
        return Controller.controllerDict.has(cmd);
    }

    public static removeController(cmd: string): void
    {
        const controller = Controller.controllerDict.get(cmd);

        if (controller)
        {
            controller.onRemove();
            Controller.controllerDict.delete(cmd);
        }
    }

    constructor(cmd: string)
    {
        if (Controller.controllerDict.has(cmd))
        {
            throw new Error(`指令名为 [${cmd}] 的控制器已经存在!`);
        }
        this.cmd = cmd;
        Controller.controllerDict.set(cmd, this);
        this.onRegister();
    }

    /**
     * 注册附加操作，需在子类中覆盖使用
     */
    public onRegister(): void
    {
        // overwrite
    }

    /**
     * 注销附加操作，需在子类中覆盖使用
     */
    public onRemove(): void
    {
        // overwrite
    }

    /**
     * 执行Controller逻辑处理，需在子类中覆盖使用
     */
    public execute(_data: any = null, _sponsor: any = null): void
    {
        // overwrite
    }

    public sendEvent(cmd: string, data: any = null, strict = false): void
    {
        if (!strict)
        {
            View.notifyViews(cmd, data, this);
        }
        Controller.notifyControllers(cmd, data, this);
    }

    public registerView(Clazz: IViewType, viewComponent: unknown): View
    {
        return new Clazz(viewComponent);
    }

    public retrieveView(Clazz: IViewType): View
    {
        return View.retrieveView(Clazz);
    }

    public removeView(Clazz: IViewType): void
    {
        View.removeView(Clazz);
    }

    public registerController(cmd: string, Clazz: IControllerType): Controller
    {
        return new Clazz(cmd);
    }

    public removeController(cmd: string): void
    {
        Controller.removeController(cmd);
    }

    public registerModel(Clazz: IModelType, data: any = null): Model
    {
        return new Clazz(data);
    }

    public retrieveModel(Clazz: IModelType): Model
    {
        return Model.retrieveModel(Clazz);
    }

    public removeModel(Clazz: IModelType): void
    {
        Model.removeModel(Clazz);
    }
}
