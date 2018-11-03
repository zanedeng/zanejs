module zanejs {

    /**
     * 确定数值 value 包括在 firstValue 和 secondValue 的范围内。
     *  isBetween(3, 0, 5); // Traces true
     *  isBetween(7, 0, 5); // Traces false
     * @param value
     * @param firstValue
     * @param secondValue
     * @returns {boolean}
     */
    export function isBetween(value: number, firstValue: number, secondValue: number): boolean {
        return !(value < Math.min(firstValue, secondValue) || value > Math.max(firstValue, secondValue));
    }
}
