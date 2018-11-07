module zanejs {

    /**
     * 创建一个类的实例
     * @param clazz
     * @param args
     */
    export function createInstance(clazz: any, args: any[] = [], props: any = null) {
        if (!clazz) return null;
        if (!is_array(args)) {
            args = [args];
        }
        let instance;
        if (args) {
            switch (args.length) {
                case 0:
                    instance = new clazz();
                    break;
                case 1:
                    instance = new clazz(args[0]);
                    break;
                case 2:
                    instance = new clazz(args[0], args[1]);
                    break;
                case 3:
                    instance = new clazz(args[0], args[1], args[2]);
                    break;
                case 4:
                    instance = new clazz(args[0], args[1], args[2], args[3]);
                    break;
                case 5:
                    instance = new clazz(args[0], args[1], args[2], args[3], args[4]);
                    break;
                case 6:
                    instance = new clazz(args[0], args[1], args[2], args[3], args[4], args[5]);
                    break;
                case 7:
                    instance = new clazz(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
                    break;
                case 8:
                    instance = new clazz(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
                    break;
                case 9:
                    instance = new clazz(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7],
                        args[8]);
                    break;
                case 10:
                    instance = new clazz(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7],
                        args[8], args[9]);
                    break;
                default:
                    return null;
            }
        } else {
            instance = new clazz();
        }

        if (props) {
            Object.keys(props).map(key => {
                if (instance.hasOwnProperty(key)) {
                    instance[key] = props[key];
                }
            });
        }

        return instance;
    }
}
