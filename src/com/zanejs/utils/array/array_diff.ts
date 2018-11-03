module zanejs {

    /**
     * 计算数组的差集
     *
     * example 1: array_diff(['Kevin', 'van', 'Zonneveld'], ['van', 'Zonneveld'])
     * returns 1: {0:'Kevin'}
     *
     * @param args
     * @returns {{}}
     */
    export function array_diff(...args: any[]) {
        let retArr = {};
        let arr1 = args[0];
        let argLen = args.length;
        let arr = {};

        function arr1keys() {
            Object.keys(arr1).map(k1 => {
                for (let i = 1; i < argLen; i++) {
                    arr = args[i];
                    for (let k in arr) {
                        if (arr[k] === arr1[k1]) {
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
