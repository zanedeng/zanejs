
export default function removeMultipleSpaces(str: string, replace: string = ' '): string {
    str = str || '';
    return str.replace(/ {2,}/g, replace);
}
