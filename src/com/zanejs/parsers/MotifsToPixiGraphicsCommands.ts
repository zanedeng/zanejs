import compare from '../utils/array/compare';
import uintToRGBA from '../utils/color/uintToRGBA';
import padLeft from '../utils/string/padLeft';

export default class MotifsToPixiGraphicsCommands {

    private static _prevFillStyle: any[] = [];
    private static _prevLineStyle: any[] = [];
    private static _prevCommand: string;
    private static _hasFill: boolean;
    private static _hasStroke: boolean;

    public static toCommandsString(motifs: any[]): string {
        let commands: string = '';
        let n: number = motifs.length;

        for (let i: number = 0; i < n; i++) {
            switch (motifs[i][0]) {
                case 'B':

                    break;

                case 'C':

                    break;

                case 'E':

                    break;

                case 'L':

                    break;

                case 'M':

                    break;

                case 'S':

                    break;
                default:
            }
            MotifsToPixiGraphicsCommands._prevCommand = motifs[i][0];
        }

        // ensure last element is filled/stroked if last command isn't END_FILL
        if (MotifsToPixiGraphicsCommands._prevCommand !== 'E') {
            commands += MotifsToPixiGraphicsCommands.endFill();
        }

        // reset values
        MotifsToPixiGraphicsCommands._prevFillStyle.length = 0; // faster than creating a new Array
        MotifsToPixiGraphicsCommands._prevLineStyle.length = 0;
        MotifsToPixiGraphicsCommands._prevCommand = '';
        MotifsToPixiGraphicsCommands._hasFill = false;
        MotifsToPixiGraphicsCommands._hasStroke = false;

        return commands;
    }

    private static beginFill(color: number, alpha: number = 1): string {
        return '';
    }

    private static endFill(): string {
        return '';
    }
    
    private static parseColor(color: number, alpha: number = 1): string {
        if (alpha < 1) {
            return uintToRGBA(color, alpha);
        } else if (color) {
            let hex: string = color.toString(16);
            if (hex.length < 6) {
                hex = padLeft(hex, '0', 6 - hex.length);
            }
            return '#' + hex;
        } else {
            return '#000000';
        }
    }
}
