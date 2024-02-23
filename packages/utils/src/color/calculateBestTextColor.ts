import { contrast } from './contrast'
import { hexToRGB } from './hexToRGB'

/**
 * 根据与背景的对比度确定最佳文字颜色（黑色或白色)
 * @param hexColor - Last selected color by the user
 */
export function calculateBestTextColor(hexColor: string) {
  const rgbColor = hexToRGB(hexColor.substring(1))
  const contrastWithBlack = contrast(rgbColor.split(','), [0, 0, 0])

  return contrastWithBlack >= 12 ? '#000000' : '#FFFFFF'
}
