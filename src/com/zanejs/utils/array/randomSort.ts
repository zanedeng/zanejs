/**
 * 随机排列数组项并返回一个新数组
 * @param arr
 */
export default function randomSort(arr: any[]): any[] {
    function randomize(elementA: any, elementB: any): number {
        let r: number = Math.random();
        if (r < .3333333334) {
            return -1;
        } else if (r > .3333333333 && r < .6666666667) {
            return 0;
        } else {
            return 1;
        }
    }
    return arr.sort(randomize);
}
