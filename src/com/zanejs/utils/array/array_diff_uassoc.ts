module zanejs {

    /**
     * 用用户提供的回调函数做索引检查来计算数组的差集
     *
     * example 1: let $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
     * example 1: let $array2 = {a: 'GREEN', B: 'brown', 0: 'yellow', 1: 'red'}
     * example 1: array_diff_uassoc($array1, $array2, function (key1, key2) {
     *      return (key1 === key2 ? 0 : (key1 > key2 ? 1 : -1))
     *  })
     * returns 1: {b: 'brown', c: 'blue', 0: 'red'}
     *
     * @param args
     * @returns {{}}
     */
    export function array_diff_uassoc(...args: any[]) {
        let retArr = {};
        let arr1 = args[0];
        let arglm1 = args.length - 1;
        let cb = args[arglm1];
        let arr = {};

        cb = (typeof cb === 'string')
            ? window[cb]
            : (Object.prototype.toString.call(cb) === '[object Array]')
                ? window[cb[0]][cb[1]]
                : cb;

        function arr1keys() {
            Object.keys(arr1).map(k1 => {
                for (let i = 1; i < arglm1; i++) {
                    arr = args[i];
                    for (let k in arr) {
                        if (arr[k] === arr1[k1] && cb(k, k1) === 0) {
                            arr1keys();
                        }
                    }
                    retArr[k1] = arr1[k1];
                }
            });
        }
        arr1keys();
        return retArr;
    }
}
