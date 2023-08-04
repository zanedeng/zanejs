import type BaseObject from './BaseObject'

/**
 * 对象池基类
 */
class ObjectPool<T extends BaseObject> {
  /**
   * 对象池映射表，保存不同对象类型对应的对象数组
   */
  private poolsMap = new WeakMap<new () => T, T[]>()

  /**
   * 对象池最大容量映射表，保存不同对象类型对应的最大容量值
   */
  private poolMaxCountMap = new WeakMap<new () => T, number>()

  /**
   * 通过对象池创建对象，如果对象池可取对象，则从对象池中取出，否则新建一个对象
   *
   * @param Clazz 构造函数
   * @returns 新创建或者回收的对象实例
   */
  public create(Clazz: { new (): T }): T {
    const pool = this.poolsMap.get(Clazz)

    if (pool && pool.length) {
      return pool.pop() as T
    }

    return new Clazz()
  }

  /**
   * 回收对象到对象池中
   *
   * @param obj 需要回收的对象实例
   * @throws 如果该对象已经存在在对象池中，则抛出异常
   */
  public recycle(obj: T): void {
    const clazz = obj.constructor as new () => T

    if (!this.poolsMap.has(clazz)) {
      this.poolsMap.set(clazz, [])
    }

    const pool = this.poolsMap.get(clazz) ?? []
    if (pool.includes(obj)) {
      throw new Error('该对象已经存在在对象池中！')
    }

    const maxCount = this.poolMaxCountMap.get(clazz) ?? 0
    if (maxCount > 0 && pool.length >= maxCount) {
      return
    }

    pool.push(obj)
  }

  /**
   * 设置指定对象类型的对象池最大容量
   *
   * @param Clazz 构造函数
   * @param maxCount 对象池最大容量
   */
  public setMaxCount(Clazz: new () => T, maxCount = 0): void {
    if (maxCount < 0) {
      maxCount = 0
    }
    this.poolMaxCountMap.set(Clazz, maxCount)
  }

  /**
   * 填充对象到对象池中
   *
   * @param Clazz 构造函数
   * @param count 填充数量，默认为 -1，表示填满对象池
   */
  public fullFill(Clazz: new () => T, count = -1): void {
    if (!this.poolsMap.has(Clazz)) {
      this.poolsMap.set(Clazz, [])
    }
    const pool = this.poolsMap.get(Clazz) ?? []

    if (count < 0) {
      count = this.poolMaxCountMap.get(Clazz) ?? 0
    }

    while (pool.length < count) {
      pool.push(new Clazz())
    }
  }

  /**
   * 释放对象池中多余的对象
   *
   * @param Clazz 构造函数
   * @param count 需要保留的对象数量，默认为 -1，表示全部释放
   */
  public release(Clazz: new () => T, count = -1): void {
    if (!this.poolsMap.has(Clazz)) {
      return
    }

    const pool = this.poolsMap.get(Clazz) ?? []

    if (count < 0) {
      count = this.poolMaxCountMap.get(Clazz) ?? 0
    }

    if (count === 0) {
      pool.length = 0
    } else if (pool.length > count) {
      pool.splice(count)
    }
  }

  /**
   * 释放所有对象池中的对象
   */
  public releaseAll(): void {
    this.poolsMap = new WeakMap()
  }
}

/**
 * 对象池
 * @type {ObjectPool}
 */
export const pool = new ObjectPool()
