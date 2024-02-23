import { is } from './is'
/**
 * 判断给定的值（val）是否为JavaScript Map类型。
 *
 * @param {unknown} val - 需要判断类型的任意值。
 * @returns {val is Map<any, any>} 如果val是Map类型（包含任何键值对），则返回true，此时TypeScript编译器会理解val为确切的Map类型；否则返回false。
 */
export const isMap = (val: unknown): val is Map<any, any> => is(val, 'Map')
