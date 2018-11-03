///<reference path="isIE.ts"/>
module zanejs {

    function _isOpera() {
        return ua.match(/opera/i) != null;
    }

    /**
     * Opera浏览器
     * @returns {boolean}
     */
    export let isOpera = _isOpera();
}
