import EventEmitter from 'eventemitter3'
import { pool } from './BaseObjectPool'

export default class BaseObject extends EventEmitter {
  /**
   * 计数器，用于生成唯一的哈希码
   */
  private static hashCodeCounter = 0

  /**
   * 对象的哈希码
   */
  private _hashCode: number

  constructor() {
    super()
    this._hashCode = BaseObject.hashCodeCounter++
  }

  /**
   * 获取该对象的哈希码
   *
   * @returns 哈希码
   */
  get hashCode(): number {
    return this._hashCode
  }

  /**
   * 回收释放该对象
   */
  dispose(): void {
    this.onDispose()
    pool.recycle(this)
  }

  /**
   * 该对象被回收前会调用该方法
   */
  onDispose(): void {
    // overwrite
  }
}
