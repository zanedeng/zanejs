/**
 * 删除字符串结尾处的空白
 * @param str
 */
export default function rtrim(str: string): string {
    str = str || '';
    return str.replace(/\s+$/, '');
}
