import uint from '../number/uint';

export default function hexToUint(hex: string) {
    hex = hex || '';
    hex = hex.replace('#', '').toUpperCase();
    if (hex.length === 3) {
        // converts FC0 to FFCC00
        hex = hex.replace(/(\w)/g, '$&$&');
    }
    return uint('0x' + hex);
}
