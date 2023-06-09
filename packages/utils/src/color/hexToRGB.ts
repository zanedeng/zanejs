import { isHexColor } from './isHexColor'

/**
 * Transform a HEX color to its RGB representation
 * @param {string} hex The color to transform
 * @returns The RGB representation of the passed color
 */
export function hexToRGB(hex: string) {
  let sHex = hex.toLowerCase()
  if (isHexColor(hex)) {
    if (sHex.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sHex.slice(i, i + 1).concat(sHex.slice(i, i + 1))
      }
      sHex = sColorNew
    }
    const sColorChange: number[] = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt(`0x${sHex.slice(i, i + 2)}`))
    }
    return `RGB(${sColorChange.join(',')})`
  }
  return sHex
}
