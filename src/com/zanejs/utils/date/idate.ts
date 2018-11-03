module zanejs {

    /**
     * 将本地时间日期格式化为整数
     * 根据给定的格式字符对 timestamp 格式化并返回数字结果。timestamp 为可选项，默认值为本地当前时间，即 time() 的值。
     * 和 date() 不同，idate() 只接受一个字符作为 format 参数。
     *
     * example 1: idate('y', 1255633200)
     * returns 1: 9
     *
     * @param format
     * @param timestamp
     * @returns {*}
     */
    export function idate (format: string, timestamp: any) {
        if (format === undefined) {
            throw new Error('idate() expects at least 1 parameter, 0 given');
        }
        if (!format.length || format.length > 1) {
            throw new Error('idate format is one char');
        }

        let _date: any = (typeof timestamp === 'undefined')
            ? new Date()
            : (timestamp instanceof Date)
                ? new Date(timestamp + '')
                : new Date(timestamp * 1000 + '');
        let a, d;

        switch (format) {
            case 'B':
                return Math.floor((
                    (_date.getUTCHours() * 36e2) +
                    (_date.getUTCMinutes() * 60) +
                    _date.getUTCSeconds() + 36e2
                ) / 86.4) % 1e3;
            case 'd':
                return _date.getDate();
            case 'h':
                return _date.getHours() % 12 || 12;
            case 'H':
                return _date.getHours();
            case 'i':
                return _date.getMinutes();
            case 'I':
                // capital 'i'
                // Logic original by getimeofday().
                // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
                // If they are not equal, then DST is observed.
                a = _date.getFullYear();
                let d01: any = new Date(a, 0);
                let d02: any = Date.UTC(a, 0);
                let d61: any = new Date(a, 6);
                let d62: any = Date.UTC(a, 6);
                return d01 - d02 !== d61 - d62;
            case 'L':
                a = _date.getFullYear();
                return (!(a & 3) && (a % 1e2 || !(a % 4e2))) ? 1 : 0;
            case 'm':
                return _date.getMonth() + 1;
            case 's':
                return _date.getSeconds();
            case 't':
                return (new Date(_date.getFullYear(), _date.getMonth() + 1, 0))
                    .getDate();
            case 'U':
                return Math.round(_date.getTime() / 1000);
            case 'w':
                return _date.getDay();
            case 'W':
                a = new Date(
                    _date.getFullYear(),
                    _date.getMonth(),
                    _date.getDate() - (_date.getDay() || 7) + 3
                );
                d = new Date(a.getFullYear(), 0, 4);
                return 1 + Math.round((a - d) / 864e5 / 7);
            case 'y':
                return parseInt(
                    (_date.getFullYear() + '').slice(2), 10); // This function returns an integer, unlike _date()
            case 'Y':
                return _date.getFullYear();
            case 'z':
                d = new Date(_date.getFullYear(), 0, 1);
                return Math.floor((_date - d) / 864e5);
            case 'Z':
                return -_date.getTimezoneOffset() * 60;
            default:
                throw new Error('Unrecognized _date format token');
        }
    }
}
