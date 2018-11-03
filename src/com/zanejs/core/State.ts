module zanejs {

    /**
     * 状态工具
     * @class zane.State
     */
    export class State {
        /**
         * 当前状态
         * @type {string}
         */
        private state: string;

        /**
         * 最后的状态
         * @type {string}
         */
        private last: string;

        /**
         * 状态持续计数器
         * @type {number}
         */
        private count: number;

        /**
         * 是否锁定状态
         * @type {boolean}
         */
        private locked: boolean;

        /**
         * 构造函数
         */
        constructor(state: string) {
            this.state = state;
            this.last = '';
            this.count = -1;
            this.locked = false;
        }

        /**
         * 设置状态
         * @param state
         */
        public setTo(state: string): void {
            if (this.locked) {
                return;
            }

            this.last = this.state;
            this.state = state;
            this.count = -1;
        }

        /**
         * 获取当前状态
         * @returns {string}
         */
        public value(): string { return this.state; }

        /**
         * 计数
         */
        public tick(): void {
            this.count++;
        }

        /**
         * 是否该状态的第一次计数
         * @returns {boolean}
         */
        public first(): boolean {
            return this.count === 0;
        }

        /**
         * 是否跟指定的状态相同
         * @param state
         * @returns {boolean}
         */
        public equal(state: string): boolean {
            return state === this.state;
        }

        /**
         * 当前状态是否在指定的状态列表中
         * @returns {boolean}
         */
        public isIn(): boolean {
            let state = this.state,
                args = Array.prototype.slice.call(arguments);
            return args.some(function (s: string) {
                return s === state;
            });
        }

        /**
         * 当前状态是否不在指定的状态列表中
         * @returns {boolean}
         */
        public isNotIn(): boolean {
            return !(this.isIn.apply(this, arguments));
        }
    }
}
