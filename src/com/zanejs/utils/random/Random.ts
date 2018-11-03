module zanejs {

    export class Random {
        private static MAX_UINT: number = 0xFFFFFFFF;
        private static MAX_RATIO: number = 1.0 / Random.MAX_UINT;

        public seed: number;

        constructor(seed: number) {
            this.seed = seed;
        }

        public next(): number {
            return this.nextSeed() * Random.MAX_RATIO;
        }

        private nextSeed(): number {
            this.seed ^= (this.seed << 21);
            this.seed ^= (this.seed >> 35);
            this.seed ^= (this.seed << 4);
            this.seed = (this.seed >>> 32);
            return this.seed;
        }
    }
}
