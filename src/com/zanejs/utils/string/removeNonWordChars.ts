
export default function removeNonWordChars(str: string, replace: string = ''): string {
    str = str || '';
    return str.replace(/[^\w \-\xC0-\xFF]/g, replace);
}
