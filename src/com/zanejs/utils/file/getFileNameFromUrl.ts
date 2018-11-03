module zanejs {

    /**
     *
     * @param url
     * @returns {string}
     */
    export function getFileNameFromUrl(url: string) {
        if (url) {
            return url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
        }
        return '';
    }
}
