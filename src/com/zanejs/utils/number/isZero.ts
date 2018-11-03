module zanejs {

    /**
     * 是否等于0
     * @param value
     * @param tolerance
     * @returns {boolean}
     */
    export function isZero(value: number, tolerance: number = 0): boolean {
        return (value < tolerance) && (value > -tolerance);
    }
}
