module zanejs {

    /**
     * 创建一个对象，用一个数组的值作为其键名，另一个数组的值作为其值
     *
     * example 1: array_combine([0,1,2], ['kevin','van','zonneveld'])
     * returns 1: {0: 'kevin', 1: 'van', 2: 'zonneveld'}
     *
     * @param keys
     * @param values
     * @returns {*}
     */
    export function array_combine(keys: any[], values: any[]) {
        let newArray = {};

        if (typeof keys !== 'object') {
            return false;
        }

        if (typeof values !== 'object') {
            return false;
        }

        if (typeof keys.length !== 'number') {
            return false;
        }

        if (typeof values.length !== 'number') {
            return false;
        }

        if (!keys.length) {
            return false;
        }

        if (keys.length !== values.length) {
            return false;
        }

        for (let i = 0; i < keys.length; i++) {
            newArray[keys[i]] = values[i];
        }

        return newArray;
    }
}
