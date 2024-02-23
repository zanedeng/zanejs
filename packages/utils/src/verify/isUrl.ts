/**
 * 判断给定的路径（path）是否为一个有效的URL地址。
 *
 * @param {string} path - 需要验证的字符串，可能是URL地址。
 * @returns {boolean} 如果path符合URL格式规则，则返回true；否则返回false。
 */
export function isUrl(path: string): boolean {
  // 创建一个正则表达式用于匹配URL格式
  const reg =
    // eslint-disable-next-line no-useless-escape
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/
  // 使用正则表达式测试path是否匹配URL格式
  return reg.test(path)
}
