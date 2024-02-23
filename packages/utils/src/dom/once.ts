import { off } from './off'
import { on } from './on'
/*
 * 此函数用于为指定的HTML元素 `el` 添加一个仅触发一次的事件监听器。当给定的 `event` 事件首次发生时，将会调用传入的 `fn` 回调函数，并在执行回调后立即从元素上移除该事件监听器。
 *
 * @param {HTMLElement} el - 需要绑定事件监听器的目标HTML元素。
 * @param {string} event - 要监听的事件名称，如 'click', 'mouseover' 等。
 * @param {EventListener} fn - 当事件首次触发时执行的回调函数，接收一个Event对象作为参数。
 *
 * @returns {void}
 */
export function once(el: HTMLElement, event: string, fn: EventListener): void {
  // 创建内部事件监听器函数 listener，它在被调用时会执行传入的fn回调函数，并在其后使用off函数移除自身作为事件监听器
  const listener = function (this: any, ...args: [evt: Event]) {
    // 如果fn存在，则应用上下文并传递参数调用该函数
    if (fn) {
      fn.apply(this, args)
    }
    // 移除当前事件监听器（listener函数）对el上event事件的监听
    off(el, event, listener)
  }
  // 使用on函数将 listener 添加到el上，监听event事件
  on(el, event, listener)
}
