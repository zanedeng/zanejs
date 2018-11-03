module zanejs {

    export function replaceAccents(str: string): string {
        str = str || '';

        // verifies if the String has accents and replace accents
        if (str.search(/[\xC0-\xFF]/g) > -1) {
            str = str.replace(/[\xC0-\xC5]/g, 'A');
            str = str.replace(/[\xC6]/g, 'AE');
            str = str.replace(/[\xC7]/g, 'C');
            str = str.replace(/[\xC8-\xCB]/g, 'E');
            str = str.replace(/[\xCC-\xCF]/g, 'I');
            str = str.replace(/[\xD0]/g, 'D');
            str = str.replace(/[\xD1]/g, 'N');
            str = str.replace(/[\xD2-\xD6\xD8]/g, 'O');
            str = str.replace(/[\xD9-\xDC]/g, 'U');
            str = str.replace(/[\xDD]/g, 'Y');
            str = str.replace(/[\xDE]/g, 'P');
            str = str.replace(/[\xE0-\xE5]/g, 'a');
            str = str.replace(/[\xE6]/g, 'ae');
            str = str.replace(/[\xE7]/g, 'c');
            str = str.replace(/[\xE8-\xEB]/g, 'e');
            str = str.replace(/[\xEC-\xEF]/g, 'i');
            str = str.replace(/[\xF1]/g, 'n');
            str = str.replace(/[\xF2-\xF6\xF8]/g, 'o');
            str = str.replace(/[\xF9-\xFC]/g, 'u');
            str = str.replace(/[\xFE]/g, 'p');
            str = str.replace(/[\xFD\xFF]/g, 'y');
        }
        return str;
    }
}
