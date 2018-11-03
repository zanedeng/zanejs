module zanejs {

    /**
     * 用回调函数过滤数组中的单元
     *
     * example 1: let odd = function (num) {return (num & 1);}
     * example 1: array_filter({"a": 1, "b": 2, "c": 3, "d": 4, "e": 5}, odd)
     * returns 1: {"a": 1, "c": 3, "e": 5}
     *
     * example 2: let even = function (num) {return (!(num & 1));}
     * example 2: array_filter([6, 7, 8, 9, 10, 11, 12], even)
     * returns 2: [ 6, , 8, , 10, , 12 ]
     *
     * example 3: array_filter({"a": 1, "b": false, "c": -1, "d": 0, "e": null, "f":'', "g":undefined})
     * returns 3: {"a":1, "c":-1}
     * @param arr
     * @param func
     * @returns {{}}
     */
    export function array_filter(arr: any[], func: (v: any) => any) {
        let retObj = {};
        let k;

        func = func || function (v: any) {
            return v;
        };

        if (Object.prototype.toString.call(arr) === '[object Array]') {
            retObj = [];
        }

        for (k in arr) {
            if (func(arr[k])) {
                retObj[k] = arr[k];
            }
        }

        return retObj;
    }
}
