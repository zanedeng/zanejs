module zanejs {

    /**
     * 是否偶数
     * @param value
     * @returns {boolean}
     */
    export function isEven(value: number): boolean {
        return (value & 1) === 0;
    }
}
