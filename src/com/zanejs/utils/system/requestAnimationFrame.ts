module zanejs {

    export function requestAnimationFrame(): Function {
        let w: any = window;
        return w.requestAnimationFrame    ||
            w.webkitAnimationFrame        ||
            w.webkitRequestAnimationFrame ||
            w.mozRequestAnimationFrame    ||
            w.oRequestAnimationFrame      ||
            w.msRequestAnimationFrame     ||
            function(callback: any, element: any) {
                return window.setTimeout(callback, 1000 / 60);
            };
    }
}
