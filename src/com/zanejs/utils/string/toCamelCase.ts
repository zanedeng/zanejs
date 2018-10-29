import toProperCase from './toProperCase';

export default function toCamelCase(str: string): string {
    str = str || '';
    str = str.replace('-', ' ');
    str = toProperCase(str).replace(' ', '');
    // lowercase first letter
    function capsFn(): string {
        return arguments[0].toLowerCase();
    }
    return str.replace(/\b\w/g, capsFn);
}
