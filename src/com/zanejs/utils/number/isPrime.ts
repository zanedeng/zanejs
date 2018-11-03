module zanejs {
    /**
     * 是否素数。
     * @param value
     * @returns {boolean}
     */
    export function isPrime(value: number): boolean {
        if (value === 1 || value === 2) {
            return true;
        }

        if (isEven(value)) {
            return false;
        }

        let s: number = Math.sqrt(value);
        for (let i: number = 3; i <= s; i++) {
            if (value % i === 0) {
                return false;
            }
        }

        return true;
    }
}
