import { addLight } from './addLight'

/**
 * 根据传入的百分比来淡化 6 字符 HEX 颜色
 * @param {string} color 要改变的颜色
 * @param {number} amount 要改变颜色的数量
 * @returns {string} 处理后的颜色，以 HEX 表示
 */
export function lighten(color: string, amount: number) {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
  amount = Math.trunc((255 * amount) / 100)
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount,
  )}${addLight(color.substring(4, 6), amount)}`
}
