import { getBoundingClientRect } from './getBoundingClientRect'
import type { ViewportOffsetResult } from './ViewportOffsetResult'

/**
 * 该函数用于获取给定元素相对于当前视口的各个方向上的偏移量，并返回一个包含这些偏移量的对象。
 *
 * @function getViewportOffset
 * @param {Element} element - 需要计算其视口偏移量的 DOM 元素。
 *
 * @description:
 * 此函数计算以下偏移量：
 *   - left：元素左边缘到文档左边缘的距离。
 *   - top：元素顶部到文档顶部的距离。
 *   - right：文档最右侧到元素右边缘（不包括滚动条）的距离。
 *   - bottom：文档底部到元素底部（不包括滚动条）的距离。
 *   - rightIncludeBody：元素左边缘到文档右边缘（包括滚动条）的距离。
 *   - bottomIncludeBody：元素顶部到文档底部（包括滚动条）的距离。
 *
 * @returns {ViewportOffsetResult} 返回一个表示元素相对于视口各边偏移量的对象。
 */
export function getViewportOffset(element: Element): ViewportOffsetResult {
  const doc = document.documentElement

  const docScrollLeft = doc.scrollLeft
  const docScrollTop = doc.scrollTop
  const docClientLeft = doc.clientLeft
  const docClientTop = doc.clientTop

  const pageXOffset = window.pageXOffset
  const pageYOffset = window.pageYOffset

  const box = getBoundingClientRect(element)

  // 提取边界信息中的 left、top、width 和 height 属性
  const {
    left: retLeft,
    top: rectTop,
    width: rectWidth,
    height: rectHeight,
  } = box as DOMRect

  // 计算实际的滚动距离
  const scrollLeft = (pageXOffset || docScrollLeft) - (docClientLeft || 0)
  const scrollTop = (pageYOffset || docScrollTop) - (docClientTop || 0)

  // 计算元素相对于视口的 offsetLeft 和 offsetTop
  const offsetLeft = retLeft + pageXOffset
  const offsetTop = rectTop + pageYOffset

  // 计算最终的 left 和 top 偏移量
  const left = offsetLeft - scrollLeft
  const top = offsetTop - scrollTop

  // 获取浏览器窗口的可见宽度和高度
  const clientWidth = window.document.documentElement.clientWidth
  const clientHeight = window.document.documentElement.clientHeight
  // 计算并返回包含所有偏移量的对象
  return {
    left,
    top,
    right: clientWidth - rectWidth - left,
    bottom: clientHeight - rectHeight - top,
    rightIncludeBody: clientWidth - left,
    bottomIncludeBody: clientHeight - top,
  }
}
