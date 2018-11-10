module zanejs {

    export function arrayBufferToString(buffer: ArrayBuffer) {
        return binaryToString(String.fromCharCode.apply(null, Array.prototype.slice.apply(new Uint8Array(buffer))));
    }
}
