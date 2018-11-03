module zanejs {

    /**
     * 生成一组随机数字字符。
     * @param amount
     * @returns {string}
     */
    export function randomNumberString(amount: number): string {
        let str: string = '';
        for (let i: number = 0; i < amount; i++) {
            str += String.fromCharCode(Math.round(Math.random() * (57 - 48)) + 48);
        }
        return str;
    }
}
