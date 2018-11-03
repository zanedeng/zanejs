///<reference path="isIE.ts"/>
module zanejs {

    /**
     *
     * @returns {boolean}
     * @private
     */
    function  _isChrome() {
        return ua.match(/chrome/i) != null;
    }

    /**
     * 是否 Chrome 浏览器
     * @type {boolean}
     */
    export let isChrome = _isChrome();
}
