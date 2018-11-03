module zanejs {

    /**
     * 获取文件的后缀名
     * @param {string} filePath
     */
    export function getExtension(filePath: string): string {
        return filePath.split('.').pop();
    }
}
