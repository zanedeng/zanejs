import View from './View'
import Model from './Model'

/**
 * 控制器字典，用于存储已注册的控制器实例。
 * @type {Map<string, Controller>}
 */
const controllerDict = new Map<string, Controller>()

/**
 * @class Controller
 * @classdesc Controller类用于管理视图和模型组件之间的交互。
 */
export default class Controller {
  /**
   * 控制器的类型。
   * @type {string}
   */
  public type: string

  /**
   * 创建控制器的实例。
   * @param {string} type - 控制器的类型。
   */
  constructor(type: string) {
    if (controllerDict.has(type)) {
      throw new Error(`类型名为 [${type}] 的控制器已经存在!`)
    }
    this.type = type
    controllerDict.set(type, this)
    this.onRegister()
  }

  /**
   * 当控制器注册时调用的函数。
   * @type {function}
   */
  onRegister(): void {
    // do nothing.
  }

  /**
   * 当控制器移除时调用的函数。
   * @type {function}
   */
  onRemove(): void {
    // do nothing.
  }

  /**
   * 执行控制器的逻辑。
   * @param {Record<string, unknown> | null} [_data] - 执行时的可选数据。
   * @param {*} [_sponsor] - 执行的可选发起者。
   */
  execute(_data: Record<string, unknown> | null, _sponsor: any): void {
    // do nothing.
  }

  /**
   * 向视图和其他控制器发送事件。
   * @param {string} type - 事件的类型。
   * @param {*} [data] - 附带的可选数据。
   * @param {boolean} [strict=false] - 指示是否严格发送事件给视图。
   */
  sendEvent(
    type: string,
    data: Record<string, unknown> | null = null,
    strict = false,
  ): void {
    if (!strict) {
      View.notifyViews(type, data, this)
    }
    Controller.notifyControllers(type, data, this)
  }

  /**
   * 注册视图组件。
   * @param {new (viewComponent: any) => View} clazz - 视图组件的类。
   * @param {*} viewComponent - 视图组件的实例。
   */
  registerView(
    clazz: new (viewComponent: any) => View,
    viewComponent: any,
  ): View {
    return new clazz(viewComponent)
  }

  /**
   * 检索已注册的视图组件。
   * @param {typeof View} clazz - 视图组件的类。
   * @returns {*} 已注册视图组件的实例。
   */
  retrieveView(clazz: new (viewComponent: any) => View): View | undefined {
    return View.retrieveView(clazz)
  }

  /**
   * 移除已注册的视图组件。
   * @param {new (viewComponent: any) => View} clazz - 视图组件的类。
   */
  removeView(clazz: new (viewComponent: any) => View): void {
    View.removeView(clazz)
  }

  /**
   * 注册新的控制器。
   * @param {string} type - 控制器的类型。
   * @param {Function} clazz - 控制器的类。
   */
  registerController(
    type: string,
    clazz: new (type: string) => Controller,
  ): Controller {
    return new clazz(type)
  }

  /**
   * 移除已注册的控制器。
   * @param {string} type - 控制器的类型。
   */
  removeController(type: string): void {
    const control = controllerDict.get(type)
    if (control) {
      control.onRemove()
      controllerDict.delete(type)
    }
  }

  /**
   * 注册新的模型。
   * @param {Function} clazz - 模型的类。
   * @param {*} [data] - 模型的可选数据。
   */
  registerModel(
    clazz: new (data: Record<string, unknown> | null) => Model,
    data: any = null,
  ): Model {
    return new clazz(data)
  }

  /**
   * 检索已注册的模型。
   * @param {Function} clazz - 模型的类。
   * @returns {*} 已注册模型的实例。
   */
  retrieveModel(
    clazz: new (data: Record<string, unknown> | null) => Model,
  ): Model | undefined {
    return Model.retrieveModel(clazz)
  }

  /**
   * 移除已注册的模型。
   * @param {new (data: Record<string, unknown> | null) => Model} clazz - 模型的类。
   */
  removeModel(clazz: new (data: Record<string, unknown> | null) => Model) {
    Model.removeModel(clazz)
  }

  /**
   * 通知特定类型的控制器关于事件的信息。
   * @param {string} type - 要通知的控制器的类型。
   * @param {Record<string, unknown> | null} [data] - 附带的可选数据。
   * @param {*} [sponsor] - 事件的可选发起者。
   */
  static notifyControllers(
    type: string,
    data: Record<string, unknown> | null = null,
    sponsor: any = null,
  ): void {
    const control = controllerDict.get(type)
    if (control) {
      control.execute(data, sponsor)
    }
  }

  /**
   * 检查特定类型的控制器是否存在。
   * @param {string} type - 控制器的类型。
   * @returns {boolean} 如果控制器存在则为true，否则为false。
   */
  static hasController(type: string): boolean {
    return controllerDict.has(type)
  }

  /**
   * 移除已注册的控制器实例。
   * @param {string} type - 控制器的类型。
   */
  static removeController(type: string): void {
    const control = controllerDict.get(type)
    if (control) {
      control.onRemove()
      controllerDict.delete(type)
    }
  }
}
