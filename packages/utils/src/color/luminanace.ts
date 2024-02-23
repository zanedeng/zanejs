/**
 * 计算 rgb 颜色的亮度
 * @param {number} r red
 * @param {number} g green
 * @param {number} b blue
 */
export function luminanace(r: number, g: number, b: number) {
  const a = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}
