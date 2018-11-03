module zanejs {

    export function removeTabs(str: string, replace: string = ''): string {
        str = str || '';
        return str.replace(/\t+/g, replace);
    }
}
