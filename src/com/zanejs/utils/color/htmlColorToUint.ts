import htmlColorToHex from './htmlColorToHex';
import hexToUint from './hexToUint';

export default function htmlColorToUint(htmlColorName: string): number {
    return hexToUint(htmlColorToHex(htmlColorName));
}
