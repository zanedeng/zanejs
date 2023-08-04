/*
 * @Author: dengzongheng zongheng@fintec.ai
 * @Date: 2022-12-30 18:59:49
 * @LastEditors: dengzongheng zongheng@fintec.ai
 * @LastEditTime: 2023-08-04 15:07:40
 * @FilePath: /zanejs/packages/utils/src/dom/off.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export function off(
  element: Element | HTMLElement | Document | Window,
  event: string,
  handler: EventListenerOrEventListenerObject
): void {
  if (element && event && handler) {
    element.removeEventListener(event, handler, false)
  }
}
