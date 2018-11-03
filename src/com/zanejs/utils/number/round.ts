module zanejs {

    /**
     * 将参数 value 的值向上或向下舍入为最接近的整数并返回该值。
     * @param value 要舍入的数字。
     * @param digits 保留小数点的位数。
     * @returns {number}
     */
    export function round(value: number, digits: number): number {
        digits = Math.pow(10, digits);
        return Math.round(value * digits) / digits;
    }
}
