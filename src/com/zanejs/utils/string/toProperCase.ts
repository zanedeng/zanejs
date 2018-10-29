
export default function toProperCase(str: string): string {
    str = str || '';
    function capsFn(): string {
      return arguments[0].toUpperCase();
    }
    return str.toLowerCase().replace(/^[a-z\xE0-\xFF]|\s[a-z\xE0-\xFF]/g, capsFn); // replaces first letter of each word
}
