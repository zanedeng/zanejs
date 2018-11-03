module zanejs {

    /**
     * 限制数值的精度
     * @param n
     * @param maxPrecision
     */
    export function limitPrecision(n: number, maxPrecision: number = 2) {
        n = parseFloat(n + '');
        if (isNaN(n)) n = 0;
        return parseFloat(n.toFixed(maxPrecision));
    }
}
