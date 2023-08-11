import View from './View'

const modelDict = new WeakMap<
  new (data: Record<string, unknown>) => Model,
  Model
>()

/**
 * @class Model
 * @classdesc Model类表示应用程序中的数据模型。
 */
export default class Model {
  /**
   * 创建Model的实例。
   * @param {Record<string, unknown>} [data] - Model的初始数据。
   */
  constructor(public readonly data: Record<string, unknown> | null = null) {
    const constructor = this.constructor as typeof Model
    if (Model.retrieveModel(constructor)) {
      throw new Error(`名为[${constructor.name}] 的 Model 实例已经存在!`)
    }
    modelDict.set(constructor, this)
    this.onRegister()
  }

  /**
   * 在Model注册时调用的函数。
   */
  onRegister() {
    // do nothing.
  }

  /**
   * 在Model移除时调用的函数。
   */
  onRemove() {
    // do nothing.
  }

  /**
   * 发送事件给视图。
   * @param {string} type - 事件的类型。
   * @param {*} [data=null] - 附带的可选数据。
   */
  sendEvent(type: string, data: Record<string, unknown> | null = null) {
    View.notifyViews(type, data, this)
  }

  /**
   * 检索已注册的Model实例。
   * @returns {Model} 已注册Model的实例。
   */
  static retrieveModel(
    clazz: new (data: Record<string, unknown> | null) => Model
  ): Model | undefined {
    return modelDict.get(clazz)
  }

  /**
   * 移除已注册的Model实例。
   */
  static removeModel(
    clazz: new (data: Record<string, unknown> | null) => Model
  ) {
    const model = modelDict.get(clazz)
    if (model) {
      model.onRemove()
      modelDict.delete(clazz)
    }
  }
}
