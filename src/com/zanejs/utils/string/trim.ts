/**
 * 删除字符串开始和结尾处的空白
 * @param str
 */
export default function trim(str: string): string {
    str = str || '';
    return str.replace(/^\s+|\s+$/g, '');
}
