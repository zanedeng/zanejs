module zanejs {

    /**
     * 生成一组随机字符。
     * @returns {string}
     */
    export function randomToken(): string {
        return Math.random().toString(36).substr(2);
    }
}
