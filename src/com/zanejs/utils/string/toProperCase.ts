module zanejs {

    export function toProperCase(str: string): string {
        str = str || '';
        function capsFn(): string {
            return arguments[0].toUpperCase();
        }
        // replaces first letter of each word
        return str.toLowerCase().replace(/^[a-z\xE0-\xFF]|\s[a-z\xE0-\xFF]/g, capsFn);
    }
}
