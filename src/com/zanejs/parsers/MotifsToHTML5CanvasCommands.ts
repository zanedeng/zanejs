import compare from '../utils/array/compare';

export default class MotifsToHTML5CanvasCommands {

    private static _prevFillStyle: any[] = [];
    private static _prevLineStyle: any[] = [];
    private static _prevCommand: string;
    private static _hasFill: boolean;
    private static _hasStroke: boolean;

    public static toCommandsString(motifs: any[]): string {
        let commands: string = '';
        let n: number = motifs.length;

        commands += '/**\n';
        commands += '* Generated using SVG To Motifs Parser\n';
        commands += '*/\n';

        for (let i: number = 0; i < n; i++) {
            switch (motifs[i][0]) {
                case 'B':
                    // ensure that a new path will be created even without endFill command
                    if (MotifsToHTML5CanvasCommands._prevCommand !== 'E') {
                        commands += MotifsToHTML5CanvasCommands.endFill();
                    }

                    if (motifs[i][1].length) {
                        if (!compare(motifs[i][1], MotifsToHTML5CanvasCommands._prevFillStyle)) {
                            commands += MotifsToHTML5CanvasCommands.beginFill(motifs[i][1][0], motifs[i][1][1]);
                            MotifsToHTML5CanvasCommands._prevFillStyle = motifs[i][1];
                            commands += '\n';
                        }
                        MotifsToHTML5CanvasCommands._hasFill = true;
                    } else {
                        MotifsToHTML5CanvasCommands._hasFill = false;
                    }
                    break;

                case 'C':
                    commands += MotifsToHTML5CanvasCommands.quadraticBezier(
                          motifs[i][1][0], motifs[i][1][1], motifs[i][1][2], motifs[i][1][3]);
                    commands += '\n';
                    break;

                case 'E':
                    // the SVGToMotifs always start with BEGIN_FILL if path is filled
                    // followed by LINE_STYLE, if previous is B or S means that it is an empty path.
                    if (MotifsToHTML5CanvasCommands._prevCommand !== 'E' &&
                        MotifsToHTML5CanvasCommands._prevCommand !== 'B' &&
                        MotifsToHTML5CanvasCommands._prevCommand !== 'S') {
                        commands += MotifsToHTML5CanvasCommands.endFill();
                    }
                    break;

                case 'L':
                    commands += MotifsToHTML5CanvasCommands.lineTo(motifs[i][1][0], motifs[i][1][1]);
                    commands += '\n';
                    break;

                case 'M':
                    // set as unfilled path (the SVGToMotifs always start with BEGIN_FILL
                    // if path is filled followed by LINE_STYLE)
                    if (MotifsToHTML5CanvasCommands._prevCommand === 'E') {
                        MotifsToHTML5CanvasCommands._hasFill = false;
                    }
                    commands += MotifsToHTML5CanvasCommands.moveTo(motifs[i][1][0], motifs[i][1][1]);
                    commands += '\n';
                    break;

                case 'S':

                    if (MotifsToHTML5CanvasCommands._prevCommand === 'E') {
                        // set as unfilled path (the SVGToMotifs always start with BEGIN_FILL if path is filled)
                        MotifsToHTML5CanvasCommands._hasFill = false;
                    } else if (MotifsToHTML5CanvasCommands._prevCommand !== 'B') {
                        // ensure that a new path will be created even without endFill command
                        commands += MotifsToHTML5CanvasCommands.endFill();
                    }

                    if (motifs[i][1].length) {
                        if (! compare(motifs[i][1], MotifsToHTML5CanvasCommands._prevLineStyle)) {
                            commands += MotifsToHTML5CanvasCommands.lineStyle(
                                motifs[i][1][0], motifs[i][1][1], motifs[i][1][2],
                                motifs[i][1][3], motifs[i][1][4], motifs[i][1][5],
                                motifs[i][1][6], motifs[i][1][7]);
                            MotifsToHTML5CanvasCommands._prevLineStyle = motifs[i][1];
                            commands += '\n';
                        }
                        MotifsToHTML5CanvasCommands._hasStroke = true;
                    } else {
                        MotifsToHTML5CanvasCommands._hasStroke = false;
                    }

                    break;
              default:
            }
            MotifsToHTML5CanvasCommands._prevCommand = motifs[i][0];
        }

        // ensure last element is filled/stroked if last command isn't END_FILL
        if (MotifsToHTML5CanvasCommands._prevCommand !== 'E') {
            commands += MotifsToHTML5CanvasCommands.endFill();
        }

        // reset values
        MotifsToHTML5CanvasCommands._prevFillStyle.length = 0; // faster than creating a new Array
        MotifsToHTML5CanvasCommands._prevLineStyle.length = 0;
        MotifsToHTML5CanvasCommands._prevCommand = '';
        MotifsToHTML5CanvasCommands._hasFill = false;
        MotifsToHTML5CanvasCommands._hasStroke = false;

        return commands;
    }

    private static beginFill(color: number, alpha: number = 1): string {
        let output: string = '';
        output += 'context.fillStyle = "';
        output += MotifsToHTML5CanvasCommands.parseColor(color, alpha);
        output += '";';
        return output;
    }

    private static parseColor(color: number, alpha: number = 1): string {
        if (alpha < 1) {
            return MotifsToHTML5CanvasCommands.uintToRGBA(color, alpha);
        } else if (color) {
            let hex: string = color.toString(16);
            if (hex.length < 6) {
                hex = MotifsToHTML5CanvasCommands.addZeroes(hex, 6 - hex.length);
            }
            return '#' + hex;
        } else {
            return '#000000';
        }
    }

    private static uintToRGBA(color: number, alpha: number = 1): string {
        let hex: string = color.toString(16);
        if (hex.length < 6) {
          hex = MotifsToHTML5CanvasCommands.addZeroes(hex, 6 - hex.length);
        }
        let channels: any = hex.match(/[0-9a-fA-F]{2}/g);
        let r: number = parseInt(channels[0], 16);
        let g: number = parseInt(channels[1], 16);
        let b: number = parseInt(channels[2], 16);
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    }

    private static addZeroes(str: string, n: number): string {
        let output: string = '';
        while (n--) {
            output += '0';
        }
        output += str;
        return output;
    }

    private static quadraticBezier(cx: number, cy: number, px: number, py: number): string {
         let args: any[] = [];
         for (let i = 0; i < arguments.length; ++i) {
            args.push(arguments[i]);
         }
         return 'context.quadraticCurveTo(' + args.join(',') + ');';
    }

    private static endFill(): string {
        let output: string = '';
        output += (MotifsToHTML5CanvasCommands._hasFill) ? 'context.fill();\n' : '';
        output += (MotifsToHTML5CanvasCommands._hasStroke) ? 'context.stroke();\n' : '';
        output += 'context.beginPath();\n';
        // Set previous command as END_FILL to avoid duplicates
        MotifsToHTML5CanvasCommands._prevCommand = 'E';
        return output;
    }

    private static lineTo(x: number, y: number): string {
        let args: any[] = [];
        for (let i = 0; i < arguments.length; ++i) {
          args.push(arguments[i]);
        }
        return 'context.lineTo(' + args.join(',') + ');';
    }

    private static moveTo(x: number, y: number): string {
        let args: any[] = [];
        for (let i = 0; i < arguments.length; ++i) {
          args.push(arguments[i]);
        }
        return 'context.moveTo(' + args.join(',') + ');';
    }

    private static lineStyle(thickness: number = NaN,
                             color: number = 0x000000, alpha: number = 1,
                             pixelHinting: boolean = false, scaleMode: string = 'normal',
                             caps: string = 'none', joints: string = '', miterLimit: number = 3): string {
        let output: string = '';

        if (thickness !== MotifsToHTML5CanvasCommands._prevLineStyle[0] && !isNaN(thickness)) {
            output += 'context.lineWidth = ' + thickness + ';';
        }

        if (!isNaN(color) && !isNaN(alpha) &&
           (color !== MotifsToHTML5CanvasCommands._prevLineStyle[1] ||
            alpha !== MotifsToHTML5CanvasCommands._prevLineStyle[2])) {
            output += (output !== '') ? '\n' : '';
            output += 'context.strokeStyle = "' + MotifsToHTML5CanvasCommands.parseColor(color, alpha) + '";';
        }

        if (caps !== MotifsToHTML5CanvasCommands._prevLineStyle[5] &&
           (caps !== 'none' || MotifsToHTML5CanvasCommands._prevLineStyle[5] !== 'butt')) {
            caps = (caps === 'none' || !caps) ? 'butt' : caps; // convert value
            output += (output !== '') ? '\n' : '';
            output += 'context.lineCap = "' + caps + '"';
        }

        if (joints !== MotifsToHTML5CanvasCommands._prevLineStyle[6]) {
            joints = (! joints) ? 'miter' : joints; // default value
            output += (output !== '') ? '\n' : '';
            output += 'context.lineJoin = "' + joints + '"';
        }

        if (miterLimit !== MotifsToHTML5CanvasCommands._prevLineStyle[7] && !isNaN(miterLimit)) {
            output += (output !== '') ? '\n' : '';
            output += 'context.miterLimit = ' + miterLimit;
        }

        return output;
    }

    constructor() {
        throw new Error('This is a STATIC CLASS and should not be instantiated.');
    }
}
