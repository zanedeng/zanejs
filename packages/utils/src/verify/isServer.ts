/**
 * 判断当前运行环境是否为服务器端。
 *
 * @returns {boolean} 如果当前环境是服务器端（如Node.js环境），则返回true；若在浏览器环境中执行，则返回false。
 */
export const isServer = typeof window === 'undefined'
