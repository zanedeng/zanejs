module zanejs {

    /**
     * 是否对象
     * @param obj
     * @returns {boolean}
     */
    export function isObject(obj: any): boolean {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
}
