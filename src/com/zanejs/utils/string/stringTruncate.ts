/**
 * 根据指定长度返回截断的字符串。
 * @param value
 * @param length
 * @param suffix
 * @returns {string}
 */
import rtrim from './rtrim';

export default function stringTruncate(value: string, length: number, suffix: string = '...'): string {
    let out: string = '';
    let l: number = length;

    if (value) {
        l -= suffix.length;
        let trunc: string = value;
        if (trunc.length > l) {
            trunc = trunc.substr(0, l);
            if (/[^\s]/.test(value.charAt(l))) {
                trunc = rtrim(trunc.replace(/\w+$|\s+$/, ''));
            }
            trunc += suffix;
        }
        out = trunc;
    }
    return out;
}
