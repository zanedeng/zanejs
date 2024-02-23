import { isServer } from './isServer'
/**
 * 判断当前运行环境是否为客户端（浏览器）。
 *
 * @returns {boolean} 如果当前环境是浏览器环境，则返回true；若在服务器端（如Node.js环境）执行，则返回false。
 */
export const isClient = !isServer
