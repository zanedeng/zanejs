import { is } from './is'
/**
 * 判断给定的值（val）是否为布尔类型。
 *
 * @param {unknown} val - 需要判断类型的任意值。
 * @returns {boolean} 如果val是布尔类型，则返回true，表示`val as Boolean`类型断言成立；否则返回false。
 */
export const isBoolean = (val: unknown): val is Boolean => is(val, 'Boolean')
