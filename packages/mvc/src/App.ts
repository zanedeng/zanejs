import { BaseObject } from '@zanejs/core'
import type Controller from './Controller'
import type Model from './Model'
import type View from './View'

/**
 * @class App
 * @classdesc App类表示应用程序的主类。
 * @extends BaseObject
 */
export default class App extends BaseObject {
  /**
   * 注册控制器。
   * @param {string} type - 控制器的类型。
   * @param {new (type: string) => T & Controller} clazz - 控制器的类。
   * @returns {*} 控制器的实例。
   */
  registerController<T extends Controller>(
    type: string,
    clazz: new (type: string) => T & Controller
  ): T & Controller {
    return new clazz(type)
  }

  /**
   * 注册模型。
   * @param {new (data: Record<string, unknown> | null) => Model} clazz - 模型的类。
   * @param {Record<string, unknown> | null} [data=null] - 附带的可选数据。
   * @returns {Model} 模型的实例。
   */
  registerModel<T extends Model>(
    clazz: new (data: Record<string, unknown> | null) => T,
    data: Record<string, unknown> | null = null
  ): T & Model {
    return new clazz(data)
  }

  /**
   * 注册视图组件。
   * @param {new (viewComponent: any) => View} clazz - 视图组件的类。
   * @param {*} viewComponent - 视图组件的实例。
   * @returns {View} 视图组件的实例。
   */
  registerView<T extends View>(
    clazz: new (viewComponent: any) => T,
    viewComponent: any
  ): T {
    return new clazz(viewComponent)
  }
}
