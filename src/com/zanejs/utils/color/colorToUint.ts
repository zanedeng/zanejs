module zanejs {

    export function colorToUint(color: string): number {
        if (/^rgb\(\d+\,\d+\,\d+\)/.test(color)) {
            return rgbToUint(color);
        } else if (/^\#(:?\w{6}|\w{3})/.test(color)) {
            return hexToUint(color);
        } else if (/^[a-zA-Z]+/.test(color)) {
            return htmlColorToUint(color);
        } else {
            return uint(color);
        }
    }
}
