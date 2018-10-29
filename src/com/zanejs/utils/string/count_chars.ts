/**
 * 返回字符串所用字符的信息
 *
 * example 1: count_chars("Hello World!", 3)
 * returns 1: " !HWdelor"
 *
 * example 2: count_chars("Hello World!", 1)
 * returns 2: {32:1,33:1,72:1,87:1,100:1,101:1,108:3,111:2,114:1}
 *
 * @param str - 需要统计的字符串。
 * @param mode - 参见返回的值。
 * @returns {*}
 * 根据不同的 mode，count_chars() 返回下列不同的结果：
 * 0 - 以所有的每个字节值作为键名，出现次数作为值的数组。
 * 1 - 与 0 相同，但只列出出现次数大于零的字节值。
 * 2 - 与 0 相同，但只列出出现次数等于零的字节值。
 * 3 - 返回由所有使用了的字节值组成的字符串。
 * 4 - 返回由所有未使用的字节值组成的字符串。
 */
export default function count_chars (str: string, mode: number) {
    let result: any = {};
    let resultArr: string[] = [];
    let i;

    let matchArr: any = ('' + str).split('').sort().join('').match(/(.)\1*/g);

    if ((mode & 1) === 0) {
        for (i = 0; i !== 256; i++) {
            result[i] = 0;
        }
    }

    if (mode === 2 || mode === 4) {
        for (i = 0; i !== str.length; i += 1) {
            delete result[matchArr[i].charCodeAt(0)];
        }
        Object.keys(result).map(key => {
            result[key] = (mode === 4) ? String.fromCharCode(Number(key)) : 0;
        });
    } else if (mode === 3) {
        for (i = 0; i !== str.length; i += 1) {
            result[i] = str[i].slice(0, 1);
        }
    } else {
        for (i = 0; i !== str.length; i += 1) {
            result[str[i].charCodeAt(0)] = str[i].length;
        }
    }
    if (mode < 3) {
        return result;
    }

    Object.keys(result).map(key => {
        resultArr.push(result[key]);
    });

    return resultArr.join('');
}
