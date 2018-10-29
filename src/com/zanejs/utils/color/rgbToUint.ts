import percToUint from './percToUint';

export default function rgbToUint(rgb: string): number {
    let colors: string[] = rgb
      .replace(' ', '')
      .replace(/[()]/g, '')
      .substr(3)
      .split(',');
    let r: number = (isNaN(parseInt(colors[0], 10)))
        ? percToUint(colors[0])
        : parseInt(colors[0], 10);
    let g: number = (isNaN(parseInt(colors[1], 10)))
        ? percToUint(colors[1])
        : parseInt(colors[1], 10);
    let b: number = (isNaN(parseInt(colors[2], 10)))
        ? percToUint(colors[2])
        : parseInt(colors[2], 10);
    return (r << 16 | g << 8 | b);
}
