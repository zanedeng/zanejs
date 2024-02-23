/**
 * 判断给定的值（e）是否为DOM Element类型。
 *
 * @param {unknown} e - 需要判断类型的任意值。
 * @returns {e is Element} 如果e是DOM Element类型，则返回true；否则返回false。在非浏览器环境下，如果Element构造函数未定义也会返回false。
 */
export const isElement = (e: unknown): e is Element => {
  // 在非浏览器环境（如Node.js）中，Element可能未定义，此时直接返回false
  if (typeof Element === 'undefined') return false
  // 在浏览器环境中，检查e是否是Element实例
  return e instanceof Element
}
