module zanejs {

    export function cancelRequestAnimationFrame(): Function {
        let w: any = window;
        return  w.cancelAnimationFrame          ||
            w.webkitCancelAnimationFrame        ||
            w.webkitCancelRequestAnimationFrame ||
            w.mozCancelAnimationFrame           ||
            w.mozCancelRequestAnimationFrame    ||
            w.oCancelRequestAnimationFrame      ||
            w.msCancelRequestAnimationFrame     ||
            function(timeoutId: number) {
                return window.clearTimeout(timeoutId);
            };
    }
}
