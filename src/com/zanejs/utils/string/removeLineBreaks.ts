module zanejs {

    export function removeLineBreaks(str: string, replace: string = ''): string {
        str = str || '';
        return str.replace(/\r|\n/g, replace);
    }
}
