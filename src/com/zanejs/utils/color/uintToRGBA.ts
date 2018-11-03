module zanejs {

    export function uintToRGBA(color: number, alpha: number = 1): string {
        let hex: string = color.toString(16);
        if (hex.length < 6) {
            hex = padLeft(hex, '0', 6 - hex.length);
        }
        let channels: any = hex.match(/[0-9a-fA-F]{2}/g);
        let r: number = parseInt(channels[0], 16);
        let g: number = parseInt(channels[1], 16);
        let b: number = parseInt(channels[2], 16);
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    }
}
