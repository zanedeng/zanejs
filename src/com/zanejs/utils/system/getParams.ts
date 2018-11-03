module zanejs {

    /**
     * 获取当前页面由网址传递过来的参数
     */
    export function getParams() {
        return getUrlParams(document.location.href);
    }

}
