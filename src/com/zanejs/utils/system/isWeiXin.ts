///<reference path="isIE.ts"/>
module zanejs {

    /**
     *
     * @returns {boolean}
     * @private
     */
    function _isWeiXin() {
        return ua.match(/MicroMessenger/i) != null;
    }

    /**
     * 是否微信内嵌浏览器
     * @type {boolean}
     */
    export let isWeiXin = _isWeiXin();
}
