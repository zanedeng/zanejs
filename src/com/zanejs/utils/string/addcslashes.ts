/**
 * 以 C 语言风格使用反斜线转义字符串中的字符
 * 返回字符串，该字符串在属于参数 charlist 列表中的字符前都加上了反斜线。
 *
 * // Escape all ASCII within capital A to lower z range, including square brackets
 * example 1: addcslashes('foo[ ]', 'A..z');
 * returns 1: "\\f\\o\\o\\[ \\]"
 *
 * // Only escape z, period, and A here since not a lower-to-higher range
 * example 2: addcslashes("zoo['.']", 'z..A');
 * returns 2: "\\zoo['\\.']"
 *
 * // Escape as octals those specified and less than 32 (0x20) or greater than 126 (0x7E), but not otherwise
 * example 3: addcslashes("@a\u0000\u0010\u00A9", "\0..\37!@\177..\377");
 * returns 3: '\\@a\\000\\020\\302\\251'
 *
 * // Those between 32 (0x20 or 040) and 126 (0x7E or 0176) decimal
 * // value will be backslashed if specified (not octalized)
 * example 4: addcslashes("\u0020\u007E", "\40..\175");
 * returns 4: '\\ ~'
 *
 * example 5: addcslashes("\r\u0007\n", '\0..\37'); // Recognize C escape sequences if specified
 * returns 5: "\\r\\a\\n"
 *
 * example 6: addcslashes("\r\u0007\n", '\0'); // Do not recognize C escape sequences if not specified
 * returns 6: "\r\u0007\n"
 *
 * @param str - 要转义的字符
 * @param charlist - 如果 charlist 中包含有 \n，\r 等字符，将以 C 语言风格转换，
 * 而其它非字母数字且 ASCII 码低于 32 以及高于 126 的字符均转换成使用八进制表示。
 * @returns {string} 返回转义后的字符。
 */
export default function addcslashes (str: string, charlist: string = ''): string {
    let target = '';
    let chrs = [];
    let i = 0;
    let j = 0;
    let c = '';
    let next = '';
    let regExpMatchArray: any = null;
    let rangeBegin: any = '';
    let rangeEnd: any = '';
    let $chr = '';
    let begin = 0;
    let end = 0;
    let octalLength = 0;
    let postOctalPos = 0;
    let cca = 0;
    let escHexGrp: any = [];
    let encoded = '';
    let percentHex = /%([\dA-Fa-f]+)/g;

    let _pad = function ($n: any, $c: any)
    {
        if (($n = $n + '').length < $c) {
            return new Array(++$c - $n.length).join('0') + $n;
        }
        return $n;
    };

    for (i = 0; i < charlist.length; i++) {
        c = charlist.charAt(i);
        next = charlist.charAt(i + 1);
        if (c === '\\' && next && (/\d/).test(next)) {
            // Octal
            regExpMatchArray = charlist.slice(i + 1).match(/^\d+/);
            rangeBegin = regExpMatchArray[0];
            octalLength = rangeBegin.length;
            postOctalPos = i + octalLength + 1;
            if (charlist.charAt(postOctalPos) + charlist.charAt(postOctalPos + 1) === '..') {
                // Octal begins range
                begin = rangeBegin.charCodeAt(0);
                if ((/\\\d/).test(charlist.charAt(postOctalPos + 2) + charlist.charAt(postOctalPos + 3))) {
                    // Range ends with octal
                    regExpMatchArray = charlist.slice(postOctalPos + 3).match(/^\d+/);
                    rangeEnd = regExpMatchArray[0];
                    // Skip range end backslash
                    i += 1;
                } else if (charlist.charAt(postOctalPos + 2)) {
                    // Range ends with character
                    rangeEnd = charlist.charAt(postOctalPos + 2);
                } else {
                    throw new Error('Range with no end point');
                }
                end = rangeEnd.charCodeAt(0);
                if (end > begin) {
                    // Treat as a range
                    for (j = begin; j <= end; j++) {
                        chrs.push(String.fromCharCode(j));
                    }
                } else {
                    // Supposed to treat period, begin and end as individual characters only, not a range
                    chrs.push('.', rangeBegin, rangeEnd);
                }
                // Skip dots and range end (already skipped range end backslash if present)
                i += rangeEnd.length + 2;
            } else {
                // Octal is by itself
                $chr = String.fromCharCode(parseInt(rangeBegin, 8));
                chrs.push($chr);
            }
            // Skip range begin
            i += octalLength;
        } else if (next + charlist.charAt(i + 2) === '..') {
            // Character begins range
            rangeBegin = c;
            begin = rangeBegin.charCodeAt(0);
            if ((/\\\d/).test(charlist.charAt(i + 3) + charlist.charAt(i + 4))) {
                // Range ends with octal
                regExpMatchArray = charlist.slice(i + 4).match(/^\d+/);
                rangeEnd = regExpMatchArray[0];
                // Skip range end backslash
                i += 1;
            } else if (charlist.charAt(i + 3)) {
                // Range ends with character
                rangeEnd = charlist.charAt(i + 3);
            } else {
                throw new Error('Range with no end point');
            }
            end = rangeEnd.charCodeAt(0);
            if (end > begin) {
                // Treat as a range
                for (j = begin; j <= end; j++) {
                    chrs.push(String.fromCharCode(j));
                }
            } else {
                // Supposed to treat period, begin and end as individual characters only, not a range
                chrs.push('.', rangeBegin, rangeEnd);
            }
            // Skip dots and range end (already skipped range end backslash if present)
            i += rangeEnd.length + 2;
        } else {
            // Character is by itself
            chrs.push(c);
        }
    }

    for (i = 0; i < str.length; i++) {
        c = str.charAt(i);
        if (chrs.indexOf(c) !== -1) {
            target += '\\';
            cca = c.charCodeAt(0);
            if (cca < 32 || cca > 126) {
                // Needs special escaping
                switch (c) {
                    case '\n':
                        target += 'n';
                        break;
                    case '\t':
                        target += 't';
                        break;
                    case '\u000D':
                        target += 'r';
                        break;
                    case '\u0007':
                        target += 'a';
                        break;
                    case '\v':
                        target += 'v';
                        break;
                    case '\b':
                        target += 'b';
                        break;
                    case '\f':
                        target += 'f';
                        break;
                    default:
                        // target += _pad(cca.toString(8), 3);break; // Sufficient for UTF-16
                        encoded = encodeURIComponent(c);

                        // 3-length-padded UTF-8 octets
                        if ((escHexGrp = percentHex.exec(encoded)) !== null) {
                            // already added a slash above:
                            target += _pad(parseInt(escHexGrp[1], 16).toString(8), 3);
                        }
                        while ((escHexGrp = percentHex.exec(encoded)) !== null) {
                            target += '\\' + _pad(parseInt(escHexGrp[1], 16).toString(8), 3);
                        }
                        break;
                }
            } else {
                // Perform regular backslashed escaping
                target += c;
            }
        } else {
            // Just add the character unescaped
            target += c;
        }
    }
    return target;
}
