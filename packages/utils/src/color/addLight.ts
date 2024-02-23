/**
 * 将传入的百分比与 HEX 颜色的 R、G 或 B 相加
 * @param {string} color 要改变的颜色
 * @param {number} amount 要改变颜色的数量
 * @returns {string} 返回 颜色的处理部分
 */
export function addLight(color: string, amount: number): string {
  const cc = parseInt(color, 16) + amount
  const c = cc > 255 ? 255 : cc
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}
