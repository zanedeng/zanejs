import removeNonWordChars from './removeNonWordChars';
import replaceAccents from './replaceAccents';
import removeMultipleSpaces from './removeMultipleSpaces';

export default function toPathFormat(...rest: any[]): string {
    let path: string = '/';

    // adds a "/" after each path name and remove non word chars
    for (let i: number = 0; i < rest.length; i++) {
        path += (rest[i]) ? removeNonWordChars(rest[i]) + '/' : '';
    }

    path = replaceAccents(path);
    path = removeMultipleSpaces(path);
    path = path.toLowerCase().replace(/\s/g, '-'); // converts to lowercase and replaces all " " to "-"

    return path;
}
