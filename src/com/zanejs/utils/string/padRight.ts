/**
 * 字符右侧补全。
 * @param value
 * @param padChar
 * @param length
 * @returns {string}
 */
export default function padRight(value: string, padChar: string, length: number): string {
    let s: string = value;
    while (s.length < length) {
        s += padChar;
    }
    return s;
}
