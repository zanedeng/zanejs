import { EventEmitter } from '@stencil/core';
import { debounce, DebounceSettings } from 'lodash';

/**
 * 事件防抖装饰器
 * 为EventEmitter实例的emit方法添加防抖功能
 *
 * @param event - 要装饰的EventEmitter实例
 * @param wait - 防抖等待时间(毫秒)
 * @param options - lodash防抖选项
 * @returns 返回装饰后的EventEmitter实例
 *
 * @example
 * const emitter = new EventEmitter();
 * const debouncedEmitter = debounceEvent(emitter, 300);
 *
 * // 高频触发只会执行最后一次
 * debouncedEmitter.emit('update', data);
 */
export function debounceEvent<T extends EventEmitter>(
  event: T,
  wait: number,
  options?: DebounceSettings,
): T {
  // 保留原始引用，避免重复包装
  const original = (event as any)._original || event;

  // 创建防抖版的emit方法
  const debouncedEmit = debounce(
    original.emit.bind(original) as typeof original.emit,
    wait,
    options,
  );

  // 创建代理对象
  const proxy = new Proxy(original, {
    get(target, prop) {
      // 拦截emit调用
      if (prop === 'emit') {
        return debouncedEmit;
      }

      // 保留其他属性和方法
      const value = Reflect.get(target, prop);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });

  // 标记已包装
  (proxy as any)._original = original;

  return proxy as T;
}
