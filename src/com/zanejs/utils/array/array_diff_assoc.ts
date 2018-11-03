module zanejs {

    /**
     * 带索引检查计算数组的差集
     *
     * example 1: array_diff_assoc({0: 'Kevin', 1: 'van', 2: 'Zonneveld'}, {0: 'Kevin', 4: 'van', 5: 'Zonneveld'})
     * returns 1: {1: 'van', 2: 'Zonneveld'}
     *
     * @param args
     * @returns {{}}
     */
    export function array_diff_assoc(...args: any[]) {
        let retArr = {};
        let arr1 = args[0];
        let argl = args.length;
        let i = 1;
        let k = '';
        let arr = {};

        function arr1keys() {
            Object.keys(arr1).map(k1 => {
                for (i = 1; i < argl; i++) {
                    arr = args[i];
                    for (k in arr) {
                        if (arr[k] === arr1[k1] && k === k1) {
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
