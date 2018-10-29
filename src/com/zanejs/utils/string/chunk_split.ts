/**
 * 使用此函数将字符串分割成小块非常有用。例如将 base64_encode() 的输出转换成符合 RFC 2045 语义的字符串。它会在每 chunklen 个字符后边插入 end。
 *
 * example 1: chunk_split('Hello world!', 1, '*')
 * returns 1: 'H*e*l*l*o* *w*o*r*l*d*!*'
 *
 * example 2: chunk_split('Hello world!', 10, '*')
 * returns 2: 'Hello worl*d!*'
 *
 * @param body - 要分割的字符。
 * @param chunklen - 分割的尺寸。
 * @param end - 行尾序列符号。
 * @returns {*} - 返回分割后的字符。
 */
export default function chunk_split (body: string, chunklen: number, end: string): any {
    chunklen = parseInt(String(chunklen), 10) || 76;
    end = end || '\r\n';
    if (chunklen < 1) {
        return false;
    }
    let regExpMatchArray: any = body.match(new RegExp('.{0,' + chunklen + '}', 'g'));
    return regExpMatchArray.join(end);
}
