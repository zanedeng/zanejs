module zanejs {

    export function isWebGLSupported() {
        const contextOptions = { stencil: true, failIfMajorPerformanceCaveat: true };

        try {
            let win: any = window;
            if (!win.WebGLRenderingContext) {
                return false;
            }
            const canvas = document.createElement('canvas');
            let gl = create3DContext(canvas, contextOptions);
            const success = !!(gl && gl.getContextAttributes().stencil);
            if (gl) {
                const loseContext = gl.getExtension('WEBGL_lose_context');
                if (loseContext) {
                    loseContext.loseContext();
                }
            }
            gl = null;
            return success;
        } catch (e) {
            return false;
        }
    }
}
