///<reference path="isIE.ts"/>
module zanejs {

    /**
     * Safari浏览器
     * @returns {boolean}
     */
    function _isSafari() {
        return (ua.toLowerCase().indexOf('safari') !== -1);
    }

    /**
     * 是否 Safari 浏览器
     * @type {boolean}
     */
    export let isSafari = _isSafari();
}
