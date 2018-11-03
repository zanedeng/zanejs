module zanejs {

    /**
     * 使用一个字符串分割另一个字符串
     *
     * example 1: explode(' ', 'Kevin van Zonneveld')
     * returns 1: [ 'Kevin', 'van', 'Zonneveld' ]
     *
     * @param delimiter - 边界上的分隔字符。
     * @param str - 输入的字符串。
     * @param limit - 如果设置了 limit 参数并且是正数，则返回的数组包含最多 limit 个元素，而最后那个元素将包含 string 的剩余部分。
     * 如果 limit 参数是负数，则返回除了最后的 -limit 个元素外的所有元素。
     * 如果 limit 是 0，则会被当做 1。
     * @returns {*}
     */
    export function explode (delimiter: any, str: string, limit: number) {
        if (arguments.length < 2 ||
            typeof delimiter === 'undefined' ||
            typeof str === 'undefined') {
            return null;
        }
        if (delimiter === '' ||
            delimiter === false ||
            delimiter === null) {
            return false;
        }
        if (typeof delimiter === 'function' ||
            typeof delimiter === 'object' ||
            typeof str === 'function' ||
            typeof str === 'object') {
            return {0: ''};
        }
        if (delimiter === true) {
            delimiter = '1';
        }

        // Here we go...
        delimiter += '';
        str += '';

        let s = str.split(delimiter);

        if (typeof limit === 'undefined') {
            return s;
        }

        // Support for limit
        if (limit === 0) {
            limit = 1;
        }

        // Positive limit
        if (limit > 0) {
            if (limit >= s.length) {
                return s;
            }
            return s
                .slice(0, limit - 1)
                .concat([s.slice(limit - 1)
                    .join(delimiter)
                ]);
        }

        // Negative limit
        if (-limit >= s.length) {
            return [];
        }
        s.splice(s.length + limit);
        return s;
    }

}
