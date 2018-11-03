module zanejs {

    /**
     * 格式化一个本地时间／日期
     *
     *
     * example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400)
     * returns 1: '07:09:40 m is month'
     *
     * example 2: date('F j, Y, g:i a', 1062462400)
     * returns 2: 'September 2, 2003, 12:26 am'
     *
     * example 3: date('Y W o', 1062462400)
     * returns 3: '2003 36 2003'
     *
     * example 4: var $x = date('Y m d', (new Date()).getTime() / 1000)
     * example 4: $x = $x + ''
     * example 4: var $result = $x.length // 2009 01 09
     * returns 4: 10
     *
     * example 5: date('W', 1104534000)
     * returns 5: '52'
     *
     * example 6: date('B t', 1104534000)
     * returns 6: '999 31'
     *
     * example 7: date('W U', 1293750000.82); // 2010-12-31
     * returns 7: '52 1293750000'
     *
     * example 8: date('W', 1293836400); // 2011-01-01
     * returns 8: '52'
     *
     * example 9: date('W Y-m-d', 1293974054); // 2011-01-02
     * returns 9: '52 2011-01-02'
     *
     * @param format
     * @param timestamp
     * @returns {string|void}
     */
    export function date(format: string, timestamp: any) {
        let jsdate, f;
        let txtWords = [
            'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        let formatChr = /\\?(.?)/gi;
        let formatChrCb = function (t: string, s: number)
        {
            return f[t] ? f[t]() : s;
        };
        let _pad = function (n: any, c: number)
        {
            n = String(n);
            while (n.length < c) {
                n = '0' + n;
            }
            return n;
        };
        f = {
            // 月份中的第几天，有前导零的 2 位数字
            d: function () {
                // Day of month w/leading 0; 01..31
                return _pad(f.j(), 2);
            },
            // 星期中的第几天，文本表示，3 个字母
            D: function () {
                // Shorthand day name; Mon...Sun
                return f.l()
                    .slice(0, 3);
            },
            // 月份中的第几天，没有前导零
            j: function () {
                // Day of month; 1..31
                return jsdate.getDate();
            },
            // 星期几，完整的文本格式
            l: function () {
                // Full day name; Monday...Sunday
                return txtWords[f.w()] + 'day';
            },
            // ISO-8601 格式数字表示的星期中的第几天
            N: function () {
                // ISO-8601 day of week; 1[Mon]..7[Sun]
                return f.w() || 7;
            },
            // 每月天数后面的英文后缀，2 个字符
            S: function () {
                // Ordinal suffix for day of month; st, nd, rd, th
                let j = f.j();
                let i = j % 10;
                if (i <= 3 && parseInt(((j % 100) / 10) + '', 10) === 1) {
                    i = 0;
                }
                return ['st', 'nd', 'rd'][i - 1] || 'th';
            },
            // 星期中的第几天，数字表示
            w: function () {
                // Day of week; 0[Sun]..6[Sat]
                return jsdate.getDay();
            },
            // 年份中的第几天
            z: function () {
                // Day of year; 0..365
                let a: any = new Date(f.Y(), f.n() - 1, f.j());
                let b: any = new Date(f.Y(), 0, 1);
                return Math.round((a - b) / 864e5);
            },

            // ISO-8601 格式年份中的第几周，每周从星期一开始
            W: function () {
                // ISO-8601 week number
                let a: any = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
                let b: any = new Date(a.getFullYear(), 0, 4);
                return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
            },

            // 月份，完整的文本格式，例如 January 或者 March
            F: function () {
                // Full month name; January...December
                return txtWords[6 + f.n()];
            },
            // 数字表示的月份，有前导零
            m: function () {
                // Month w/leading 0; 01...12
                return _pad(f.n(), 2);
            },
            // 三个字母缩写表示的月份
            M: function () {
                // Shorthand month name; Jan...Dec
                return f.F()
                    .slice(0, 3);
            },
            // 数字表示的月份，没有前导零
            n: function () {
                // Month; 1...12
                return jsdate.getMonth() + 1;
            },
            // 给定月份所应有的天数
            t: function () {
                // Days in month; 28...31
                return (new Date(f.Y(), f.n(), 0))
                    .getDate();
            },

            // 是否为闰年
            L: function () {
                // Is leap year?; 0 or 1
                let j = f.Y();
                return (j % 4 === 0) && (j % 100 !== 0) || (j % 400 === 0);
            },
            // ISO-8601 格式年份数字。这和 Y 的值相同，只除了如果 ISO 的星期数（W）属于前一年或下一年，则用那一年。
            o: function () {
                // ISO-8601 year
                let n = f.n();
                let W = f.W();
                let Y = f.Y();
                return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
            },
            // 4 位数字完整表示的年份
            Y: function () {
                // Full year; e.g. 1980...2010
                return jsdate.getFullYear();
            },
            // 2 位数字表示的年份
            y: function () {
                // Last two digits of year; 00...99
                return f.Y()
                    .toString()
                    .slice(-2);
            },

            // 小写的上午和下午值
            a: function () {
                // am or pm
                return jsdate.getHours() > 11 ? 'pm' : 'am';
            },
            // 大写的上午和下午值
            A: function () {
                // AM or PM
                return f.a()
                    .toUpperCase();
            },
            // Swatch Internet 标准时
            B: function () {
                // Swatch Internet time; 000..999
                let H = jsdate.getUTCHours() * 36e2;
                // Hours
                let i = jsdate.getUTCMinutes() * 60;
                // Minutes
                // Seconds
                let s = jsdate.getUTCSeconds();
                return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
            },
            // 小时，12 小时格式，没有前导零
            g: function () {
                // 12-Hours; 1..12
                return f.G() % 12 || 12;
            },
            // 小时，24 小时格式，没有前导零
            G: function () {
                // 24-Hours; 0..23
                return jsdate.getHours();
            },
            // 小时，12 小时格式，有前导零
            h: function () {
                // 12-Hours w/leading 0; 01..12
                return _pad(f.g(), 2);
            },
            // 小时，24 小时格式，有前导零
            H: function () {
                // 24-Hours w/leading 0; 00..23
                return _pad(f.G(), 2);
            },
            // 有前导零的分钟数
            i: function () {
                // Minutes w/leading 0; 00..59
                return _pad(jsdate.getMinutes(), 2);
            },
            // 秒数，有前导零
            s: function () {
                // Seconds w/leading 0; 00..59
                return _pad(jsdate.getSeconds(), 2);
            },
            // 毫秒
            u: function () {
                // Microseconds; 000000-999000
                return _pad(jsdate.getMilliseconds() * 1000, 6);
            },

            // 时区标识
            e: function () {
                // Timezone identifier; e.g. Atlantic/Azores, ...
                // The following works, but requires inclusion of the very large
                // timezone_abbreviations_list() function.
                /*              return that.date_default_timezone_get();
                 */
                let msg = 'Not supported (see source code of date() for timezone on how to add support)';
                throw new Error(msg);
            },
            // 是否为夏令时
            I: function () {
                // DST observed?; 0 or 1
                // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
                // If they are not equal, then DST is observed.
                let a: any = new Date(f.Y(), 0);
                // Jan 1
                let c: any = Date.UTC(f.Y(), 0);
                // Jan 1 UTC
                let b: any = new Date(f.Y(), 6);
                // Jul 1
                // Jul 1 UTC
                let d: any = Date.UTC(f.Y(), 6);
                return ((a - c) !== (b - d)) ? 1 : 0;
            },
            // 与格林威治时间相差的小时数
            O: function () {
                // Difference to GMT in hour format; e.g. +0200
                let tzo = jsdate.getTimezoneOffset();
                let a = Math.abs(tzo);
                return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
            },
            // 与格林威治时间（GMT）的差别，小时和分钟之间有冒号分隔
            P: function () {
                // Difference to GMT w/colon; e.g. +02:00
                let O = f.O();
                return (O.substr(0, 3) + ':' + O.substr(3, 2));
            },
            // 本机所在的时区
            T: function () {
                return 'UTC';
            },
            // 时差偏移量的秒数。
            Z: function () {
                // Timezone offset in seconds (-43200...50400)
                return -jsdate.getTimezoneOffset() * 60;
            },

            // ISO 8601 格式的日期
            c: function () {
                // ISO-8601 date.
                return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
            },
            // RFC 822 格式的日期
            r: function () {
                // RFC 2822
                return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
            },
            // 从 Unix 纪元（January 1 1970 00:00:00 GMT）开始至今的秒数
            U: function () {
                // Seconds since UNIX epoch
                return Math.floor(jsdate / 1000);
            }
        };

        let _date = function (_format: string, _timestamp: any) {
            jsdate = (_timestamp === undefined ? new Date() // Not provided
                    : (_timestamp instanceof Date) ? new Date(_timestamp + '') // JS Date()
                        : new Date(_timestamp * 1000 + '') // UNIX timestamp (auto-convert to int)
            );
            return _format.replace(formatChr, formatChrCb);
        };

        return _date(format, timestamp);
    }
}
