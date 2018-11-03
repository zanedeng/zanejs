module zanejs {

    /**
     * 格式化需要在前面补零的数值。
     * addLeadingZeroes(4); // "04"
     * addLeadingZeroes(5, 3); // "0005"
     * addLeadingZeroes(10, 1); // "10"
     * addLeadingZeroes(10, 2); // "010"
     * @param n
     * @param zeroes
     * @returns {string}
     */
    export function addLeadingZeroes(n: number, zeroes: number = 1): string {
        let out: string = n + '';

        if (n < 0 || zeroes < 1) {
            return out;
        }

        while (out.length < zeroes + 1) {
            out = '0' + out;
        }

        return out;
    }
}
