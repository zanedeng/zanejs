
module zanejs {

    /**
     * 合并一个或多个数组
     * 将一个或多个数组的单元合并起来，一个数组中的值附加在前一个数组的后面。返回作为结果的数组。
     * 如果输入的数组中有相同的字符串键名，则该键名后面的值将覆盖前一个值。然而，如果数组包含数字键名，后面的值将不会覆盖原来的值，而是附加到后面。
     * 如果只给了一个数组并且该数组是数字索引的，则键名会以连续方式重新索引。
     * ### 例1
     * ```js
     * let $arr1 = {"color": "red", 0: 2, 1: 4}
     * let $arr2 = {0: "a", 1: "b", "color": "green", "shape": "trapezoid", 2: 4}
     * array_merge($arr1, $arr2)
     * // 返回
     * // {"color": "green", 0: 2, 1: 4, 2: "a", 3: "b", "shape": "trapezoid", 4: 4}
     * ```
     * ### 例2
     * ```js
     * let $arr1 = []
     * let $arr2 = {1: "data"}
     * array_merge($arr1, $arr2)
     * // 返回
     * // {0: "data"}
     * ```
     *
     * @returns {*}
     */
    export function array_merge(...args: any[]) {
        let argl = args.length;
        let arg;
        let retObj = {};
        let k = '';
        let argil = 0;
        let j = 0;
        let i = 0;
        let ct = 0;
        let toStr = Object.prototype.toString;
        let retArr: any = true;

        for (i = 0; i < argl; i++) {
            if (toStr.call(args[i]) !== '[object Array]') {
                retArr = false;
                break;
            }
        }

        if (retArr) {
            retArr = [];
            for (i = 0; i < argl; i++) {
                retArr = Array(retArr).concat(args[i]);
            }
            return retArr;
        }

        for (i = 0, ct = 0; i < argl; i++) {
            arg = args[i];
            if (toStr.call(arg) === '[object Array]') {
                for (j = 0, argil = arg.length; j < argil; j++) {
                    retObj[ct++] = arg[j];
                }
            } else {
                for (k in arg) {
                    if (arg.hasOwnProperty(k)) {
                        if (parseInt(k, 10) + '' === k) {
                            retObj[ct++] = arg[k];
                        } else {
                            retObj[k] = arg[k];
                        }
                    }
                }
            }
        }
        return retObj;
    }
}
