import { isFunction } from './isFunction'
import { isObject } from './isObject'

export const isPromise = <T = any>(val: unknown): val is Promise<T> =>
  isObject(val) && isFunction(val.then) && isFunction(val.catch)
