module zanejs {
    
    /**
     * 把第一个参数作为回调函数调用
     * 第一个参数 callback 是被调用的回调函数，其余参数是回调函数的参数。
     *
     * example 1: call_user_func('isNaN', 'a')
     * returns 1: true
     *
     * @param cb
     * @param parameters
     * @returns {*}
     */
    export function call_user_func (cb: any, parameters: any[]) {
        parameters = Array.prototype.slice.call(arguments, 1);
        return call_user_func_array(cb, parameters);
    }

}
