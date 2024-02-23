import { is } from './is'
/**
 * 判断给定的值（val）是否为JavaScript RegExp类型。
 *
 * @param {unknown} val - 需要判断类型的任意值。
 * @returns {val is RegExp} 如果val是RegExp类型，则返回true，此时TypeScript编译器会理解val为确切的RegExp类型；否则返回false。
 */
export const isRegExp = (val: unknown): val is RegExp => is(val, 'RegExp')
