module zanejs {

    /**
     * 解码已编码的 URL 字符串
     *
     * example 1: urldecode('Kevin+van+Zonneveld%21')
     * returns 1: 'Kevin van Zonneveld!'
     *
     * example 2: urldecode('http%3A%2F%2Fkvz.io%2F')
     * returns 2: 'http://kvz.io/'
     *
     * example 3: urldecode('http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3Dutf-' +
     * '8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a')
     * returns 3:
     * 'http://www.google.nl/search?q=Locutus&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a'
     *
     * example 4: urldecode('%E5%A5%BD%3_4')
     * returns 4: '\u597d%3_4'
     *
     * @param str - 要解码的字符串。
     * @returns {string} - 返回解码后的字符串。
     */
    export function urldecode (str: string) {
        return decodeURIComponent((str + '')
            .replace(/%(?![\da-f]{2})/gi, function () {
                return '%25';
            })
            .replace(/\+/g, '%20'));
    }
}
