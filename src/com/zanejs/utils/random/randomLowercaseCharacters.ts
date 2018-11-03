module zanejs {

    /**
     * 生成一组随机小写字符。
     * @param amount
     * @returns {string}
     */
    export function randomLowercaseCharacters(amount: number): string {
        let str: string = '';
        for (let i: number = 0; i < amount; i++) {
            str += String.fromCharCode(Math.round(Math.random() * (122 - 97)) + 97);
        }
        return str;
    }
}
