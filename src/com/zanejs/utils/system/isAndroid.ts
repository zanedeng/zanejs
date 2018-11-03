///<reference path="isIE.ts"/>
module zanejs {

    /**
     *
     * @returns {boolean}
     * @private
     */
    function  _isAndroid() {
        return ua.match(/android/i) != null;
    }

    /**
     * 是否 Android 系统
     * @type {boolean}
     */
    export let isAndroid = _isAndroid();
}
