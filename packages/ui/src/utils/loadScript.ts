/**
 * 动态加载脚本
 * @param src - 脚本URL
 * @param options - 加载选项
 * @param options.async - 控制脚本是否异步加载。设置为 true 时，脚本会异步加载（不阻塞HTML解析）
 * @param options.attrs - 设置自定义HTML属性
 * @param options.crossOrigin - 控制跨域请求的CORS设置。`anonymous`：跨域请求不发送凭据（默认），'use-credentials'：跨域请求发送凭据（如cookies）
 * @param options.defer - 延迟脚本执行。 设置为 true 时，脚本会在HTML解析完成后、DOMContentLoaded事件前按顺序执行
 * @param options.integrity - 子资源完整性校验（SRI）。
 * @returns Promise在脚本加载完成后解析
 * @throws 当脚本加载失败时抛出错误
 *
 * @example
 * // 基本使用
 * await loadScript('https://example.com/script.js');
 *
 * @example
 * // 带选项使用
 * await loadScript('lib.js', {
 *   async: true,
 *   integrity: 'sha256-abc123'
 * });
 */
export function loadScript(
  src: string,
  options: {
    async?: boolean;
    attrs?: Record<string, string>;
    crossOrigin?: 'anonymous' | 'use-credentials';
    defer?: boolean;
    integrity?: string;
  } = {},
): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;

    // 设置标准属性
    if (options.async) script.async = true;
    if (options.defer) script.defer = true;
    if (options.integrity) script.integrity = options.integrity;
    if (options.crossOrigin) script.crossOrigin = options.crossOrigin;

    // 设置自定义属性
    if (options.attrs) {
      for (const [key, value] of Object.entries(options.attrs)) {
        script.setAttribute(key, value);
      }
    }

    // 修正事件监听器类型
    const onLoad = () => {
      resolve();
      cleanup();
    };

    const onError = () => {
      reject(new Error(`Failed to load script: ${src}`));
      cleanup();
    };

    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);

    // 添加到DOM
    document.head.append(script);

    // 清理函数
    const cleanup = () => {
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
      if (script.parentNode) {
        script.remove();
      }
    };
  });
}
