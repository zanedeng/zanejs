/**
 * 判断给定的值（val）是否为函数类型。
 *
 * @param {unknown} val - 需要判断类型的任意值。
 * @returns {val is Function} 如果val是函数类型，则返回true，此时TypeScript编译器会理解val为确切的Function类型；否则返回false。
 */
export const isFunction = (val: unknown): val is Function =>
  // 使用typeof运算符检查val是否为'function'类型
  typeof val === 'function'
