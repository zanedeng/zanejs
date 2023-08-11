import type BaseObject from './BaseObject'

class BaseObjectPool<T extends BaseObject> {
  private poolsMap: WeakMap<new () => T, T[]>
  private maxCountMap: WeakMap<new () => T, number>

  constructor() {
    this.poolsMap = new WeakMap<new () => T, T[]>()
    this.maxCountMap = new WeakMap<new () => T, number>()
  }

  create(clazz: new () => T): T {
    const pool = this.poolsMap.get(clazz)
    if (pool && pool.length) {
      return pool.pop()!
    }
    return new clazz()
  }

  recycle(obj: T): void {
    const clazz = obj.constructor as new () => T

    if (!this.poolsMap.has(clazz)) {
      this.poolsMap.set(clazz, [])
    }

    const pool = this.poolsMap.get(clazz) as T[]
    if (pool.includes(obj)) {
      throw new Error('该对象已经存在在对象池中！')
    }

    const maxCount = this.maxCountMap.get(clazz) ?? 0
    if (maxCount > 0 && pool.length >= maxCount) {
      return
    }

    pool.push(obj)
  }

  setMaxCount(clazz: new () => T, maxCount = 0): void {
    if (maxCount < 0) {
      maxCount = 0
    }
    this.maxCountMap.set(clazz, maxCount)
  }

  fullFill(clazz: new () => T, count = -1): void {
    if (!this.poolsMap.has(clazz)) {
      this.poolsMap.set(clazz, [])
    }
    const pool = this.poolsMap.get(clazz) as T[]

    if (count < 0) {
      count = this.maxCountMap.get(clazz) ?? 0
    }

    while (pool.length < count) {
      pool.push(new clazz())
    }
  }

  release(clazz: new () => T, count = -1): void {
    if (!this.poolsMap.has(clazz)) {
      return
    }

    const pool = this.poolsMap.get(clazz) as T[]

    if (count < 0) {
      count = this.maxCountMap.get(clazz) ?? 0
    }

    if (count === 0) {
      pool.length = 0
    } else if (pool.length > count) {
      pool.splice(count)
    }
  }

  releaseAll(): void {
    this.poolsMap = new WeakMap<new () => T, T[]>()
  }
}

export const pool = new BaseObjectPool<BaseObject>()
