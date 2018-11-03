module zanejs {

    /**
     * 是否函数
     * @param obj
     * @returns {boolean}
     */
    export function isFunction(obj: any): boolean {
        return Object.prototype.toString.call(obj) === '[object Function]';
    }
}
