module zanejs {

    /**
     * 返回字符串键名全为小写或大写的数组
     * example 1: array_change_key_case(42)
     * returns 1: false
     *
     * example 2: array_change_key_case([ 3, 5 ])
     * returns 2: [3, 5]
     *
     * example 3: array_change_key_case({ FuBaR: 42 })
     * returns 3: {"fubar": 42}
     *
     * example 4: array_change_key_case({ FuBaR: 42 }, 'CASE_LOWER')
     * returns 4: {"fubar": 42}
     *
     * example 5: array_change_key_case({ FuBaR: 42 }, 'CASE_UPPER')
     * returns 5: {"FUBAR": 42}
     *
     * example 6: array_change_key_case({ FuBaR: 42 }, 2)
     * returns 6: {"FUBAR": 42}
     *
     * @param obj
     * @param cs
     * @returns {*}
     */
    export function object_change_key_case(obj: any, cs: string = 'CASE_LOWER') {
        let tmpArr = {};
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            return obj;
        }

        if (obj && typeof obj === 'object') {
            Object.keys(obj).map(key => {
                let _key = (!cs || cs === 'CASE_LOWER') ? key.toLowerCase() : key.toUpperCase();
                tmpArr[_key] = obj[key];
            });
            return tmpArr;
        }
        return false;
    }
}
