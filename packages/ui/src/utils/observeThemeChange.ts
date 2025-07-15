type ThemeChangeCallback = (
  newTheme: null | string,
  oldTheme: null | string,
) => void;

/**
 * 主题变化观察器 (基于 MutationObserver)
 * 高效监听文档根元素 data-theme 属性的变化
 *
 * @returns 返回一个订阅函数，该函数返回取消订阅的方法
 *
 * @example
 * // 订阅主题变化
 * const unsubscribe = observeThemeChange((newTheme, oldTheme) => {
 *   console.log(`主题从 ${oldTheme} 变更为 ${newTheme}`);
 * });
 *
 * // 取消订阅
 * unsubscribe();
 */
export const observeThemeChange = ((): ((
  callback: ThemeChangeCallback,
) => () => void) => {
  // 存储所有回调函数和上一次的主题值
  const callbackEntries = new Map<
    ThemeChangeCallback,
    { lastTheme: null | string }
  >();

  // 共享的 MutationObserver 实例
  let observer: MutationObserver | null = null;

  // 检查并初始化观察器
  const ensureObserver = () => {
    if (!observer) {
      observer = new MutationObserver((mutations) => {
        const themeMutation = mutations.find(
          (m) => m.attributeName === 'data-theme',
        );
        if (!themeMutation) return;

        const target = themeMutation.target as HTMLElement;
        const currentTheme = target.dataset.theme;

        // 通知所有订阅者
        callbackEntries.forEach((entry, callback) => {
          if (entry.lastTheme !== currentTheme) {
            callback(currentTheme, entry.lastTheme);
            entry.lastTheme = currentTheme;
          }
        });
      });

      observer.observe(document.documentElement, {
        attributeFilter: ['data-theme'],
        attributes: true,
      });
    }
  };

  // 清理无用的观察器
  const cleanupObserver = () => {
    if (observer && callbackEntries.size === 0) {
      observer.disconnect();
      observer = null;
    }
  };

  return (callback: ThemeChangeCallback) => {
    // 初始化记录
    callbackEntries.set(callback, {
      lastTheme: document.documentElement.dataset.theme,
    });

    ensureObserver();

    // 返回取消订阅函数
    return () => {
      callbackEntries.delete(callback);
      cleanupObserver();
    };
  };
})();
