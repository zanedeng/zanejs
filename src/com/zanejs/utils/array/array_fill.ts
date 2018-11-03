module zanejs {

    /**
     * 用给定的值填充数组
     *
     * example 1: array_fill(5, 6, 'banana')
     * returns 1: { 5: 'banana', 6: 'banana', 7: 'banana', 8: 'banana', 9: 'banana', 10: 'banana' }
     *
     * @param startIndex - 返回的数组的第一个索引值。
     * @param num - 插入元素的数量。 必须大于 0。
     * @param mixedVal - 用来填充的值。
     * @returns {{}}
     */
    export function array_fill(startIndex: number, num: number, mixedVal: any) {
        let key;
        let tmpArr = {};

        if (!isNaN(startIndex) && !isNaN(num)) {
            for (key = 0; key < num; key++) {
                tmpArr[(key + startIndex)] = mixedVal;
            }
        }
        return tmpArr;
    }
}
