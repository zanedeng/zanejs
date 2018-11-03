module zanejs {

    /**
     * 取得日期／时间信息
     *
     * example 1: getdate(1055901520)
     * returns 1: {'seconds': 40, 'minutes': 58, 'hours': 1, 'mday': 18, 'wday': 3,
     * 'mon': 6, 'year': 2003, 'yday': 168, 'weekday': 'Wednesday', 'month': 'June', '0': 1055901520}
     * @param timestamp
     * @returns {{}}
     */
    export function getdate(timestamp: any = undefined) {
        let _w = [ 'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur' ];
        let _m = [ 'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December' ];
        let d: any = ((typeof timestamp === 'undefined') ? new Date()
                : (timestamp instanceof Date) ? new Date(timestamp + '')  // Not provided
                    : new Date(timestamp * 1000 + '') // Javascript Date() // UNIX timestamp (auto-convert to int)
        );
        let w = d.getDay();
        let m = d.getMonth();
        let y = d.getFullYear();
        let d1: any = new Date(y, 0, 1);
        let r: any = {};

        r.seconds = d.getSeconds();
        r.minutes = d.getMinutes();
        r.hours = d.getHours();
        r.mday = d.getDate();
        r.wday = w;
        r.mon = m + 1;
        r.year = y;
        r.yday = Math.floor((d - d1) / 86400000);
        r.weekday = _w[w] + 'day';
        r.month = _m[m];
        r['0'] = parseInt((d.getTime() / 1000) + '', 10);
        return r;
    }
}
