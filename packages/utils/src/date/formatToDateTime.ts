import dayjs from 'dayjs'

/**
 * 定义默认的日期时间格式常量，默认为 'YYYY-MM-DD HH:mm:ss' 格式。
 * @constant {string} DATE_TIME_FORMAT
 */
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

/**
 * 该函数用于将给定日期时间按照指定格式转换为字符串。
 *
 * @function formatToDateTime
 * @param {dayjs.ConfigType} [date] - 需要格式化的日期时间对象，可以是 JavaScript Date 对象、时间戳、ISO 8601 字符串等。可选参数，若不传入，则使用当前日期时间。
 * @param {string} [format=DATE_TIME_FORMAT] - 指定日期时间输出的格式，例如 'YYYY-MM-DD HH:mm:ss'。默认值为 `DATE_TIME_FORMAT` 常量定义的格式。
 * @returns {string} 返回格式化后的日期时间字符串。
 */
export function formatToDateTime(
  date?: dayjs.ConfigType,
  format = DATE_TIME_FORMAT,
): string {
  return dayjs(date).format(format)
}

// 示例用法：
// const currentDateTime = formatToDateTime() // 获取当前日期时间并格式化为 'YYYY-MM-DD HH:mm:ss'
// const customDateTime = new Date('2024-02-29T14:30:00')
// const customFormat = 'MM/DD/YYYY h:mm A'
// const formattedDateTime = formatToDateTime(customDateTime, customFormat) // 自定义日期时间和格式
