module zanejs {

    export function toObject(objString: string): any {
        let o: any = { };
        objString = objString.replace(/\{|\}/g, '');
        let tmpArr: any[] = objString.split(',');
        let n: number = tmpArr.length;
        while (n--) {
            tmpArr[n] = (tmpArr[n]).toString().split(':');
            o[trim(tmpArr[n][0])] = trim(tmpArr[n][1]);
        }
        return o;
    }
}
