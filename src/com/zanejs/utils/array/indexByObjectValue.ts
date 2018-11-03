module zanejs {

    /**
     * 根据数组中 object 对象的属性值获取该元素在数组中的索引位置
     * @param arr
     * @param attribute
     * @param value
     * @returns {number}
     */
    export function indexByObjectValue(arr: Array<any>, attribute: string, value: any): number {
        for (let i: number = 0, l: number = arr.length; i < l; ++i) {
            let o = arr[i];
            if (o[attribute] === value) {
                return i;
            }
        }
        return -1;
    }
}
