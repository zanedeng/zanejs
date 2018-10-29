
export default function removeAllWhiteSpaces(str: string, replace: string = ''): string {
    str = str || '';
    return str.replace(/\s+/g, replace);
}
