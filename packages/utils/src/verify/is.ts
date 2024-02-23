/**
 * 导出Object.prototype.toString方法，以便于后续直接调用。
 */
export const objectToString = Object.prototype.toString

/**
 * 判断给定的值（value）是否为指定类型（type）。
 *
 * @param {unknown} value - 需要判断类型的任意值。
 * @param {string} type - 指定的目标类型名称，如'Array', 'String', 'Function'等。
 * @returns {boolean} 如果value的类型与指定的type一致，则返回true，否则返回false。
 */
export const is = (value: unknown, type: string): boolean =>
  // 使用Object.prototype.toString方法并结合call方法获取value的[[Class]]内部属性值，并与预期的类型字符串进行比较
  objectToString.call(value) === `[object ${type}]`
