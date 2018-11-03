module zanejs {

    /**
     * 约束一个值在 min 和 max 的数字界限内。
     * clamp(3, 2, 5);   // 返回 3，因为它在 2 到 5 的范围之内
     * clamp(20, 2, 5);  // 返回 5，因为它超出了上限 5
     * clamp(-5, 2, 5);  // 返回 2，因为它超出了下线 2
     * @param val
     * @param min
     * @param max
     * @returns {number}
     */
    export function clamp(val: number, min: number, max: number): number {
        return Math.max(Math.min(val, max), min);
    }
}
