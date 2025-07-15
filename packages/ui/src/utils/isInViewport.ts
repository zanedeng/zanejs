/**
 * 检测元素是否在视口(viewport)内可见
 * @param element - 要检测的DOM元素
 * @returns 返回元素是否至少部分可见于视口
 *
 * @remarks
 * 此函数检查元素是否与视口有交集，包括部分可见的情况
 * 完全不可见的元素包括：
 * 1. 位置固定但位于视口外的元素
 * 2. display: none 的元素
 * 3. 祖先元素有 display: none
 * 4. 透明度为0的元素
 *
 * @example
 * const element = document.getElementById('my-element');
 * if (isInViewport(element)) {
 *   // 执行元素进入视口的逻辑
 * }
 */
export function isInViewport(element: HTMLElement): boolean {
  if (!element || !element.getBoundingClientRect) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  // 检测元素是否与视口有交集
  return (
    rect.top < windowHeight &&
    rect.bottom > 0 &&
    rect.left < windowWidth &&
    rect.right > 0
  );
}
