
export default function uint(value: any) {
    return parseInt(value, undefined)  >>> 32;
}
