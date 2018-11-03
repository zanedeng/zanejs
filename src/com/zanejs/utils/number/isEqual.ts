module zanejs {

    /**
     * 根据指定的准确度，确定两个数值是相等的。
     * isEqual(3.042, 3, 0); // Traces false
     * isEqual(3.042, 3, 0.5); // Traces true
     * @param val1
     * @param val2
     * @param precision
     * @returns {boolean}
     */
    export function isEqual(val1: number, val2: number, precision: number = 0): boolean {
        return Math.abs(val1 - val2) <= Math.abs(precision);
    }

}
