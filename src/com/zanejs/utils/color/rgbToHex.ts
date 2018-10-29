import rgbToUint from './rgbToUint';
import uintToHex from './uintToHex';

export default function rgbToHex(rgb: string): string {
    return uintToHex(rgbToUint(rgb));
}
