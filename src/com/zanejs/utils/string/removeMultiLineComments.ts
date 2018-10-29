
export default function removeMultiLineComments(str: string, replace: string = ''): string {
    str = str || '';
    return str.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/g, replace);
}
