/**
 * 去除字符串首尾空白字符（包括全角空格和Unicode BOM）。
 *
 * @param {string} string - 需要去除首尾空白的字符串。
 * @returns {string} 处理后的字符串，去除首尾空白后的内容。
 */
export function trim(string: string) {
  // 如果传入的string为null、undefined或其他 falsy值，则默认转换为空字符串进行处理
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}
