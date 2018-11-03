module zanejs {

    /**
     * 计算数组的交集
     *
     * example 1: let $array1 = {'a' : 'green', 0:'red', 1: 'blue'}
     * example 1: let $array2 = {'b' : 'green', 0:'yellow', 1:'red'}
     * example 1: let $array3 = ['green', 'red']
     * example 1: let $result = array_intersect($array1, $array2, $array3)
     * returns 1: {0: 'red', a: 'green'}
     *
     * @param arr1
     * @returns {{}}
     */
    export function array_intersect(...args: any[]) {
        let retArr = {};
        let arr1 = args[0];
        let argl = args.length;
        let arglm1 = argl - 1;

        function arr1keys() {
            Object.keys(arr1).map(k1 => {
                function arrs() {
                    for (let i = 1; i < argl; i++) {
                        let arr = arguments[i];
                        for (let k in arr) {
                            if (arr[k] === arr1[k1]) {
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
