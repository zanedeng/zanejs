module zanejs {

    /**
     * 是否数组
     * @param obj
     * @returns {boolean}
     */
    export function isArray(obj: any): boolean {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
}
