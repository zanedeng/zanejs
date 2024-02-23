import { luminanace } from './luminanace'

/**
 * 计算两种 rgb 颜色之间的对比度
 * @param {string} rgb1 rgb color 1
 * @param {string} rgb2 rgb color 2
 */
export function contrast(rgb1: string[], rgb2: number[]) {
  return (
    (luminanace(~~rgb1[0], ~~rgb1[1], ~~rgb1[2]) + 0.05) /
    (luminanace(rgb2[0], rgb2[1], rgb2[2]) + 0.05)
  )
}
