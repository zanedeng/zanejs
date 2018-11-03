module zanejs {

    export class MVCApp {

        /**
         * 注册控制器
         * @param controllClass 控制器类
         * @param cmd 控制器触发类型
         */
        public registerController(cmd: string, controllClass: IControllerClass): Controller {
            return new controllClass(cmd);
        }

        /**
         * 注册数据模型管理器
         * @param name 数据模型管理器名称
         * @param modelClass 数据模型管理器类
         * @param data 数据模型管理器的初始化数据
         */
        public registerModel(name: string, modelClass: IModelClass, data: any = null): Model {
            return new modelClass(name, data);
        }

        /**
         * 注册视图管理器
         * @param name 视图管理器名称
         * @param viewClass 视图管理器类
         * @param viewComponent 视图管理器管理的视图实例
         */
        public registerView(name: string, viewClass: IViewClass, viewComponent: any): View {
            return new viewClass(name, viewComponent);
        }
    }
}
