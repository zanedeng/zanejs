module zanejs {

    export function uint(value: any) {
        return parseInt(value, undefined)  >>> 32;
    }
}
