module zanejs {

    /**
     *
     * @param {string} name
     * @returns {any}
     */
    export function getCookie(name: string): any {
        name = name + '=';
        var carray = document.cookie.split(';');
        for (var i = 0; i < carray.length; i++) {
            var c = carray[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    }
}
