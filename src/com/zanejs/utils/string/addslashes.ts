/**
 * 使用反斜线引用字符串
 * 返回字符串，该字符串为了数据库查询语句等的需要在某些字符前加上了反斜线。这些字符是单引号（'）、双引号（"）、反斜线（\）与 NUL（NULL 字符）。
 * 一个使用 addslashes() 的例子是当你要往数据库中输入数据时。 例如，将名字 O'reilly 插入到数据库中，这就需要对其进行转义。
 *
 * example 1: addslashes("kevin's birthday")
 * returns 1: "kevin\\'s birthday"
 *
 * @param str - 要转义的字符。
 * @returns {string} - 返回转义后的字符
 */
export default function addslashes (str: string) {
    return (str + '')
        .replace(/[\\"']/g, '\\$&')
        .replace(/\u0000/g, '\\0');
}
