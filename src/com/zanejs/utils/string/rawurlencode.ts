module zanejs {

    /**
     * 按照 RFC 3986 对 URL 进行编码
     *
     * example 1: rawurlencode('Kevin van Zonneveld!')
     * returns 1: 'Kevin%20van%20Zonneveld%21'
     *
     * example 2: rawurlencode('http://kvz.io/')
     * returns 2: 'http%3A%2F%2Fkvz.io%2F'
     *
     * example 3: rawurlencode('http://www.google.nl/search?q=Locutus&ie=utf-8')
     * returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3Dutf-8'
     *
     * @param str
     * @returns {string}
     */
    export function rawurlencode (str: string) {
        str = (str + '');
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A');
    }
}
