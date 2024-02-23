/**
 * 定义一个接口 `ViewportOffsetResult`，用于描述元素相对于视口的各个边界的偏移量结果。
 *
 * @interface ViewportOffsetResult
 */
export interface ViewportOffsetResult {
  /**
   * 元素左边缘到视口（或浏览器窗口）左边缘的距离（不包括滚动条宽度）。
   */
  left: number

  /**
   * 元素顶部到视口（或浏览器窗口）顶部的距离（不包括滚动条高度）。
   */
  top: number

  /**
   * 视口（或浏览器窗口）右边缘到元素右边缘的距离（不包括滚动条宽度）。
   */
  right: number

  /**
   * 视口（或浏览器窗口）底部到元素底部的距离（不包括滚动条高度）。
   */
  bottom: number

  /**
   * 元素左边缘到视口（或浏览器窗口）右边缘的距离（包括滚动条宽度）。
   */
  rightIncludeBody: number

  /**
   * 元素顶部到视口（或浏览器窗口）底部的距离（包括滚动条高度）。
   */
  bottomIncludeBody: number
}

// 示例：
// const offset: ViewportOffsetResult = {
//   left: 10,
//   top: 20,
//   right: 30,
//   bottom: 40,
//   rightIncludeBody: 50,
//   bottomIncludeBody: 60,
// }
