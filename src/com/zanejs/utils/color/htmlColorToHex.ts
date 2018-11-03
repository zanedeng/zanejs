module zanejs {

    export function htmlColorToHex(htmlColorName: string): string {
        return getHtmlColors()[htmlColorName.toLowerCase()];
    }

}
