
export default function removeSingleLineComments(str: string, replace: string = ''): string {
    str = str || '';
    return str.replace(/\/\/[^\n\r]+/g, replace);
}
