import { is } from './is'
/**
 * 判断给定的值（val）是否为JavaScript Set类型。
 *
 * @param {unknown} val - 需要判断类型的任意值。
 * @returns {val is Set<any>} 如果val是Set类型（包含任何类型的元素），则返回true，此时TypeScript编译器会理解val为确切的Set<any>类型；否则返回false。
 */
export const isSet = (val: unknown): val is Set<any> => is(val, 'Set')
