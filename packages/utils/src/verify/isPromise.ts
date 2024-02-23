import { isFunction } from './isFunction'
import { isObject } from './isObject'
/**
 * 判断给定的值（val）是否为Promise类型。
 *
 * @template T - Promise中包含的数据类型，默认为any。
 * @param {unknown} val - 需要判断类型的任意值。
 * @returns {val is Promise<T>} 如果val是Promise类型并且具有`.then`和`.catch`方法，则返回true，此时TypeScript编译器会理解val为确切的Promise<T>类型；否则返回false。
 */
export const isPromise = <T = any>(val: unknown): val is Promise<T> =>
  isObject(val) && isFunction(val.then) && isFunction(val.catch)
