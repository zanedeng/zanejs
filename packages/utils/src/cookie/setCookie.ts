import { getCurrentDomain } from './getCurrentDomain'
/**
 * 设置一个带过期时间和可选域的Cookie。
 *
 * @param {string} name - Cookie名称。
 * @param {string | number} val - Cookie值。
 * @param {number} expires - 过期时间，以秒为单位。
 * @param {string} domain - （可选）Cookie的作用域，默认使用当前二级或顶级域名。
 */
export function setCookie(
  name: string,
  val: string | number,
  expires: number,
  domain: string,
) {
  let text = String(window.encodeURIComponent(val))
  const date = new Date()
  date.setTime(date.getTime() + Number(expires) * 1000)
  text += `; expires=${date.toUTCString()}`

  // 设置路径为根目录
  text += '; path=/'

  // 如果domain参数存在且非空，则添加到cookie文本中
  if (typeof domain != 'undefined' && domain != '') {
    text += `; domain=${getCurrentDomain()}`
  } else if (domain === '') {
    // 若domain为空字符串，则不设置domain属性
  } else {
    // 使用默认的当前二级或顶级域名
    text += `; domain=${getCurrentDomain()}`
  }

  // 将构造好的Cookie写入document.cookie
  document.cookie = `${name}=${text}`
}
