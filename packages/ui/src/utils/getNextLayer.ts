export type LayerType = '01' | '02' | 'background';

/**
 * 获取下一个层级标识
 * @param layer - 当前层级标识
 * @returns 返回下一个层级标识，遵循 background → 01 → 02 → background 的循环顺序
 *
 * @example
 * getNextLayer(); // '01'
 * getNextLayer('background'); // '01'
 * getNextLayer('01'); // '02'
 * getNextLayer('02'); // 'background'
 */
export function getNextLayer(layer?: LayerType): LayerType {
  const layerCycle: LayerType[] = ['background', '01', '02'];

  // 获取当前索引，未提供时默认为-1(background前一位)
  const currentIndex = layer ? layerCycle.indexOf(layer) : -1;

  // 计算下一个索引(循环)
  const nextIndex = (currentIndex + 1) % layerCycle.length;

  return layerCycle[nextIndex];
}
