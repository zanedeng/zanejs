module zanejs {

    /**
     * 统计数组中所有的值出现的次数
     *
     * example 1: array_count_values([ 3, 5, 3, "foo", "bar", "foo" ])
     * returns 1: {3:2, 5:1, "foo":2, "bar":1}
     *
     * example 2: array_count_values({ p1: 3, p2: 5, p3: 3, p4: "foo", p5: "bar", p6: "foo" })
     * returns 2: {3:2, 5:1, "foo":2, "bar":1}
     *
     * example 3: array_count_values([ true, 4.2, 42, "fubar" ])
     * returns 3: {42:1, "fubar":1}
     *
     * @param array - 统计这个数组的值
     * @returns {{}} 返回一个数组，该数组用 input 数组中的值作为键名，该值在 input 数组中出现的次数作为值。
     */
    export function array_count_values(array: any) {
        let tmpArr = {};
        let key = '';

        let _getType = function (obj: any) {
            let _t: string = typeof obj;
            _t = _t.toLowerCase();
            if (_t === 'object') {
                _t = 'array';
            }
            return _t;
        };

        let _countValue = function (_tmpArr: any, value: any) {
            if (typeof value === 'number') {
                if (Math.floor(value) !== value) {
                    return;
                }
            } else if (typeof value !== 'string') {
                return;
            }

            if (value in _tmpArr && _tmpArr.hasOwnProperty(value)) {
                ++_tmpArr[value];
            } else {
                _tmpArr[value] = 1;
            }
        };

        let t = _getType(array);
        if (t === 'array') {
            for (key in array) {
                if (array.hasOwnProperty(key)) {
                    _countValue.call(this, tmpArr, array[key]);
                }
            }
        }

        return tmpArr;
    }
}
