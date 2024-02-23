/**
 * 检查给定的HTML元素是否包含指定的CSS类名。
 *
 * @function hasClass
 * @param {Element} el - 要检查的HTML元素。
 * @param {string} cls - 需要查找的CSS类名。
 *
 * @description:
 * 此函数接收一个HTML元素和一个字符串作为参数，用于判断该元素的class属性中是否包含了指定的CSS类。如果`el`参数为空或者`cls`参数为空，则直接返回false。若`cls`中包含空格，则抛出错误提示不应该包含空格。在支持`classList`属性的现代浏览器中，它会使用`classList.contains()`方法来检查类名是否存在；对于不支持此属性的老式浏览器，通过将元素的`className`转换为带有额外空格的字符串进行比较来实现相同功能。
 *
 * @returns {boolean} 如果元素包含指定的CSS类名，则返回true，否则返回false。
 */
export function hasClass(el: Element, cls: string) {
  // 如果元素或类名为空，则直接返回false
  if (!el || !cls) return false
  // 如果类名包含空格，则抛出错误
  if (cls.indexOf(' ') !== -1)
    throw new Error('className should not contain space.')
  // 对于支持classList API的浏览器
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    // 对于不支持classList的旧版浏览器
    // 在className两边添加空格并进行精确匹配以避免边界问题
    return ` ${el.className} `.indexOf(` ${cls} `) > -1
  }
}
