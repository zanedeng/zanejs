/**
 * 从字符串中去掉空格，换行，回车符，
 * @param str
 * @returns {string}
 */
export default function xtrim(str: string = ''): string {
    str = (!str) ? '' : str;

    let o: string = '';
    let TAB: number = 9;
    let LINEFEED: number = 10;
    let CARRIAGE: number = 13;
    let SPACE: number = 32;

    for (let i: number = 0; i < str.length; i++) {
        if (str.charCodeAt(i) !== SPACE &&
            str.charCodeAt(i) !== CARRIAGE &&
            str.charCodeAt(i) !== LINEFEED &&
            str.charCodeAt(i) !== TAB) {
            o += str.charAt(i);
        }
    }
    return o;
}
