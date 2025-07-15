/**
 * 检查事件是否由指定元素或其子元素触发
 * @param event - 事件对象
 * @param element - 要检查的目标元素
 * @returns 如果事件由目标元素或其子元素触发则返回true
 *
 * @example
 * document.addEventListener('click', (event) => {
 *   if (isEventTriggeredByElement(event, myElement)) {
 *     console.log('点击发生在myElement或其子元素内');
 *   }
 * });
 */
export function isEventTriggeredByElement(
  event: Event,
  element: EventTarget | null,
): boolean {
  if (!element) return false;

  return event.composedPath().includes(element);
}
