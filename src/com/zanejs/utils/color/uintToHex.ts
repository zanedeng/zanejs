/**
 * 将颜色转换为十六进制
 * @param u
 */
export default function uintToHex(u: number) {
    return '#' + u.toString(16).toUpperCase();
}
