module zanejs {

    export function stringToXMLDom(str: string): any {
        let xmlDoc = null;
        if ((window as any).DOMParser) {
            let parser = new DOMParser();
            xmlDoc = parser.parseFromString(str, 'text/xml');
        } else {
            // Internet Explorer
            let ActiveXObject = (window as any).ActiveXObject;
            xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
            xmlDoc.async = 'false';
            xmlDoc.loadXML(str);
        }
        return xmlDoc;
    }
}
