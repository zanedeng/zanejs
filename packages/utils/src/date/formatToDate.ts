import dayjs from 'dayjs'
/**
 * 定义默认的日期格式常量，默认为 'YYYY-MM-DD' 格式。
 * @constant {string} DATE_FORMAT
 */
const DATE_FORMAT = 'YYYY-MM-DD'

/**
 * 该函数用于将给定日期按照指定格式转换为字符串。
 *
 * @function formatToDate
 * @param {dayjs.ConfigType} [date] - 需要格式化的日期对象，可以是 JavaScript Date 对象、时间戳、ISO 8601 字符串等。可选参数，若不传入，则使用当前日期。
 * @param {string} [format=DATE_FORMAT] - 指定日期输出的格式，例如 'YYYY-MM-DD'。默认值为 `DATE_FORMAT` 常量定义的格式。
 * @returns {string} 返回格式化后的日期字符串。
 */
export function formatToDate(
  date?: dayjs.ConfigType,
  format = DATE_FORMAT,
): string {
  return dayjs(date).format(format)
}

// 示例用法：
// const currentDate = formatToDate() // 获取当前日期并格式化为 'YYYY-MM-DD'
// const customDate = new Date('2024-02-29')
// const customFormat = 'MM/DD/YYYY'
// const formattedDate = formatToDate(customDate, customFormat) // 自定义日期和格式
