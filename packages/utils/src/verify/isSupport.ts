/**
 * 检查一个回调函数（callback）的执行结果是否支持特定功能。
 *
 * @param {() => unknown} callback - 回调函数，用于检测某个特性或功能的支持情况。该函数应当返回一个布尔值或其他可转换为布尔值的结果。
 * @returns {boolean} 如果回调函数执行后的结果可以转换为true，则表示所检测的功能被支持，返回true；否则返回false。
 */
export const isSupport = (callback: () => unknown) => {
  const isSupported = Boolean(callback())

  return isSupported
}
