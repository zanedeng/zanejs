///<reference path="isIE.ts"/>
module zanejs {

    /**
     *
     * @returns {boolean}
     * @private
     */
    function _isWebkit() {
        return ua.match(/webkit/i) != null;
    }

    /**
     * 是否 Webkit 内核的浏览器
     * @type {boolean}
     */
    export let isWebkit = _isWebkit();

}
