module zanejs {

    /**
     * 返回当前 Unix 时间戳和微秒数
     *
     * example 1: var $timeStamp = microtime(true)
     * example 1: $timeStamp > 1000000000 && $timeStamp < 2000000000
     * returns 1: true
     *
     * example 2: /^0\.[0-9]{1,6} [0-9]{10,10}$/.test(microtime())
     * returns 2: true
     *
     * @param getAsFloat
     * @returns {*}
     */
    export function microtime(getAsFloat: boolean) {
        let s;
        let now;
        if (typeof performance !== 'undefined' && performance.now) {
            now = (performance.now() + performance.timing.navigationStart) / 1e3;
            if (getAsFloat) {
                return now;
            }
            // Math.round(now)
            s = now | 0;
            return (Math.round((now - s) * 1e6) / 1e6) + ' ' + s;
        } else {
            now = (Date.now ? Date.now() : new Date().getTime()) / 1e3;
            if (getAsFloat) {
                return now;
            }
            // Math.round(now)
            s = now | 0;
            return (Math.round((now - s) * 1e3) / 1e3) + ' ' + s;
        }
    }
}
