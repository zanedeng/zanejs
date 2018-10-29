import htmlColorToHex from './htmlColorToHex';
import uintToHex from './uintToHex';
import rgbToHex from './rgbToHex';

export default function colorToHex(color: any) {
    if (isNaN(color)) {
        if (/\#(:?\w{6}|\w{3})/.test(color)) {
          return color;
        } else if (/rgb\(\d+\,\d+\,\d+\)/.test(color)) {
          return rgbToHex(color);
        } else if (/[a-z]+/.test(color)) {
          return htmlColorToHex(color);
        } else {
          return '#000000';
        }
    } else {
        return uintToHex(color);
    }
}
