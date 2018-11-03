module zanejs {

    /**
     * 删除字符串开始时的空白
     * @param str
     */
    export function ltrim(str: string): string {
        str = str || '';
        return str.replace(/^\s+/, '');
    }
}
