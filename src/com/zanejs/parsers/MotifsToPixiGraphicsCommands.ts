module zanejs {

    export class MotifsToPixiGraphicsCommands {

        private static _prevFillStyle: any[] = [];
        private static _prevLineStyle: any[] = [];
        private static _prevCommand: string;
        private static _hasFill: boolean;
        private static _hasStroke: boolean;

        public static toCommandsString(motifs: any[]): string {
            let commands: string = '';
            let n: number = motifs.length;

            commands += 'class SVG extends PIXI.Graphics {\n';
            commands += '\tconstructor() {\n';
            commands += '\t\tsuper();\n';

            for (let i: number = 0; i < n; i++) {
                switch (motifs[i][0]) {
                    case 'B':
                        if (MotifsToPixiGraphicsCommands._prevCommand !== 'E') {
                            commands += MotifsToPixiGraphicsCommands.endFill();
                        }

                        if (motifs[i][1].length) {
                            if (!compare(motifs[i][1], MotifsToPixiGraphicsCommands._prevFillStyle)) {
                                commands += MotifsToPixiGraphicsCommands.beginFill(motifs[i][1][0], motifs[i][1][1]);
                                MotifsToPixiGraphicsCommands._prevFillStyle = motifs[i][1];
                                commands += '\n';
                            }
                            MotifsToPixiGraphicsCommands._hasFill = true;
                        } else {
                            MotifsToPixiGraphicsCommands._hasFill = false;
                        }
                        break;

                    case 'C':
                        commands += MotifsToPixiGraphicsCommands.quadraticBezier(
                            motifs[i][1][0], motifs[i][1][1], motifs[i][1][2], motifs[i][1][3]);
                        commands += '\n';
                        break;

                    case 'E':
                        if (MotifsToPixiGraphicsCommands._prevCommand !== 'E' &&
                            MotifsToPixiGraphicsCommands._prevCommand !== 'B' &&
                            MotifsToPixiGraphicsCommands._prevCommand !== 'S') {
                            commands += MotifsToPixiGraphicsCommands.endFill();
                        }
                        break;

                    case 'L':
                        commands += MotifsToPixiGraphicsCommands.lineTo(motifs[i][1][0], motifs[i][1][1]);
                        commands += '\n';
                        break;

                    case 'M':
                        if (MotifsToPixiGraphicsCommands._prevCommand === 'E') {
                            MotifsToPixiGraphicsCommands._hasFill = false;
                        }
                        commands += MotifsToPixiGraphicsCommands.moveTo(motifs[i][1][0], motifs[i][1][1]);
                        commands += '\n';
                        break;

                    case 'S':
                        if (MotifsToPixiGraphicsCommands._prevCommand === 'E') {
                            // set as unfilled path (the SVGToMotifs always start with BEGIN_FILL if path is filled)
                            MotifsToPixiGraphicsCommands._hasFill = false;
                        } else if (MotifsToPixiGraphicsCommands._prevCommand !== 'B') {
                            // ensure that a new path will be created even without endFill command
                            commands += MotifsToPixiGraphicsCommands.endFill();
                        }

                        if (motifs[i][1].length) {
                            if (! compare(motifs[i][1], MotifsToPixiGraphicsCommands._prevLineStyle)) {
                                commands += MotifsToPixiGraphicsCommands.lineStyle(
                                    motifs[i][1][0], motifs[i][1][1], motifs[i][1][2],
                                    motifs[i][1][3], motifs[i][1][4], motifs[i][1][5],
                                    motifs[i][1][6], motifs[i][1][7]);
                                MotifsToPixiGraphicsCommands._prevLineStyle = motifs[i][1];
                                commands += '\n';
                            }
                            MotifsToPixiGraphicsCommands._hasStroke = true;
                        } else {
                            MotifsToPixiGraphicsCommands._hasStroke = false;
                        }
                        break;
                    default:
                }
                MotifsToPixiGraphicsCommands._prevCommand = motifs[i][0];
            }

            // ensure last element is filled/stroked if last command isn't END_FILL
            if (MotifsToPixiGraphicsCommands._prevCommand !== 'E') {
                commands += MotifsToPixiGraphicsCommands.endFill();
            }

            commands += '\t}\n';
            commands += '}\n';
            // reset values
            MotifsToPixiGraphicsCommands._prevFillStyle.length = 0; // faster than creating a new Array
            MotifsToPixiGraphicsCommands._prevLineStyle.length = 0;
            MotifsToPixiGraphicsCommands._prevCommand = '';
            MotifsToPixiGraphicsCommands._hasFill = false;
            MotifsToPixiGraphicsCommands._hasStroke = false;

            return commands;
        }

        private static lineStyle(thickness: number = NaN,
                                 color: number = 0x000000, alpha: number = 1,
                                 pixelHinting: boolean = false, scaleMode: string = 'normal',
                                 caps: string = 'none', joints: string = '', miterLimit: number = 3): string {
            let output: string = '';
            output += '\t\tthis.lineStyle(' + thickness + ', ' + color + ', ' + alpha + ')';
            return output;
        }

        private static beginFill(color: number, alpha: number = 1): string {
            let output: string = '';
            output += '\t\tthis.beginFill(' + color + ', ' + alpha + ')';
            return output;
        }

        private static lineTo(x: number, y: number): string {
            let args: any[] = [];
            for (let i = 0; i < arguments.length; ++i) {
                args.push(arguments[i]);
            }
            return '\t\tthis.lineTo(' + args.join(',') + ');';
        }

        private static moveTo(x: number, y: number): string {
            let args: any[] = [];
            for (let i = 0; i < arguments.length; ++i) {
                args.push(arguments[i]);
            }
            return '\t\tthis.moveTo(' + args.join(',') + ');';
        }

        private static quadraticBezier(cx: number, cy: number, px: number, py: number): string {
            let args: any[] = [];
            for (let i = 0; i < arguments.length; ++i) {
                args.push(arguments[i]);
            }
            return '\t\tthis.quadraticCurveTo(' + args.join(',') + ');';
        }

        private static endFill(): string {
            let output: string = '';
            output += '\t\tthis.endFill();\n';
            // Set previous command as END_FILL to avoid duplicates
            MotifsToPixiGraphicsCommands._prevCommand = 'E';
            return output;
        }
    }
}
