import { hasClass } from './hasClass'

/**
 * 该函数用于向给定的 HTML 元素添加一个或多个 CSS 类名。
 *
 * @function addClass
 * @param {Element} el - 需要添加类名的 DOM 元素。
 * @param {string} cls - 需要添加的一个或多个类名，多个类名之间以空格分隔。
 *
 * @description
 * 如果 `el` 参数为空，则函数直接返回。
 * 遍历需要添加的类名数组，并对每个类名进行以下操作：
 *   - 如果目标浏览器支持 `classList` API，则直接使用 `el.classList.add(clsName)` 添加类名。
 *   - 否则，检查元素是否已包含当前类名。若不包含，将其添加到元素的 `className` 属性中。
 * 最后，在不支持 `classList` 的情况下，更新 `el.className` 的值。
 */
export function addClass(el: Element, cls: string) {
  if (!el) return
  // 获取元素当前的 className 值
  let curClass = el.className
  // 将传入的类名字符串分割为数组
  const classes = (cls || '').split(' ')

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    // 忽略空字符串类名
    if (!clsName) continue

    // 如果浏览器支持 classList API，直接添加类名
    if (el.classList) {
      el.classList.add(clsName)
    } else if (!hasClass(el, clsName)) {
      // 若不支持 classList 或元素尚未包含该类名，则手动添加类名
      curClass += ` ${clsName}`
    }
  }
  // 对于不支持 classList 的浏览器，更新元素的 className 属性
  if (!el.classList) {
    // 注意：通常在拼接完新的 className 后应调用 trim 方法去除首尾空格
    el.className = curClass.trim()
  }
}
