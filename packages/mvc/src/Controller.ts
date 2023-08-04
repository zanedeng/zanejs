import type IController from './IController'

export default class Controller implements IController {
  /**
   * 控制器字典，保存所有控制器的实例
   */
  private static controllers = new Map<string, Controller>()

  /**
   * 控制器所监听的指令名
   */
  public readonly command: string

  /**
   * 构造函数
   *
   * @param command 控制器所监听的指令名
   */
  constructor(command: string) {
    if (Controller.controllers.has(command)) {
      throw new Error(`指令名为 [${command}] 的控制器已经存在!`)
    }
    this.command = command
    Controller.controllers.set(command, this)
    this.onRegister()
  }

  /**
   * 控制器注册时会调用该方法
   */
  protected onRegister(): void {
    // overwrite
  }

  /**
   * 控制器移除时会调用该方法
   */
  protected onRemove(): void {
    // overwrite
  }

  /**
   * 控制器执行指令时会调用该方法
   *
   * @param data 发送给该控制器的数据
   * @param sponsor 派发该事件的源对象
   */
  public execute(data: any = null, sponsor: any = null): void {
    // overwrite
  }

  /**
   * 向视图或者控制器发送事件
   *
   * @param command 指令名
   * @param data 需要发送的数据
   * @param strict 是否只向视图派发该事件
   */
  public sendEvent(command: string, data: any = null, strict = false): void {
    if (!strict) {
      View.notifyViews(command, data, this)
    }
    Controller.notifyControllers(command, data, this)
  }

  /**
   * 注册视图实例
   *
   * @param clazz 视图类构造函数
   * @param viewComponent 视图组件实例
   * @returns 注册得到的视图实例
   */
  protected registerView(clazz: IView, viewComponent: unknown): View {
    return new clazz(viewComponent)
  }

  /**
   * 获取已经注册的视图实例
   *
   * @param clazz 视图类构造函数
   * @returns 视图实例
   */
  protected retrieveView(clazz: IView): View {
    return View.retrieveView(clazz)
  }

  /**
   * 移除指定的视图实例
   *
   * @param clazz 视图类构造函数
   */
  protected removeView(clazz: IView): void {
    View.removeView(clazz)
  }

  /**
   * 注册模型实例
   *
   * @param clazz 模型类构造函数
   * @param data 模型初始化数据
   * @returns 注册得到的模型实例
   */
  protected registerModel(clazz: IModel, data: any = null): Model {
    return new clazz(data)
  }

  /**
   * 获取已经注册的模型实例
   *
   * @param clazz 模型类构造函数
   * @returns 模型实例
   */
  protected retrieveModel(clazz: IModel): Model {
    return Model.retrieveModel(clazz)
  }

  /**
   * 移除指定的模型实例
   *
   * @param clazz 模型类构造函数
   */
  protected removeModel(clazz: IModel): void {
    Model.removeModel(clazz)
  }

  /**
   * 静态方法：向指定的控制器发送事件
   *
   * @param command 指令名
   * @param data 发送给该控制器的数据
   * @param sponsor 派发该事件的源对象
   */
  public static notifyControllers(
    command: string,
    data: any = null,
    sponsor: any = null
  ): void {
    const controller = Controller.controllers.get(command)

    if (controller) {
      controller.execute(data, sponsor)
    }
  }

  /**
   * 静态方法：判断指定的指令名是否存在对应的控制器
   *
   * @param command 指令名
   * @returns 是否存在
   */
  public static hasController(command: string): boolean {
    return Controller.controllers.has(command)
  }

  /**
   * 静态方法：移除指定的控制器实例
   * @param command 指令名
   */
  public static removeController(command: string): void {
    const controller = Controller.controllers.get(command)
    if (controller) {
      controller.onRemove()
      Controller.controllers.delete(command)
    }
  }
}
