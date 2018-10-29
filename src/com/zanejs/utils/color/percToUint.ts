/**
 * 将百分比转换为十六进制数
 * @param perc
 */
import uint from '../number/uint';

export default function percToUint(perc: string): number {
    let x = uint(perc.replace('%', ''));
    return uint(x * 2.55);
}
