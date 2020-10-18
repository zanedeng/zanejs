import { BaseObject } from './BaseObject';
import { Controller, IControllerType } from './Controller';
import { Model, IModelType } from './Model';
import { View, IViewType } from './View';

/**
 * @class App
 */
export class App extends BaseObject
{
    /**
     * 注册控制器
     * @param Clazz 控制器类
     * @param cmd 控制器触发类型
     */
    public registerController(cmd: string, Clazz: IControllerType): Controller
    {
        return new Clazz(cmd);
    }

    /**
     * 注册数据模型管理器
     * @param clazz 数据模型管理器类
     * @param data 数据模型管理器的初始化数据
     */
    public registerModel(Clazz: IModelType, data: any = null): Model
    {
        return new Clazz(data);
    }

    /**
     * 注册视图管理器
     * @param Clazz 视图管理器类
     * @param viewComponent 视图管理器管理的视图实例
     */
    public registerView(Clazz: IViewType, viewComponent: unknown): View
    {
        return new Clazz(viewComponent);
    }
}
