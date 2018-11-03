module zanejs {

    /**
     * 随机地生成在最小和最大（含）之间的范围内的整数。
     * 如果 min 比 max 数值要大的话，会自动交换 min 和 max 的数值。
     * @param min 最小的随机数
     * @param max 最大的随机数
     * @returns {number} 返回一个在 min 与 max 之间的整数值。
     */
    export function randomIntegerWithinRange(min: number, max: number): number {
        return Math.round(randomWithinRange(min, max));
    }
}
