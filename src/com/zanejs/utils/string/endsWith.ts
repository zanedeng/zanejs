/**
 * 判断指定字符串是否以 suffix 后缀结尾。
 * @param input
 * @param suffix
 * @returns {boolean}
 */
export default function endsWith(input: string, suffix: string): boolean {
    return (suffix === input.substring(input.length - suffix.length));
}
