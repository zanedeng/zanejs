import getHtmlColors from './getHtmlColors';

export default function htmlColorToHex(htmlColorName: string): string {
  return getHtmlColors()[htmlColorName.toLowerCase()];
}
