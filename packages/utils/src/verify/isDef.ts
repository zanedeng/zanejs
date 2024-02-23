/**
 * 判断给定的值（val）是否已经定义（非undefined）。
 *
 * @param {*} val - 需要判断类型的任意值。
 * @returns {boolean} 如果val不是undefined（即已定义），则返回true；否则返回false。
 */
export const isDef = (val: any): val is undefined => val !== undefined
