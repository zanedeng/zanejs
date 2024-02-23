import { is } from './is'
/**
 * 判断给定的值（val）是否为全局Window对象。
 *
 * @param {*} val - 需要判断类型的任意值。
 * @returns {val is Window} 如果当前环境存在Window对象，并且传入的val是Window类型，则返回true；否则返回false。
 */
export const isWindow = (val: any): val is Window =>
  // 检查当前环境是否存在Window对象，防止在非浏览器环境中报错
  typeof window !== 'undefined' && is(val, 'Window')
