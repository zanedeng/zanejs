module zanejs {

    /**
     * 是否奇数
     * @param value
     * @returns {boolean}
     */
    export function isOdd(value: number): boolean {
        return !isEven(value);
    }
}
