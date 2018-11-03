module zanejs {

    /**
     * 给出一个包含有指向一个文件的全路径的字符串，本函数返回基本的文件名。
     * @param path - 一个路径。在 Windows 中，斜线（/）和反斜线（\）都可以用作目录分隔符。在其它环境下是斜线（/）。
     * @param suffix - 如果文件名是以 suffix 结束的，那这一部分也会被去掉。
     * example 1: basename('/www/site/home.htm', '.htm')
     * returns 1: 'home'
     *
     * example 2: basename('ecra.php?p=1')
     * returns 2: 'ecra.php?p=1'
     *
     * example 3: basename('/some/path/')
     * returns 3: 'path'
     *
     * example 4: basename('/some/path_ext.ext/','.ext')
     * returns 4: 'path_ext'
     *
     * @returns {string}
     */
    export function basename(path: string, suffix: string = null): string {
        let b = path;
        let lastChar = b.charAt(b.length - 1);
        if (lastChar === '/' || lastChar === '\\') {
            b = b.slice(0, -1);
        }
        b = b.replace(/^.*[\/\\]/g, '');
        if (typeof suffix === 'string' && b.substr(b.length - suffix.length) === suffix) {
            b = b.substr(0, b.length - suffix.length);
        }
        return b;
    }
}
