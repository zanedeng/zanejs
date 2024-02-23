import { subtractLight } from './subtractLight'

/**
 * 根据通过的百分比使 HEX 颜色变暗
 * @param {string} color 要处理的颜色
 * @param {number} amount 改变颜色的量
 * @returns {string} 处理后颜色的 HEX 值
 */
export function darken(color: string, amount: number) {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
  amount = Math.trunc((255 * amount) / 100)
  return `#${subtractLight(color.substring(0, 2), amount)}${subtractLight(
    color.substring(2, 4),
    amount,
  )}${subtractLight(color.substring(4, 6), amount)}`
}
