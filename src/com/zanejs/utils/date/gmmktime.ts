module zanejs {

    /**
     * 取得 GMT 日期的 UNIX 时间戳
     * 和 mktime() 完全一样，只除了返回值是格林威治标准时的时间戳。
     *
     * example 1: gmmktime(14, 10, 2, 2, 1, 2008)
     * returns 1: 1201875002
     *
     * example 2: gmmktime(0, 0, -1, 1, 1, 1970)
     * returns 2: -1
     *
     * @returns {*}
     */
    export function gmmktime(...args: any[]): any {
        let d = new Date();
        let e = ['Hours', 'Minutes', 'Seconds', 'Month', 'Date', 'FullYear'];

        for (let i = 0; i < e.length; i++) {
            if (typeof args[i] === 'undefined') {
                args[i] = d['getUTC' + e[i]]();
                // +1 to fix JS months.
                args[i] += (i === 3);
            } else {
                args[i] = parseInt(args[i], 10);
                if (isNaN(args[i])) {
                    return false;
                }
            }
        }

        // Map years 0-69 to 2000-2069 and years 70-100 to 1970-2000.
        args[5] += (args[5] >= 0 ? (args[5] <= 69 ? 2e3 : (args[5] <= 100 ? 1900 : 0)) : 0);

        // Set year, month (-1 to fix JS months), and date.
        // !This must come before the call to setHours!
        d.setUTCFullYear(args[5], args[3] - 1, args[4]);

        // Set hours, minutes, and seconds.
        d.setUTCHours(args[0], args[1], args[2]);

        let _time = d.getTime();
        // Divide milliseconds by 1000 to return seconds and drop decimal.
        // Add 1 second if negative or it'll be off from PHP by 1 second.
        return Math.floor(_time / 1e3) - (_time < 0 ? 1 : 0);
    }
}
