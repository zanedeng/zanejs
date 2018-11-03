module zanejs {

    /**
     *
     * @returns {Array}
     * @private
     */
    function  _iOSVersion() {
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
            // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
            let v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || '0', 10)];
        }
        return [0, 0, 0];
    }

    /**
     * 获取IOS系统的版本
     * @type {number[]|number[]}
     */
    export let iOSVersion = _iOSVersion();
}
