module zanejs {

    /**
     * 调用回调函数，并把一个数组参数作为回调函数的参数
     * 把第一个参数作为回调函数（callback）调用，把参数数组作（param_arr）为回调函数的的参数传入。
     *
     * example 1: call_user_func_array('isNaN', ['a'])
     * returns 1: true
     *
     * example 2: call_user_func_array('isNaN', [1])
     * returns 2: false
     *
     * @param cb - 被调用的回调函数。
     * @param parameters - 要被传入回调函数的数组，这个数组得是索引数组。
     * @returns {*} 返回回调函数的结果。如果出错的话就返回FALSE
     */
    export function call_user_func_array (cb: any, parameters: any[]): any {
        let func;
        let scope = null;

        let validJSFunctionNamePattern = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/;
        if (typeof cb === 'string') {
            if (typeof window[cb] === 'function') {
                func = window[cb];
            } else if (cb.match(validJSFunctionNamePattern)) {
                func = (new Function(null, 'return ' + cb)());
            }
        } else if (Object.prototype.toString.call(cb) === '[object Array]') {
            if (typeof cb[0] === 'string') {
                if (cb[0].match(validJSFunctionNamePattern)) {
                    func = eval(cb[0] + '[\'' + cb[1] + '\']'); // eslint-disable-line no-eval
                }
            } else {
                func = cb[0][cb[1]];
            }

            if (typeof cb[0] === 'string') {
                if (typeof window[cb[0]] === 'function') {
                    scope = window[cb[0]];
                } else if (cb[0].match(validJSFunctionNamePattern)) {
                    scope = eval(cb[0]); // eslint-disable-line no-eval
                }
            } else if (typeof cb[0] === 'object') {
                scope = cb[0];
            }
        } else if (typeof cb === 'function') {
            func = cb;
        }

        if (typeof func !== 'function') {
            throw new Error(func + ' is not a valid function');
        }
        return func.apply(scope, parameters);
    }
}
