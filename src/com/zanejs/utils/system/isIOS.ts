///<reference path="isIE.ts"/>
module zanejs {

    /**
     *
     * @returns {boolean}
     * @private
     */
    function  _isIOS() {
        return ua.match(/(ipad|iphone|ipod)/i) != null;
    }

    /**
     * 是否IOS系统
     * @type {boolean}
     */
    export let isIOS = _isIOS();
}
