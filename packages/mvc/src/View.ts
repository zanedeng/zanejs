import { BaseObject } from '@zanejs/core'
import Controller from './Controller'
import Model from './Model'

const viewWeakMap = new WeakMap<new (viewComponent: any) => View, View>()
const viewEventMap = new Map<string, View[]>()

/**
 * @class View
 * @classdesc View类表示应用程序中的视图组件。
 * @extends BaseObject
 */
export default class View extends BaseObject {
  public eventList: string[]
  public viewComponent: any

  /**
   * 创建View的实例。
   * @param {*} viewComponent - 视图组件的实例。
   */
  constructor(viewComponent: any) {
    super()
    const constructor = this.constructor as typeof View
    if (viewWeakMap.has(constructor)) {
      throw new Error(
        `View[${constructor.name}] instance already constructed !`
      )
    }
    this.eventList = this.listEventInterests()
    if (this.eventList && this.eventList.length) {
      this.eventList.forEach((type) => {
        let views = viewEventMap.get(type)
        if (!views) {
          views = []
        }
        if (!views.includes(this)) {
          views.push(this)
        }
        viewEventMap.set(type, views)
      })
    }
    this.viewComponent = viewComponent
    viewWeakMap.set(constructor, this)
    this.onRegister()
  }

  /**
   * 在View注册时调用的函数。
   */
  onRegister(): void {
    // do nothing.
  }

  /**
   * 在View移除时调用的函数。
   */
  onRemove(): void {
    // do nothing.
  }

  /**
   * 处理事件。
   * @param {string} _type - 事件的类型。
   * @param {Record<string, unknown> | null} [_data=null] - 附带的可选数据。
   * @param {*} [_sponsor=null] - 事件的可选发起者。
   */
  handleEvent(
    _type: string,
    _data: Record<string, unknown> | null = null,
    _sponsor: any = null
  ): void {
    // do nothing.
  }

  /**
   * 列出View感兴趣的事件。
   * @returns {Array} View感兴趣的事件列表。
   */
  listEventInterests(): string[] {
    return []
  }

  /**
   * 发送事件给视图和其他控制器。
   * @param {string} type - 事件的类型。
   * @param {Record<string, unknown> | null} [data=null] - 附带的可选数据。
   * @param {boolean} [strict=false] - 指示是否严格发送事件给视图。
   */
  sendEvent(
    type: string,
    data: Record<string, unknown> | null = null,
    strict = false
  ): void {
    if (!strict) {
      Controller.notifyControllers(type, data, this)
    }
    View.notifyViews(type, data, this)
  }

  /**
   * 注册视图组件。
   * @param {new (viewComponent: any) => View} clazz - 视图组件的类。
   * @param {*} viewComponent - 视图组件的实例。
   * @returns {*} 视图组件的实例。
   */
  registerView(
    clazz: new (viewComponent: any) => View,
    viewComponent: any
  ): any {
    return new clazz(viewComponent)
  }

  /**
   * 检索已注册的视图组件。
   * @param {new (viewComponent: any) => View} clazz - 视图组件的类。
   * @returns {*} 已注册视图组件的实例。
   */
  retrieveView(clazz: new (viewComponent: any) => View): any {
    return View.retrieveView(clazz)
  }

  /**
   * 检索已注册的模型。
   * @param {typeof Model} clazz - 模型的类。
   * @returns {*} 已注册模型的实例。
   */
  retrieveModel(clazz: typeof Model): any {
    return Model.retrieveModel(clazz)
  }

  /**
   * 检索已注册的View实例。
   * @param {new (viewComponent: any) => View} clazz - View类。
   * @returns {*} 已注册View的实例。
   */
  static retrieveView(
    clazz: new (viewComponent: any) => View
  ): View | undefined {
    return viewWeakMap.get(clazz)
  }

  /**
   * 移除已注册的View实例。
   * @param {new (viewComponent: any) => View} clazz - View类。
   */
  static removeView(clazz: new (viewComponent: any) => View): void {
    const view = viewWeakMap.get(clazz)
    if (view) {
      view.onRemove()
      view.viewComponent = null
      view.eventList = []
      viewWeakMap.delete(clazz)
    }
  }

  /**
   * 移除多个已注册的View实例。
   * @param  {...Function} args - View类。
   */
  static removeViews(...args: (new (viewComponent: any) => View)[]): void {
    args.forEach((clazz) => View.removeView(clazz))
  }

  /**
   * 通知所有已注册的View实例关于事件的信息。
   * @param {string} type - 事件的类型。
   * @param {Record<string, unknown> | null} [data=null] - 附带的可选数据。
   * @param {*} [sponsor=null] - 事件的发起者。
   */
  static notifyViews(
    type: string,
    data: Record<string, unknown> | null = null,
    sponsor: any = null
  ): void {
    const views = viewEventMap.get(type)
    if (views && views.length) {
      views.forEach((view) => view.handleEvent(type, data, sponsor))
    }
  }
}
