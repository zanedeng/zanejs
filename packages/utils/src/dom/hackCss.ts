/**
 * 该函数用于为CSS属性添加浏览器前缀，并将其与原属性合并到一个对象中。
 *
 * @function hackCss
 * @param {string} attr - 需要添加浏览器前缀的CSS属性名，例如 'transform' 或 'animation'.
 * @param {string} value - CSS属性对应的值，如 'translateX(10px)' 或 'ease-in-out'.
 *
 * @description:
 * 此函数接收一个CSS属性名和其对应值作为参数，对属性名进行首字母大写处理后，为它生成四个带不同浏览器前缀（webkit、Moz、ms 和 OT）的版本，
 * 然后将这些带有前缀的属性以及原始属性和值一起组合成一个新的样式对象返回。
 *
 * @returns {Record<string, string>} 返回一个包含所有带前缀及不带前缀的CSS属性及其值的对象。
 */
export function hackCss(attr: string, value: string) {
  // 定义常用的CSS属性前缀数组
  const prefix: string[] = ['webkit', 'Moz', 'ms', 'OT']
  // 将CSS属性名转换为首字母大写的形式（因为CSS属性在JavaScript中通常是驼峰式命名）
  attr = attr.charAt(0).toUpperCase() + attr.slice(1)
  // 初始化一个空对象来存储带有前缀的CSS属性
  const styleObj: any = {}
  // 遍历所有前缀，并为每个前缀创建一个新的CSS属性名并赋值
  prefix.forEach((item) => {
    styleObj[`${item}${attr}`] = value
  })
  // 合并带有前缀的CSS属性和原始属性到同一个对象中
  return {
    ...styleObj,
    [attr]: value,
  }
}
