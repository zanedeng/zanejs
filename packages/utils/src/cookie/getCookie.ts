/**
 * 获取指定名称的Cookie值。
 *
 * @param {string} name - 要获取的Cookie的名称。
 * @returns {string | undefined} - 返回找到的Cookie值，如果没有找到则返回undefined。
 */
export function getCookie(name: string): string | undefined {
  const cookieSplitResult = document.cookie.split('; ')

  for (let i = 0; i < cookieSplitResult.length; i++) {
    const temp = cookieSplitResult[i].split('=')
    if (temp[0] == name) {
      // 解码Cookie值并返回
      return unescape(temp[1])
    }
  }

  // 若未找到匹配名称的Cookie，则返回undefined
  return undefined
}
