module zanejs {

    export function rgbToHex(rgb: string): string {
        return uintToHex(rgbToUint(rgb));
    }
}
