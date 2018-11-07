module zanejs {

    /**
     * 字符左侧补全。
     * @param value
     * @param padChar
     * @param length
     * @returns {string}
     */
    export function padLeft(value: string, padChar: string, length: number): string {
        let s: string = value + '';
        while (s.length < length) {
            s = padChar + s;
        }
        return s;
    }
}
