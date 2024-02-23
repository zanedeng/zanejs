/**
 * 从 HEX 颜色的 R、G 或 B 中减去指定的百分比
 * @param {string} color 要更改的颜色
 * @param {number} amount 改变颜色的量
 * @returns {string} 颜色的处理部分
 */
export function subtractLight(color: string, amount: number) {
  const cc = parseInt(color, 16) - amount
  const c = cc < 0 ? 0 : cc
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}
