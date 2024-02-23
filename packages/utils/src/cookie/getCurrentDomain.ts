/**
 * 获取当前域名（二级或顶级域名）。
 */
export function getCurrentDomain() {
  const hostnameArray = window.location.hostname.split('.')
  // 取域名的最后一部分（一级域名）和倒数第二部分（二级域名），并用.连接起来，形成二级或顶级域名
  return `.${hostnameArray.slice(-2).join('.')}`
}
