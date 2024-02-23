/**
 * 判断给定的值（val）是否为JavaScript Symbol类型。
 *
 * @param {unknown} val - 需要判断类型的任意值。
 * @returns {val is symbol} 如果val是Symbol类型，则返回true，此时TypeScript编译器会理解val为确切的symbol类型；否则返回false。
 */
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
