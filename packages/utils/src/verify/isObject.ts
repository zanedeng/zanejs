/**
 * 判断给定的值（val）是否为JavaScript对象类型。
 *
 * @param {unknown} val - 需要判断类型的任意值。
 * @returns {val is Record<any, any>} 如果val是一个非null的对象类型（包括Object实例和数组），则返回true，此时TypeScript编译器会理解val为Record类型；否则返回false。
 */
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'
