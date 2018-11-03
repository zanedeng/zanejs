module zanejs {

    /**
     * 带索引检查计算数组的交集
     *
     * example 1: let $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
     * example 1: let $array2 = {a: 'green', 0: 'yellow', 1: 'red'}
     * example 1: array_intersect_assoc($array1, $array2)
     *
     * returns 1: {a: 'green'}
     *
     * @param arr1
     * @returns {{}}
     */
    export function array_intersect_assoc(...args: any[]) {
        let retArr = {};
        let arr1 = args[0];
        let argl = args.length;
        let arglm1 = argl - 1;

        function arr1keys() {
            Object.keys(arr1).map(k1 => {
                function arrs() {
                    for (let i = 1; i < argl; i++) {
                        let arr = args[i];
                        for (let k in arr) {
                            if (arr[k] === arr1[k1] && k === k1) {
                                if (i === arglm1) {
                                    retArr[k1] = arr1[k1];
                                }
                                arrs();
                            }
                        }
                        arr1keys();
                    }
                }
                arrs();
            });
        }
        arr1keys();
        return retArr;
    }
}
