///<reference path="isIE.ts"/>
module zanejs {

    /**
     *
     * @returns {boolean}
     * @private
     */
    function _isQQBrowser() {
        return ua.match(/MQQBrowser/i) != null;
    }

    /**
     * 是否QQ浏览器
     * @type {boolean}
     */
    export let isQQBrowser = _isQQBrowser();
}
