module zanejs {

    /**
     * 移除数组中重复的值
     *
     * example 1: array_unique(['Kevin','Kevin','van','Zonneveld','Kevin'])
     * returns 1: {0: 'Kevin', 2: 'van', 3: 'Zonneveld'}
     *
     * example 2: array_unique({'a': 'green', 0: 'red', 'b': 'green', 1: 'blue', 2: 'red'})
     * returns 2: {a: 'green', 0: 'red', 1: 'blue'}
     *
     * @param inputArr
     * @returns {{}}
     */
    export function array_unique(inputArr: any) {
        let tmpArr2 = {};
        let _arraySearch = function (needle: any, haystack: any) {
            Object.keys(haystack).map(key => {
                if ((haystack[key] + '') === (needle + '')) {
                    return key;
                }
            });
            return false;
        };

        Object.keys(inputArr).map(key => {
            let val = inputArr[key];

            if (_arraySearch(val, tmpArr2) === false) {
                tmpArr2[key] = val;
            }
        });
        return tmpArr2;
    }
}
