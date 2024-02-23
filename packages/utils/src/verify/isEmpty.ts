import { isArray } from './isArray'
import { isObject } from './isObject'
/**
 * 判断给定的值（val）是否为空。
 *
 * @param {unknown} val - 需要判断是否为空的任意类型值。
 * @returns {boolean} 如果val为空（包括但不限于null、undefined、空字符串、数字0、空数组或无属性的对象），则返回true；否则返回false。
 */
export const isEmpty = (val: unknown) =>
  // 检查val是否为假值，但排除数字0（因为0在逻辑运算中被认为是Falsy，但在实际业务场景中可能不被视为“空”）
  (!val && val !== 0) ||
  // 如果val是数组并且长度为0，则认为为空
  (isArray(val) && val.length === 0) ||
  // 如果val是对象，并且其自身可枚举属性的数量为0，则认为为空
  (isObject(val) && !Object.keys(val).length)
