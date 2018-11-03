module zanejs {

    /**
     *
     * @param {string} name
     */
    export function deleteCookie(name: string): void {
        setCookie(name, '', -1);
    }
}
