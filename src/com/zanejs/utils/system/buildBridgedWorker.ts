module zanejs {

    export function buildBridgedWorker(workerFunction: Function,
                                       workerExportNames: Array<string>,
                                       mainExportNames: Array<string>,
                                       mainExportHandles: Array<Function>): any {

        let baseWorkerStr = workerFunction.toString().match(/^\s*function\s*\(\s*\)\s*\{(([\s\S](?!\}$))*[\s\S])/)[1];
        let extraWorkerStr: Array<string> = [];
        extraWorkerStr.push('var main = {};\n');
        for (let i = 0; i < mainExportNames.length; i++) {
            let name = mainExportNames[i];
            if (name.charAt(name.length - 1) === '*') {
                name = name.substr(0, name.length - 1);
                mainExportNames[i] = name; // we need this trimmed version back in main
                extraWorkerStr.push(
                    'main.' + name + ' = function(/* arguments */){\n ' +
                    'var args = Array.prototype.slice.call(arguments); ' +
                    'var buffers = args.pop(); \n ' +
                    'self.postMessage({foo:\'' + name +  '\', args:args}, buffers)\n' +
                    '}; \n'
                );
            } else {
                extraWorkerStr.push(
                    'main.' + name + ' = function(/* arguments */){\n ' +
                    'var args = Array.prototype.slice.call(arguments); \n ' +
                    'self.postMessage({foo:\'' + name +  '\', args:args})\n' +
                    '}; \n'
                );
            }
        }

        let tmpStr = [];
        for (let i = 0; i < workerExportNames.length; i++) {
            let name = workerExportNames[i];
            name = name.charAt(name.length - 1) === '*'
                ? name.substr(0, name.length - 1)
                : name;
            tmpStr.push(name + ': ' + name);
        }
        extraWorkerStr.push('var foos={' + tmpStr.join(',') + '};\n');
        extraWorkerStr.push('self.onmessage = function(e){\n');
        extraWorkerStr.push('if(e.data.foo in foos) \n  ' +
            'foos[e.data.foo].apply(null, e.data.args); \n ' +
            'else \n ' +
            'throw(new Error(\'Main thread requested function \' + e.data.foo + \'. But it is not available.\'));\n'
        );
        extraWorkerStr.push('\n};\n');

        let fullWorkerStr = baseWorkerStr +
            '\n\n/*==== STUFF ADDED BY BuildBridgeWorker ==== */\n\n' + extraWorkerStr.join('');

        // create the worker
        let url = window.URL.createObjectURL(new Blob([fullWorkerStr], {type: 'text/javascript'}));
        let theWorker = new Worker(url);
        theWorker.onmessage = (e: any) => {
            let fooInd = mainExportNames.indexOf(e.data.foo);
            if (fooInd !== -1) {
                mainExportHandles[fooInd].apply(null, e.data.args);
            } else {
                throw(new Error('Worker requested function ' + e.data.foo + '. But it is not available.'));
            }
        };

        let ret = {blobURL: url};
        let makePostMessageForFunction = (name: string, hasBuffers: boolean) => {
            if (hasBuffers) {
                return function(/*args...,[ArrayBuffer,..]*/){
                    let args = Array.prototype.slice.call(arguments);
                    let buffers = args.pop();
                    theWorker.postMessage({foo: name, args: args}, buffers);
                };
            } else {
                return function(/*args...*/){
                    let args = Array.prototype.slice.call(arguments);
                    theWorker.postMessage({foo: name, args: args});
                };
            }
        };

        for (let i = 0; i < workerExportNames.length; i++) {
            let name = workerExportNames[i];
            if (name.charAt(name.length - 1) === '*') {
                name = name.substr(0, name.length - 1);
                ret[name] = makePostMessageForFunction(name, true);
            } else {
                ret[name] = makePostMessageForFunction(name, false);
            }
        }
        return ret;
    }
}
