import { off } from './off'
import { on } from './on'

export function once(el: HTMLElement, event: string, fn: EventListener): void {
  const listener = function (this: any, ...args: [evt: Event]) {
    if (fn) {
      fn.apply(this, args)
    }
    off(el, event, listener)
  }
  on(el, event, listener)
}
