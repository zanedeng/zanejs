/**
 * 该函数用于获取给定 HTML 元素的边界信息，返回一个 `DOMRect` 对象或数字值。
 *
 * @function getBoundingClientRect
 * @param {Element} element - 需要获取其边界信息的 DOM 元素。
 *
 * @description
 * 如果传入的 `element` 参数为空或者不包含 `getBoundingClientRect` 方法，则返回数字0。
 * 否则，调用元素的 `getBoundingClientRect()` 方法获取其相对于视口的精确位置和大小信息，并以 `DOMRect` 对象的形式返回。
 *
 * @returns {(DOMRect | number)} 返回一个表示元素边界的 `DOMRect` 对象，如果无法获取边界信息，则返回数字0。
 */
export function getBoundingClientRect(element: Element): DOMRect | number {
  // 检查传入的元素是否有效并且支持 getBoundingClientRect 方法
  if (!element || !element.getBoundingClientRect) {
    return 0
  }
  // 获取并返回元素的边界信息
  return element.getBoundingClientRect()
}
