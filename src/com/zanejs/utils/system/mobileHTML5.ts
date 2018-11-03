///<reference path="isIOS.ts"/>
///<reference path="isAndroid.ts"/>
///<reference path="isIE.ts"/>
module zanejs {

    /**
     *
     * @returns {boolean}
     * @private
     */
    function _mobileHTML5() {
        return (ua.match(/(mobile|pre\/|xoom)/i) != null || isIOS || isAndroid);
    }

    /**
     * 移动设备上的HTML5
     * @returns {boolean}
     */
    export let mobileHTML5 = _mobileHTML5();
}
