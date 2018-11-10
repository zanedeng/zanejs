module zanejs {

    export function stringToBinary(str: string) {
        var chars, code, i, isUCS2, len, _i;
        len = str.length;
        chars = [];
        isUCS2 = false;
        for (i = _i = 0; 0 <= len ? _i < len : _i > len; i = 0 <= len ? ++_i : --_i) {
            code = String.prototype.charCodeAt.call(str, i);
            if (code > 255) {
                isUCS2 = true;
                chars = null;
                break;
            } else {
                chars.push(code);
            }
        }
        if (isUCS2 === true) {
            return unescape(encodeURIComponent(str));
        } else {
            return String.fromCharCode.apply(null, Array.prototype.slice.apply(chars));
        }
    }
}
