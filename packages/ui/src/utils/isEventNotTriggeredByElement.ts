import { isEventTriggeredByElement } from './isEventTriggerByElement';

/**
 * 检查事件是否不是由指定元素或其子元素触发
 * @param event - 事件对象
 * @param element - 要排除的目标元素
 * @returns 如果事件不是由目标元素或其子元素触发则返回true
 *
 * @example
 * document.addEventListener('click', (event) => {
 *   if (isEventNotTriggeredByElement(event, myElement)) {
 *     console.log('点击发生在myElement及其子元素之外');
 *   }
 * });
 */
export function isEventNotTriggeredByElement(
  event: Event,
  element: EventTarget | null,
): boolean {
  return !isEventTriggeredByElement(event, element);
}
