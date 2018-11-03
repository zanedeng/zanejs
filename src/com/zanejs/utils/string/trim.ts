module zanejs {

    /**
     * 删除字符串开始和结尾处的空白
     * @param str
     */
    export function trim(str: string): string {
        str = str || '';
        return str.replace(/^\s+|\s+$/g, '');
    }
}
