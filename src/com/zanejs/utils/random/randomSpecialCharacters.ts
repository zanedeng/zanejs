module zanejs {

    /**
     * 生成一组随机特殊字符数。
     * @param amount
     * @returns {string}
     */
    export function randomSpecialCharacters(amount: number): string {
        let str: string = '';
        for (let i: number = 0; i < amount; i++) {
            str += String.fromCharCode(Math.round(Math.random() * (64 - 33)) + 33);
        }
        return str;
    }
}
