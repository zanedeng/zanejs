module zanejs {

    /**
     * 用回调函数对键名比较计算数组的差集
     *
     * example 1: let $array1 = {blue: 1, red: 2, green: 3, purple: 4}
     * example 1: let $array2 = {green: 5, blue: 6, yellow: 7, cyan: 8}
     * example 1: array_diff_ukey($array1, $array2, function (key1, key2){
     *      return (key1 === key2 ? 0 : (key1 > key2 ? 1 : -1));
     *  })
     * returns 1: {red: 2, purple: 4}
     *
     * @param args
     * @returns {{}}
     */
    export function array_diff_ukey(...args: any[]) {
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
                        if (cb(k, k1) === 0) {
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
