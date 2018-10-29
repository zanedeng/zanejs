import getQualifiedClassName from '../object/getQualifiedClassName';

export default function removeEmptyItems(arr: any[]) {
    function isNotEmpty(item: any, index: number, array: any[]): boolean {
        return getQualifiedClassName(item) === void 0 ? false : true;
    }
    return arr.filter(isNotEmpty);
}
