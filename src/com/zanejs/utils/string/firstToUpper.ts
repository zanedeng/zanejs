module zanejs {

    /**
     * 字符首字大写
     * @param str
     * @returns {string}
     */
    export function firstToUpper(str: string): string {
        return str.charAt(0).toUpperCase() + str.substr(1);
    }
}
