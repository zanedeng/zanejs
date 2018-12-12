module zanejs {

    export function paserFui(file: any, relativePath: string, callback: Function) {
        var baseName = file.name.substring(file.name.lastIndexOf('/') + 1, file.name.lastIndexOf('.'));
        file.async('arraybuffer').then((content) => {
            let res = new PIXI.loaders.Resource(baseName, relativePath);
            res.data = content;
            fgui.utils.AssetLoader.addResources({
                [baseName]: res
            });
            if (callback) {
                callback();
            }
        });
    }

    export function base64ToImage(data: string, onCompleteFunc: Function,
                                  onCompleteArgArray: any[] = null, onCompleteThisArg: any = null) {
        var img = new Image();
        img.src = 'data:image/png;base64,' + data;
        img.onload = function (e: any) {
            if (onCompleteFunc) {
                onCompleteArgArray = onCompleteArgArray == null ? [img] : [img].concat(onCompleteArgArray);
                onCompleteFunc.apply(onCompleteThisArg, onCompleteArgArray);
            }
        };
        return img;
    }

    export function paserImage(file: any, relativePath: string, callback: Function) {
        var baseName = file.name.substring(file.name.lastIndexOf('/') + 1, file.name.lastIndexOf('.'));
        file.async('base64').then((content) => {
            base64ToImage(content, (img) => {
                let res = new PIXI.loaders.Resource(baseName, relativePath);
                res.data = img;
                res.texture = new PIXI.Texture(new PIXI.BaseTexture(img));
                fgui.utils.AssetLoader.addResources({
                    [baseName]: res
                });
                if (callback) {
                    callback();
                }
            });
        });
    }

    export function paserZipMiddleware(resource: any, next: any) {
        if (resource.extension === 'zip') {
            let zip = new JSZip();
            zip.loadAsync(resource.data).then(function ($zip: any) {
                let fileNum = 0;
                let totalFileNum = Object.keys($zip.files).length;

                $zip.forEach((relativePath, file) => {
                    var callback = () => {
                        fileNum++;
                        if (fileNum === totalFileNum) {
                            next();
                        }
                    };
                    let extension = file.name.split('.').pop();
                    switch (extension) {
                        case 'fui':
                            paserFui(file, relativePath, callback);
                            break;
                        case 'png':
                        case 'jpeg':
                        case 'jpg':
                            paserImage(file, relativePath, callback);
                            break;
                        default:
                            next();
                    }
                });
            });
        } else {
            next();
        }
    }
}
