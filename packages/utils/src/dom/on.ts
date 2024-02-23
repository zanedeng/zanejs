/**
 * 该函数用于向给定的元素添加指定事件类型的监听器。
 *
 * @function on
 * @param {Element | HTMLElement | Document | Window} element - 需要添加事件监听器的目标DOM元素、HTML元素、文档对象或窗口对象。
 * @param {string} event - 要添加监听的事件类型名称，如 'click'、'mouseover' 等。
 * @param {EventListenerOrEventListenerObject} handler - 要绑定到事件类型的处理器函数，可以是单独的事件处理函数，也可以是一个实现了EventListener接口的对象。
 *
 * @description:
 * 此函数检查传入的`element`、`event`和`handler`参数是否都存在。如果都存在，则使用`addEventListener`方法在目标元素上添加与指定事件类型和处理器关联的事件监听器，并设置捕获阶段为false（即在冒泡阶段触发）。
 *
 * @returns {void}
 */
export function on(
  element: Element | HTMLElement | Document | Window,
  event: string,
  handler: EventListenerOrEventListenerObject,
): void {
  if (element && event && handler) {
    element.addEventListener(event, handler, false)
  }
}
