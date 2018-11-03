module zanejs {

    /**
     * 使用键名比较计算数组的差集
     *
     * example 1: array_diff_key({red: 1, green: 2, blue: 3, white: 4}, {red: 5})
     * returns 1: {"green":2, "blue":3, "white":4}
     *
     * example 2: array_diff_key({red: 1, green: 2, blue: 3, white: 4}, {red: 5}, {red: 5})
     * returns 2: {"green":2, "blue":3, "white":4}
     *
     * @param args
     * @returns {{}}
     */
    export function array_diff_key(...args: any[]) {
        let arr1 = args[0];
        let argl = args.length;
        let retArr = {};
        let arr = {};

        function arr1keys() {
            Object.keys(arr1).map(k1 => {
                for (let i = 1; i < argl; i++) {
                    arr = args[i];
                    for (let k in arr) {
                        if (k === k1) {
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
