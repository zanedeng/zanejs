module zanejs {

    /**
     * 是否空值
     * @param obj
     * @returns {boolean}
     */
    export function isSpecial(obj: any): boolean {
        let undef;
        return obj === undef || obj === null;
    }
}
