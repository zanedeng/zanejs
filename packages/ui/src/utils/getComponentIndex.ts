/**
 * 组件索引计数器
 * 用于生成唯一的组件索引ID
 */
let componentCounter: number = 1;

/**
 * 获取自增的组件索引
 * @returns 返回字符串格式的当前索引值（调用后计数器会自动+1）
 *
 * @example
 * getComponentIndex(); // "1"
 * getComponentIndex(); // "2"
 */
export function getComponentIndex(): string {
  return `${componentCounter++}`;
}
