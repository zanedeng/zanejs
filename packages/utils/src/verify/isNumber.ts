import { is } from './is'
/**
 * 判断给定的值（val）是否为JavaScript Number类型。
 *
 * @param {unknown} val - 需要判断类型的任意值。
 * @returns {val is Number} 如果val是Number类型，则返回true，此时TypeScript编译器会理解val为确切的Number类型；否则返回false。
 */
export const isNumber = (val: unknown): val is Number => is(val, 'Number')
