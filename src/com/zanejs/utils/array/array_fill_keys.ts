module zanejs {

    /**
     * 使用指定的键和值填充数组
     *
     * example 1: let $keys = {'a': 'foo', 2: 5, 3: 10, 4: 'bar'}
     * example 1: array_fill_keys($keys, 'banana')
     * returns 1: {"foo": "banana", 5: "banana", 10: "banana", "bar": "banana"}
     *
     * @param keys - 使用该数组的值作为键。非法值将被转换为字符串。
     * @param value - 填充使用的值
     * @returns {{}}
     */
    export function array_fill_keys(keys: string[], value: any) {
        let retObj = {};
        Object.keys(keys).map(key => {
            retObj[keys[key]] = value;
        });
        return retObj;
    }
}
