module zanejs {

    export function stringToUint8Array(str: string) {
        var binary, binLen, buffer, chars, i, _i;
        binary = stringToBinary(str);
        binLen = binary.length;
        buffer = new ArrayBuffer(binLen);
        chars  = new Uint8Array(buffer);
        for (i = _i = 0; 0 <= binLen ? _i < binLen : _i > binLen; i = 0 <= binLen ? ++_i : --_i) {
            chars[i] = String.prototype.charCodeAt.call(binary, i);
        }
        return chars;
    }
}
