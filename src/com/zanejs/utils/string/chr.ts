/**
 * 返回相对应于 ascii 所指定的单个字符。
 *
 * example 1: chr(75) === 'K'
 * example 1: chr(65536) === '\uD800\uDC00'
 * returns 1: true
 *
 * @param codePt
 * @returns {string}
 */
export default function chr (codePt: number) {
    if (codePt > 0xFFFF) {
        codePt -= 0x10000;
        return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
    }
    return String.fromCharCode(codePt);
}
