/**
 * 判断给定的值（val）是否为JavaScript字符串类型。
 *
 * @param {unknown} val - 需要判断类型的任意值。
 * @returns {val is string} 如果val是字符串类型，则返回true，此时TypeScript编译器会理解val为确切的string类型；否则返回false。
 */
export const isString = (val: unknown): val is string => typeof val === 'string'
