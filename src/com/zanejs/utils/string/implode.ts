/**
 *  将一个一维数组的值转化为字符串
 *
 * example 1: implode(' ', ['Kevin', 'van', 'Zonneveld'])
 * returns 1: 'Kevin van Zonneveld'
 *
 * example 2: implode(' ', {first:'Kevin', last: 'van Zonneveld'})
 * returns 2: 'Kevin van Zonneveld'
 *
 * @param glue - 默认为空的字符串。
 * @param pieces - 你想要转换的数组。
 * @returns {*}
 */
export default function implode (glue: string, pieces: any): any {
    let i = '';
    let retVal = '';
    let tGlue = '';

    if (arguments.length === 1) {
        pieces = glue;
        glue = '';
    }

    if (typeof pieces === 'object') {
        if (Object.prototype.toString.call(pieces) === '[object Array]') {
            return pieces.join(glue);
        }
        Object.keys(pieces).map(key => {
            retVal += tGlue + pieces[key];
            tGlue = glue;
        });
        return retVal;
    }
    return pieces;
}
