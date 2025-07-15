interface CacheFetchOptions {
  /**
   * 是否启用缓存
   * @default true
   */
  cacheEnabled?: boolean;
  /**
   * 凭据模式
   * @default 'same-origin'
   */
  credentials?: RequestCredentials;
  /**
   * 请求模式
   * @default 'cors'
   */
  mode?: RequestMode;
  /**
   * 缓存策略
   * @default 'stale-while-revalidate'
   */
  strategy?: 'cache-first' | 'network-first' | 'stale-while-revalidate';
}

/**
 * 创建带缓存的Fetch函数
 * @param cacheName - 缓存名称
 * @param options - 配置选项
 * @returns 返回带缓存的Fetch函数
 *
 * @example
 * const cachedFetch = await createCacheFetch('my-app-cache');
 * const data = await cachedFetch('https://api.example.com/data');
 */
export async function createCacheFetch(
  cacheName: string,
  options: CacheFetchOptions = {},
): Promise<(url: string) => Promise<string>> {
  let cache: Cache | undefined;
  const {
    cacheEnabled = true,
    credentials = 'same-origin',
    mode = 'cors',
    strategy = 'stale-while-revalidate',
  } = options;

  // 尝试打开缓存
  if (cacheEnabled && 'caches' in window) {
    try {
      cache = await caches.open(cacheName);
    } catch (error) {
      console.warn(`Failed to open cache '${cacheName}':`, error);
    }
  }

  return async function cachedFetch(url: string): Promise<string> {
    const request = new Request(url);
    let response: Response | undefined;
    let shouldUpdateCache = false;

    // 尝试从缓存获取
    if (cache && strategy !== 'network-first') {
      response = await cache.match(request);
      if (response && strategy === 'stale-while-revalidate') {
        shouldUpdateCache = true; // 后台更新缓存
      }
    }

    // 需要网络请求的情况
    if (!response || shouldUpdateCache) {
      try {
        const networkResponse = await fetch(request.url, {
          credentials:
            new URL(request.url).origin === window.location.origin
              ? 'same-origin'
              : credentials,
          method: 'GET',
          mode:
            new URL(request.url).origin === window.location.origin
              ? 'same-origin'
              : mode,
        });

        if (networkResponse.ok) {
          const responseClone = networkResponse.clone();
          const text = await networkResponse.text();

          // 更新缓存
          if (
            cache &&
            cacheEnabled &&
            // eslint-disable-next-line n/prefer-global/process
            process.env.THIRD_PARTY_ASSETS === 'REMOTE'
          ) {
            if (shouldUpdateCache) {
              // 后台更新
              cache.put(request, responseClone).catch((error) => {
                console.warn('Failed to update cache:', error);
              });
            } else {
              // 立即更新
              await cache.put(request, responseClone);
            }
          }

          if (!shouldUpdateCache) {
            return text;
          }
        } else if (!response) {
          throw new Error(
            `Network request failed with status ${networkResponse.status}`,
          );
        }
      } catch (error) {
        if (!response) {
          throw new Error(
            `Fetch failed: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
        console.warn('Network request failed, using cached response:', error);
      }
    }

    if (!response) {
      throw new Error('No response available from cache or network');
    }

    return response.text();
  };
}

/**
 * 清除指定缓存
 * @param cacheName - 缓存名称
 */
export async function clearCache(cacheName: string): Promise<void> {
  try {
    await caches.delete(cacheName);
  } catch (error) {
    console.warn(`Failed to delete cache '${cacheName}':`, error);
  }
}
