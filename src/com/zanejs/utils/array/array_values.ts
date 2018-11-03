module zanejs {

    /**
     * 返回数组中所有的值
     *
     * example 1: array_values( {firstname: 'Kevin', surname: 'van Zonneveld'} )
     * returns 1: [ 'Kevin', 'van Zonneveld' ]
     *
     * @param input
     * @returns {Array}
     */
    export function array_values(input: any) {
        let tmpArr = [];

        Object.keys(input).map(key => {
            tmpArr[tmpArr.length] = input[key];
        });
        return tmpArr;
    }
}
