import toProperCase from './toProperCase';

export default function toTitleFormat(
    path: string, defaultTitle: string = '', separator: string = ' | '): string {
    path = path || '';

    // Remove empty items of the pathsArr
    function isNotEmpty(item: any, index: number, array: any[]): boolean {
      return (item.length > 0);
    }

    let pathsArr: string[] = path.split('/').filter(isNotEmpty);

    // Adds each path to the title (last path comes first)
    for (let i: number = 0; i < pathsArr.length; i++) {
      defaultTitle = pathsArr[i] + separator + defaultTitle;
    }

    defaultTitle =  defaultTitle.replace(/\-/g, ' ').replace(/\_/g, ' '); // Replaces "-" and "_" to " "
    return toProperCase(defaultTitle);
}
