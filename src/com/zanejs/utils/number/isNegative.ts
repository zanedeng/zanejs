module zanejs {

    /**
     * 是否负数
     * @param value
     * @returns {boolean}
     */
    export function isNegative(value: number): boolean {
        return !isPositive(value);
    }
}
