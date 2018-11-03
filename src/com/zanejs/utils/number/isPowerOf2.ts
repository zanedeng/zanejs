module zanejs {

    /**
     *
     * @param args
     */
    export function isPowerOf2(...args: number[]): boolean {
        let result: boolean = true;
        for (let i: number = 0, l: number = args.length; i < l; ++i) {
            let num: number = args[i];
            if (num <= 0 || (num & (num - 1)) !== 0) {
                result = false;
                break;
            }
        }
        return result;
    }
}
