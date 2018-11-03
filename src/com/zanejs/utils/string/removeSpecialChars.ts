module zanejs {

    export function removeSpecialChars(str: string, replace: string = ''): string {
        str = str || '';
        return str.replace(/[^\w \_\-]/g, replace);
    }
}
