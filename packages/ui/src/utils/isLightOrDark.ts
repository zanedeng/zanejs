import { STANDARD_COLORS } from '../constants';

/**
 * 颜色亮度检测结果
 */
export type ColorBrightness = 'dark' | 'light';

/**
 * 带缓存的函数类型
 */
export type MemoizedFunction<T extends (...args: any[]) => any> = T & {
  clearCache: () => void;
};

/**
 * 创建带缓存的函数
 * @param fn - 需要缓存的函数
 * @returns 带缓存的函数及清理方法
 */
function memoize<T extends (arg: any) => any>(fn: T): MemoizedFunction<T> {
  const cache = new Map<string, ReturnType<T>>();

  const memoized = (arg: Parameters<T>[0]): ReturnType<T> => {
    const key = typeof arg === 'object' ? JSON.stringify(arg) : String(arg);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(arg);
    cache.set(key, result);
    return result;
  };

  (memoized as MemoizedFunction<T>).clearCache = () => cache.clear();

  return memoized as MemoizedFunction<T>;
}

/**
 * 检测颜色属于亮色还是暗色
 * @param color - 颜色值(名称、HEX或RGB格式)
 * @returns 'light' 或 'dark'
 *
 * @example
 * isLightOrDark('#ffffff'); // 'light'
 * isLightOrDark('rgb(0, 0, 0)'); // 'dark'
 * isLightOrDark('navy'); // 'dark'
 */
export const isLightOrDark = memoize((color: string): ColorBrightness => {
  // 获取标准颜色值或使用输入值
  const colorValue = STANDARD_COLORS[color.toLowerCase()] || color;

  let b: number, g: number, r: number;

  // 处理RGB格式
  const rgbMatch = colorValue.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i);
  if (rgbMatch) {
    r = Number.parseInt(rgbMatch[1], 10);
    g = Number.parseInt(rgbMatch[2], 10);
    b = Number.parseInt(rgbMatch[3], 10);
  }
  // 处理HEX格式
  else {
    const hex = colorValue.startsWith('#') ? colorValue.slice(1) : colorValue;
    const fullHex =
      hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;

    const num = Number.parseInt(fullHex, 16);
    if (Number.isNaN(num)) {
      console.warn(`Invalid color value: ${color}`);
      return 'dark'; // 默认返回暗色
    }

    r = (num >> 16) & 255;
    g = (num >> 8) & 255;
    b = num & 255;
  }

  // 计算HSP亮度值 (Human Perception of brightness)
  const hsp = Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b);

  // 阈值127.5是根据HSP模型的标准值
  return hsp > 127.5 ? 'light' : 'dark';
});
