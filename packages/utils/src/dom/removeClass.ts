import { trim } from '../string/trim'
import { hasClass } from './hasClass'
/**
 * 该函数用于从给定的HTML元素中移除一个或多个CSS类。
 *
 * @function removeClass
 * @param {Element} el - 需要移除CSS类的目标HTML元素。
 * @param {string} cls - 要移除的一个或多个CSS类名，多个类名之间以空格分隔。
 *
 * @description:
 * 如果`el`参数为空或者`cls`参数为空，则函数直接返回。否则，将传入的`cls`字符串按空格分割成数组，然后遍历数组中的每个类名：
   - 对于支持`classList`属性的现代浏览器，使用`el.classList.remove(clsName)`方法移除类名；
   - 对于不支持`classList`的老式浏览器，如果元素包含指定的类名，则从元素的`className`属性中移除该类名。

 * @returns {void}
 */
export function removeClass(el: Element, cls: string) {
  // 检查输入参数是否有效
  if (!el || !cls) return
  // 将类名字符串拆分为类名数组
  const classes = cls.split(' ')
  // 获取当前元素的 className，并在首尾添加空格以便进行精确匹配
  let curClass = ` ${el.className} `

  // 遍历类名数组
  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]

    // 忽略空字符串类名
    if (!clsName) continue

    // 如果浏览器支持 classList API，则直接移除类名
    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      // 判断元素是否包含当前类名
      // 对于不支持 classList 的浏览器，通过替换方式移除类名
      curClass = curClass.replace(` ${clsName} `, ' ')
    }
  }

  // 若浏览器不支持 classList，则更新元素的 className 属性值
  if (!el.classList) {
    el.className = trim(curClass) // 使用 trim 函数去除多余的空格
  }
}
