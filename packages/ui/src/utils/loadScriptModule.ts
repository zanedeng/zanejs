/**
 * 动态加载脚本模块
 * @param src - 模块路径或URL
 * @returns 返回加载的模块
 * @throws 当模块加载失败时抛出错误
 *
 * @example
 * // 加载ES模块
 * const module = await loadScriptModule('./my-module.js');
 *
 * @example
 * // 加载远程模块 (需要正确配置CORS)
 * const lodash = await loadScriptModule('https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js');
 */
export async function loadScriptModule<T = any>(src: string): Promise<T> {
  try {
    // 使用动态import加载模块
    const module = await import(/* webpackIgnore: true */ src);

    // 处理某些打包工具可能会包装模块的情况
    return module?.default || module;
  } catch (error) {
    console.error(`Failed to load module from ${src}:`, error);
    throw new Error(
      `Module loading failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
