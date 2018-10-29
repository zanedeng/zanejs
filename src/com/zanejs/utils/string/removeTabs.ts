
export default function removeTabs(str: string, replace: string = ''): string {
    str = str || '';
    return str.replace(/\t+/g, replace);
}
