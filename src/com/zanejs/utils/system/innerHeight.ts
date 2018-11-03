module zanejs {

    /**
     * 获取浏览器的高度
     * @returns {number}
     */
    export function innerHeight(): number {
        let _height;
        if (window.innerHeight) {
            _height = window.innerHeight;
        } else {
            if (document.compatMode === 'CSS1Compat') {
                _height = document.documentElement.clientHeight;
            } else {
                _height = document.body.clientHeight;
            }
        }
        return _height;
    }
}
