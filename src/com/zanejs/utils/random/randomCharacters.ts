module zanejs {

    /**
     * 从指定字符中随机指定长度的字符串。
     * @param amount
     * @param charSet
     * @returns {string}
     */
    export function randomCharacters(
        amount: number,
        charSet: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'): string {
        let alphabet: string[] = charSet.split('');
        let alphabetLength: number = alphabet.length;
        let randomLetters: string = '';

        for (let j: number = 0; j < amount; j++) {
            let r: number = Math.random() * alphabetLength;
            let s: number = Math.floor(r);
            randomLetters += alphabet[s];
        }

        return randomLetters;
    }
}
