import removeSingleLineComments from './removeSingleLineComments';
import removeMultiLineComments from './removeMultiLineComments';

export default function removeAllComments(str: string, replace: string = ''): string {
    str = str || '';
    return removeMultiLineComments(removeSingleLineComments(str, replace), replace);
}
