/**
 * 比较2个数组, 检查2个数组是否在同一顺序，并具有相同的类型和值
 * @param arr1
 * @param arr2
 */
export default function compare(arr1: any[], arr2: any[]) {
    if (arr1.length !== arr2.length) {
        return false;
    } else {
        let n: number = arr1.length;
        for (let i: number = 0; i < n; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
    }
    return true;
}
