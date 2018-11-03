module zanejs {

    export function htmlColorToUint(htmlColorName: string): number {
        return hexToUint(htmlColorToHex(htmlColorName));
    }

}
