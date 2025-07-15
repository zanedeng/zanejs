/**
 * 检查DOM元素是否超出视口边界
 * @param bounding - DOM元素的边界矩形对象（通过getBoundingClientRect()获取）
 * @returns 返回一个包含检查结果的对象，包含各方向是否超出视口以及综合状态
 */
export function isOutOfViewport(bounding: DOMRect): {
  all: boolean;
  any: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
  top: boolean;
} {
  // 定义返回结果对象
  const result = {
    /** 元素是否在所有方向都超出视口 */
    get all(): boolean {
      return this.top && this.left && this.bottom && this.right;
    },

    /** 元素是否在任一方向超出视口 */
    get any(): boolean {
      return this.top || this.left || this.bottom || this.right;
    },

    /** 元素底部是否超出视口下边界 */
    bottom:
      bounding.bottom >
      (window.innerHeight || document.documentElement.clientHeight),

    /** 元素左侧是否超出视口左边界 */
    left: bounding.left < 0,

    /** 元素右侧是否超出视口右边界 */
    right:
      bounding.right >
      (window.innerWidth || document.documentElement.clientWidth),

    /** 元素顶部是否超出视口上边界 */
    top: bounding.top < 0,
  };

  return result;
}
