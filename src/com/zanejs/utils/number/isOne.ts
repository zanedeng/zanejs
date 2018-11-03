module zanejs {

    /**
     * 是否等于1
     * @param value
     * @param tolerance
     * @returns {boolean}
     */
    export function isOne(value: number, tolerance: number = 0): boolean {
        return (value + tolerance >= 1) && (value - tolerance <= 1);
    }
}
