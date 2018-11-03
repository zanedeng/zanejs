module zanejs {

    /**
     * 获取设备当前屏幕横竖屏模式
     * @returns {number} 0:ANY, 1:LANDSCAPE, 2:PORTRAIT
     */
    export function getOrientation(): number {
        if (typeof window.orientation === 'undefined') {
            let w = innerWidth();
            let h = innerHeight();
            return w > h ? 1 : 2;
        } else {
            // 竖向
            if (window.orientation === 180 || window.orientation === 0) {
                return 2;
            } else if (window.orientation === 90 || window.orientation === -90) {
                return 1;
            }
            return 0;
        }
    }
}
