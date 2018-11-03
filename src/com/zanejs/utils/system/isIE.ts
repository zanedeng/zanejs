module zanejs {

    export let ua: string = typeof navigator !== 'undefined' ? navigator.userAgent : '';

    /**
     *
     * @returns {boolean}
     * @private
     */
    function  _isIE() {
        return ua.match(/msie/i) != null;
    }

    /**
     * 是否 IE 浏览器
     * @type {boolean}
     */
    export let isIE = _isIE();
}
