module zanejs {

    /**
     * 交换数组中的键和值
     * example 1: array_flip( {a: 1, b: 1, c: 2} )
     * returns 1: {1: 'b', 2: 'c'}
     *
     * @param trans - 要交换键/值对的数组。
     * @returns {{}}
     */
    export function array_flip(trans: any) {
        let key;
        let tmpArr = {};

        for (key in trans) {
            if (!trans.hasOwnProperty(key)) {
                continue;
            }
            tmpArr[trans[key]] = key;
        }

        return tmpArr;
    }
}
