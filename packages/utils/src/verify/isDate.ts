import { is } from './is'
/**
 * 判断给定的值（val）是否为JavaScript的Date类型。
 *
 * @param {unknown} val - 需要判断类型的任意值。
 * @returns {boolean} 如果val是Date类型，则返回true，此时TypeScript编译器会理解val为确切的Date类型；否则返回false。
 */
export const isDate = (val: unknown): val is Date => is(val, 'Date')
