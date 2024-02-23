/**
 * 判断给定的值（val）是否为undefined类型。
 *
 * @param {*} val - 需要判断类型的任意值。
 * @returns {val is undefined} 如果val是undefined类型，则返回true，此时TypeScript编译器会理解val为确切的undefined类型；否则返回false。
 */
export const isUndef = (val: any): val is undefined => val === undefined
