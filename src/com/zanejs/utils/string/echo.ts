module zanejs {

    /**
     * 输出一个或多个字符串
     * @param args
     */
    export function echo (...args: any[]) {
        return console.log(args.join(' '));
    }
}
