module zanejs {

    export interface IControllerClass {
        new (cmd: string): Controller;
    }

    export class Controller {

        public static controllerList: Controller[] = [];

        public cmd: string;

        public static notifyControllers(cmd: string, data: any = null, sponsor: any = null): void {
            var i: number = 0;
            while (i < Controller.controllerList.length) {
                if (Controller.controllerList[i].cmd === cmd) {
                    // 执行一个或多个命令（FIFO）
                    Controller.controllerList[i].execute(data, sponsor);
                }
                i++;
            }
        }

        public static hasController(cmd: string): boolean {
            var len: number = Controller.controllerList.length;
            for (var i: number = 0; i < len; ++i) {
                if (Controller.controllerList[i].cmd === cmd) {
                    return true;
                }
            }
            return false;
        }

        public static removeController(cmd: string): boolean {
            var len: number = Controller.controllerList.length;
            for (var i: number = len - 1; i >= 0; --i) {
                if (Controller.controllerList[i].cmd === cmd) {
                    // 注销附加操作
                    Controller.controllerList[i].onRemove();
                    Controller.controllerList[i] = null;
                    // 确保controller总是非空
                    Controller.controllerList.splice(i, 1);
                    return true;
                }
            }
            return false;
        }

        constructor(cmd: string) {
            if (Controller.hasController(cmd)) {
                throw new Error('Controller cmd [' + cmd + '] instance already constructed !');
            }
            this.cmd = cmd;
            Controller.controllerList.push(this);
            this.onRegister();
        }

        /**
         * 注册附加操作，需在子类中覆盖使用
         */
        public onRegister(): void {
            // overwrite
        }

        /**
         * 注销附加操作，需在子类中覆盖使用
         */
        public onRemove(): void {
            // overwrite
        }

        /**
         * 执行Controller逻辑处理，需在子类中覆盖使用
         */
        public execute(data: any = null, sponsor: any = null): void {
            // overwrite
        }

        public sendEvent(cmd: string, data: any = null, strict: boolean = false): void {
            if (!strict) {
                View.notifyViews(cmd, data, this);
            }
            Controller.notifyControllers(cmd, data, this);
        }

        public registerView(name: string, ViewClass: IViewClass, viewComponent: Object): View {
            return new ViewClass(name, viewComponent);
        }

        public retrieveView(name: string): View {
            return View.retrieveView(name);
        }

        public removeView(name: string): void {
            View.removeView(name);
        }

        public registerController(cmd: string, ControllClass: IControllerClass): Controller {
            return new ControllClass(cmd);
        }

        public removeController(cmd: string): void {
            Controller.removeController(cmd);
        }

        public registerModel(name: string, ModelClass: IModelClass, data: any = null): Model {
            return new ModelClass(name, data);
        }

        public retrieveModel(name: string): Model {
            return Model.retrieveModel(name);
        }

        public removeModel(name: string): void {
            Model.removeModel(name);
        }
    }

}
