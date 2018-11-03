module zanejs {

    /**
     *
     * @param canvas
     * @param webGLSettings
     * @returns {WebGLRenderingContext}
     */
    export function create3DContext(canvas: HTMLCanvasElement, webGLSettings: any) {
        let names: Array<string> = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
        let context: WebGLRenderingContext = null;
        for (let ii = 0; ii < names.length; ++ii) {
            try {
                context = <WebGLRenderingContext> canvas.getContext(names[ii], webGLSettings);
            } catch (e) {
                // todo
            }
            if (context) {
                break;
            }
        }
        return context;
    }
}
