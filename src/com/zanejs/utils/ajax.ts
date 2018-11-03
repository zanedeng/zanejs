module zanejs {

    export interface IAjaxOptions {
        url: string;
        type?: string;
        data?: any;
        contentType?: string;
        dataType?: string;
        async?: boolean;
        timeOut?: number;
        before?: Function;
        error?: Function;
        success?: Function;
    }

    export function ajax(options: IAjaxOptions) {

        var url: string         = options.url           || '',                      // 请求的链接
            type: string        = (options.type         || 'get').toLowerCase(),    // 请求的方法,默认为get
            data: any           = options.data          || null,                    // 请求的数据
            contentType: string = options.contentType   || '',                      // 请求头
            dataType: string    = options.dataType      || '',                      // 请求的类型
            async: boolean      = options.async === undefined && true,              // 是否异步，默认为true.
            timeOut: any        = options.timeOut,                                  // 超时时间。
            before: any         = options.before        || function() { /*todo*/ }, // 发送之前执行的函数
            error: any          = options.error         || function() {/*todo*/},   // 错误执行的函数
            success: any        = options.success       || function() {/*todo*/},   // 请求成功的回调函数
            timeoutBool: boolean = false,                                            // 是否请求超时
            timeoutFlag: any    = null,                                             // 超时标识
            xhr: any            = null;                                             // xhr对象
        /**
         * 编码数据
         */
        function setData() {
            var name, value;
            if (data) {
                if (typeof data === 'string') {
                    data = data.split('&');
                    for (var i = 0, len = data.length; i < len; i++) {
                        name = data[i].split('=')[0];
                        value = data[i].split('=')[1];
                        data[i] = encodeURIComponent(name) + '=' + encodeURIComponent(value);
                    }
                    data = data.replace('/%20/g', '+');
                } else if (typeof data === 'object') {
                    var arr: any = [];
                    Object.keys(data).map(key => {
                        value = data[key].toString();
                        key = encodeURIComponent(key);
                        value = encodeURIComponent(value);
                        arr.push(key + '=' + value);
                    });
                    data = arr.join('&').replace('/%20/g', '+');
                }
                // 若是使用get方法或JSONP，则手动添加到URL中
                if (type === 'get' || dataType === 'jsonp') {
                    url += url.indexOf('?') > -1 ? data : '?' + data;
                }
            }
        }

        /**
         * JSONP
         */
        function createJsonp() {
            var script = document.createElement('script'),
                timeName = new Date().getTime() + Math.round(Math.random() * 1000),
                callback = 'JSONP_' + timeName;

            (window as any).callback = function($data: any) {
                clearTimeout(timeoutFlag);
                document.body.removeChild(script);
                success($data);
            };
            script.src = url +  (url.indexOf('?') > -1 ? '&' : '?') + 'callback=' + callback;
            script.type = 'text/javascript';
            document.body.appendChild(script);
            setTime(callback, script);
        }

        /**
         * 设置请求超时
         * @param callback
         * @param script
         */
        function setTime(callback: string, script: any) {
            if (timeOut !== undefined) {
                timeoutFlag = setTimeout(
                    function() {
                        if (dataType === 'jsonp') {
                            delete (window as any).callback;
                            document.body.removeChild(script);
                        } else {
                            timeoutBool = true;
                            if (xhr) {
                                xhr.abort();
                            }
                        }
                    },
                    timeOut
                );
            }
        }

        // XHR
        function createXHR() {
            // 由于IE6的XMLHttpRequest对象是通过MSXML库中的一个ActiveX对象实现的。
            // 所以创建XHR对象，需要在这里做兼容处理。
            function getXHR() {
                if (typeof XMLHttpRequest !== 'undefined') {
                    return new XMLHttpRequest();
                } else {
                    // 遍历IE中不同版本的ActiveX对象
                    var versions = ['Microsoft', 'msxm3', 'msxml2', 'msxml1'];
                    for (var i = 0; i < versions.length; i++) {
                        try {
                            let version = versions[i] + '.XMLHTTP';
                            let cls = 'ActiveXObject';
                            return new (window as any).cls(version);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
            }
            // 创建对象。
            xhr = getXHR();
            xhr.responseType = dataType;
            xhr.open(type, url, async);
            // 设置请求头
            if (type === 'post' && !contentType) {
                // 若是post提交，则设置content-Type 为application/x-www-four-urlencoded
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
            } else if (contentType) {
                xhr.setRequestHeader('Content-Type', contentType);
            }
            // 添加监听
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (timeOut !== undefined) {
                        // 由于执行abort()方法后，有可能触发onreadystatechange事件，
                        // 所以设置一个timeout_bool标识，来忽略中止触发的事件。
                        if (timeoutBool) {
                            return;
                        }
                        clearTimeout(timeoutFlag);
                    }
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                        success(xhr.response || xhr.responseText);
                    } else {
                        error(xhr.status, xhr.statusText);
                    }
                }
            };
            // 发送请求
            xhr.send(type === 'get' ? null : data);
            setTime('', null); // 请求超时
        }

        setData();
        before();
        if (dataType === 'jsonp') {
            createJsonp();
        } else {
            createXHR();
        }
    }
}
