
export default function removeSpaces(str: string, replace: string = ''): string {
    str = str || '';
    return str.replace(/ +/g, replace);
}
