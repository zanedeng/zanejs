/**
 *
 * example 1: stripslashes('Kevin\'s code')
 * returns 1: "Kevin's code"
 *
 * example 2: stripslashes('Kevin\\\'s code')
 * returns 2: "Kevin\'s code"
 *
 * @param str
 * @returns {string}
 */
export default function stripslashes (str: string) {
    return (str + '').replace(/\\(.?)/g, function (s: string, n1: any) {
        switch (n1) {
            case '\\':
                return '\\';
            case '0':
                return '\u0000';
            case '':
                return '';
            default:
                return n1;
        }
    });
}
