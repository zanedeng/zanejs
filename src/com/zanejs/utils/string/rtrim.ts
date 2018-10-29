/**
 * 删除字符串末端的空白字符（或者其他字符）
 *
 * 不使用第二个参数，rtrim() 仅删除以下字符：
 * " " (ASCII 32 (0x20))，普通空白符。
 * "\t" (ASCII 9 (0x09))，制表符。
 * "\n" (ASCII 10 (0x0A))，换行符。
 * "\r" (ASCII 13 (0x0D))，回车符。
 * "\0" (ASCII 0 (0x00))，NUL 空字节符。
 * "\x0B" (ASCII 11 (0x0B))，垂直制表符。
 *
 * example 1: rtrim('    Kevin van Zonneveld    ')
 * returns 1: '    Kevin van Zonneveld'
 *
 * @param str - 输入字符串。
 * @param charlist - 通过指定 character_mask，可以指定想要删除的字符列表。简单地列出你想要删除的全部字符。使用 .. 格式，可以指定一个范围。
 * @returns {string} - 返回改变后的字符串。
 */
export default function rtrim(str: string, charlist: string = '') {
    charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
        .replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^:])/g, '\\$1');
    let re = new RegExp('[' + charlist + ']+$', 'g');
    return (str + '').replace(re, '');
}

/**
 * rtrim 的别名
 * @param str
 * @param charlist
 * @returns {string}
 */
export function chop(str: string, charlist: string = '') {
    return rtrim(str, charlist);
}
