module zanejs {

    /**
     * 是否字符串
     * @param obj
     * @returns {boolean}
     */
    export function isString(obj: any): boolean {
        return Object.prototype.toString.call(obj) === '[object String]';
    }
}
