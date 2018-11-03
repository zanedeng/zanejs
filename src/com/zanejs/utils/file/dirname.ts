module zanejs {

    /**
     * 给出一个包含有指向一个文件的全路径的字符串，本函数返回去掉文件名后的目录名。
     * @param path - 一个路径。在 Windows 中，斜线（/）和反斜线（\）都可以用作目录分隔符。在其它环境下是斜线（/）。
     * example 1: dirname('/etc/passwd')
     * returns 1: '/etc'
     * example 2: dirname('c:/Temp/x')
     * returns 2: 'c:/Temp'
     * example 3: dirname('/dir/test/')
     * returns 3: '/dir'
     * @returns {string}
     */
    export function dirname(path: string): string {
        return path.replace(/\\/g, '/')
            .replace(/\/[^\/]*\/?$/, '');
    }
}
