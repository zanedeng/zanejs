module zanejs {

    export function removeAllComments(str: string, replace: string = ''): string {
        str = str || '';
        return removeMultiLineComments(removeSingleLineComments(str, replace), replace);
    }
}
