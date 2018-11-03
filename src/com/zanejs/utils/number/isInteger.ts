module zanejs {

    /**
     * 是否整数
     * @param value
     * @returns {boolean}
     */
    export function isInteger(value: number): boolean {
        return (value % 1) === 0;
    }
}
