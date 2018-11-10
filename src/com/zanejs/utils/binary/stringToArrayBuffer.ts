module zanejs {

    export function stringToArrayBuffer(str: string) {
        return stringToUint8Array(str).buffer;
    }
}
