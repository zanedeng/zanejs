module zanejs {

    /**
     * 格式化一个 GMT/UTC 日期／时间
     * 同 date() 函数完全一样，只除了返回的时间是格林威治标准时（GMT）。
     * 例如当在中国（GMT +0800）运行以下程序时，第一行显示“Jan 01 2000 00:00:00”而第二行显示“Dec 31 1999 16:00:00”。
     *
     * example 1: gmdate('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400); // Return will depend on your timezone
     * returns 1: '07:09:40 m is month'
     *
     * @param format
     * @param timestamp
     * @returns {string}
     */
    export function gmdate(format: string, timestamp: any) {
        let dt = typeof timestamp === 'undefined' ? new Date() // Not provided
            : timestamp instanceof Date ? new Date(timestamp + '') // Javascript Date()
                : new Date(timestamp * 1000 + ''); // UNIX timestamp (auto-convert to int)
        timestamp = Date.parse(dt.toUTCString().slice(0, -4)) / 1000;
        return date(format, timestamp);
    }
}
