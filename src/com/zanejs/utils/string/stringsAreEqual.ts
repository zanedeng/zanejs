/**
 * 判断字符 s1 是否与 s2 相同。
 * @param s1 第一个比较字符
 * @param s2 第二个比较字符
 * @param caseSensitive 是否区分大小写
 * @returns {boolean}
 */
export default function stringsAreEqual(s1: string, s2: string, caseSensitive: boolean = false): boolean {
    return (caseSensitive) ? (s1 === s2) : (s1.toUpperCase() === s2.toUpperCase());
}
