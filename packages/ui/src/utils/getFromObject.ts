/**
 * 从对象中根据路径获取值
 * @param obj - 目标对象
 * @param path - 属性路径 (支持点语法和数组语法)
 * @param defaultValue - 当路径不存在时返回的默认值
 * @returns 找到的值或默认值
 *
 * @example
 * const obj = { a: { b: { c: 1 } } };
 * getFromObject(obj, 'a.b.c'); // 1
 * getFromObject(obj, ['a', 'b', 'c']); // 1
 * getFromObject(obj, 'a.b.d', 'default'); // 'default'
 */
export function getFromObject<T = any, D = undefined>(
  obj: null | Record<string, any> | undefined,
  path: Array<number | string> | string,
  defaultValue?: D,
): D | T {
  if (obj === null) return defaultValue as D;

  // 统一处理路径为数组形式
  const pathArray = Array.isArray(path)
    ? path.map(String)
    : path.split(/[,[\].]/).filter(Boolean);

  // 遍历路径获取值
  const result = pathArray.reduce((res, key) => {
    return res === null ? res : res[key];
  }, obj);

  return result === undefined ? (defaultValue as D) : result;
}
