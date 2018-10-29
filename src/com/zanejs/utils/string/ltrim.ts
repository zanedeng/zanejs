/**
 * 删除字符串开始时的空白
 * @param str
 */
export default function ltrim(str: string): string {
    str = str || '';
    return str.replace(/^\s+/, '');
}
