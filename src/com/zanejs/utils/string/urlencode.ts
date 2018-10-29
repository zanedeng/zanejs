/**
 * 编码 URL 字符串
 *
 * example 1: urlencode('Kevin van Zonneveld!')
 * returns 1: 'Kevin+van+Zonneveld%21'
 *
 * example 2: urlencode('http://kvz.io/')
 * returns 2: 'http%3A%2F%2Fkvz.io%2F'
 *
 * example 3: urlencode('http://www.google.nl/search?q=Locutus&ie=utf-8')
 * returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3Dutf-8'
 *
 * @param str - 要编码的字符串。
 * @returns {string}
 */
export default function urlencode (str: string) {
    str = (str + '');
    return encodeURIComponent(str)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A')
        .replace(/%20/g, '+');
}
