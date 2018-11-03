module zanejs {
    /**
     * 是否为空
     * @param val
     * @returns {boolean}
     */
    export function isEmpty (val: any) {
        if (val) {
            return ((val === null) || val.length === 0 || /^\s+$/.test(val));
        } else {
            return true;
        }
    }
}
