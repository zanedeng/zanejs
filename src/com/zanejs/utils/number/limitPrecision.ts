/**
 * 限制数值的精度
 * @param n
 * @param maxPrecision
 */
export default function limitPrecision(n: number, maxPrecision: number = 2) {
    return parseFloat(n.toFixed(maxPrecision));
}
