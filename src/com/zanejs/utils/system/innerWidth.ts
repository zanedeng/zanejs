module zanejs {

    /**
     * 获取浏览器的宽度
     * @returns {number}
     */
    export function innerWidth(): number {
        let _width;
        if (window.innerWidth) {
            _width = window.innerWidth;
        } else {
            if (document.compatMode === 'CSS1Compat') {
                _width = document.documentElement.clientWidth;
            } else {
                _width = document.body.clientWidth;
            }
        }
        return _width;
    }
}
