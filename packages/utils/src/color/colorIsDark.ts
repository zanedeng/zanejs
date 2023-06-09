import { hexToRGB } from './hexToRGB'
import { isHexColor } from './isHexColor'

export function colorIsDark(color: string) {
  if (!isHexColor(color)) return
  const [r, g, b] = hexToRGB(color)
    .replace(/(?:\(|\)|rgb|RGB)*/g, '')
    .split(',')
    .map((item) => Number(item))
  return r * 0.299 + g * 0.578 + b * 0.114 < 192
}
