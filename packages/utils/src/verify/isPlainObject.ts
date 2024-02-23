import { is } from './is'
/**
 * 判断给定的值（val）是否为JavaScript的纯对象（即通过{}或new Object()创建的对象，不包括Array、null、Function等类型）。
 *
 * @param {unknown} val - 需要判断类型的任意值。
 * @returns {val is object} 如果val是一个纯粹的Object实例（非null、非数组、非函数等），则返回true，此时TypeScript编译器会理解val为object类型；否则返回false。
 */
export const isPlainObject = (val: any): val is object =>
  val !== null &&
  typeof val === 'object' &&
  is(val, 'Object') &&
  val.constructor === Object
