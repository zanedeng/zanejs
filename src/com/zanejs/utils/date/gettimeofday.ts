module zanejs {

    /**
     * 取得当前时间
     *
     * example 1: var $obj = gettimeofday()
     * example 1: var $result = ('sec' in $obj && 'usec' in $obj && 'minuteswest' in $obj &&80, 'dsttime' in $obj)
     * returns 1: true
     *
     * example 2: var $timeStamp = gettimeofday(true)
     * example 2: var $result = $timeStamp > 1000000000 && $timeStamp < 2000000000
     * returns 2: true
     *
     * @param returnFloat 当其设为 TRUE 时，会返回一个浮点数而不是一个数组。
     * @returns {*}
     */
    export function gettimeofday(returnFloat: boolean = false): any {
        let t = new Date();
        if (returnFloat) {
            return t.getTime() / 1000;
        }

        // Store current year.
        let y = t.getFullYear();
        let d1: any = new Date(y, 0);
        let d2: any = Date.UTC(y, 0);
        let d3: any = new Date(y, 6);
        let d4: any = Date.UTC(y, 6);
        return {
            sec: t.getUTCSeconds(),
            usec: t.getUTCMilliseconds() * 1000,
            minuteswest: t.getTimezoneOffset(),
            // Compare Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC to see if DST is observed.
            dsttime: d1 - d2 !== d3 - d4
        };
    }
}
