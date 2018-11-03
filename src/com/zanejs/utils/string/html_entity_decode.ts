module zanejs {

    /**
     *
     * example 1: html_entity_decode('Kevin &amp; van Zonneveld')
     * returns 1: 'Kevin & van Zonneveld'
     *
     * example 2: html_entity_decode('&amp;lt;')
     * returns 2: '&lt;'
     *
     * @param string
     * @param quoteStyle
     * @returns {*}
     */
    export function html_entity_decode (str: string, quoteStyle: string = ''): any {
        let tmpStr = str.toString();
        let hashMap = get_html_translation_table('HTML_ENTITIES', quoteStyle);
        if (hashMap === false) {
            return false;
        }

        // @todo: &amp; problem
        // http://locutus.io/php/get_html_translation_table:416#comment_97660
        delete (hashMap['&']);
        hashMap['&'] = '&amp;';

        Object.keys(hashMap).map(symbol => {
            let entity = hashMap[symbol];
            tmpStr = tmpStr.split(entity).join(symbol);
        });
        tmpStr = tmpStr.split('&#039;').join('\'');
        return tmpStr;
    }
}
