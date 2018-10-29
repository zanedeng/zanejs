import getQualifiedClassName from '../object/getQualifiedClassName';

export default function toStringArray(arr: any): string {
    let str: string = '[';
    function checkType(item: any, index: number, array: any[]): void {
        str += (!index) ? '' : ',';
        switch (getQualifiedClassName(item)) {
            case 'Array':
                str += '[';
                item.forEach(checkType);
                str += ']';
                break;
            case 'Object':
                str += '{';
                Object.keys(item).map(prop => {
                    str += prop + ':';
                    checkType(item[prop], 0, []);
                    str += ',';
                });
                str = str.substr(0, str.length - 1) + '}';
                break;
            case 'String':
                str += '\'' + item + '\'';
                break;
            case 'void':
                break;
            default:
                str += item;
        }
    }
    arr.forEach(checkType);
    return str + ']';
}
