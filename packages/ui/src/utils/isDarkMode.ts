/**
 * 检测当前是否处于暗黑模式
 * @returns 返回布尔值表示是否启用暗黑模式
 *
 * @remarks
 * 通过检查文档根元素的 data-theme 属性来判断
 * 同时支持系统级暗色模式偏好检测作为后备方案
 *
 * @example
 * if (isDarkMode()) {
 *   // 应用暗黑模式样式
 * }
 */
export function isDarkMode(): boolean {
  try {
    // 显式主题设置优先
    const theme = document.documentElement.dataset.theme;
    if (theme) {
      return theme === 'dark';
    }

    // 后备方案：检测系统级颜色方案偏好
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  } catch (error) {
    // 在非浏览器环境或DOM不可用时安全降级
    console.warn('Dark mode detection failed:', error);
    return false;
  }
}
