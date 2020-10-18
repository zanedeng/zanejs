import { BaseObject } from "./BaseObject";
import { Controller } from "./Controller";
import { Model, IModelType } from "./Model";

export type IViewType = {
    new (viewComponent: Object): View;
}

/**
 * @class View
 */
export class View extends BaseObject {

    public static viewMap: Map<string, View> = new Map();
    public static viewWeakMap: WeakMap<IViewType, string> = new WeakMap();

    public viewComponent: View;

    public eventList: string[] = [];

    private _name: string;

    public static retrieveView(clazz: IViewType): View {
        return View.viewMap.get(View.viewWeakMap.get(clazz));
    }

    public static removeView(clazz: IViewType): void {
        const viewKey = View.viewWeakMap.get(clazz);
        if (viewKey) {
            const view: View = View.viewMap.get(viewKey);
            if (view) {
                View.viewWeakMap.delete(clazz);
                View.viewMap.delete(viewKey);
                view.onRemove();
                view.viewComponent = null;
                view.eventList = null;
            }
        }
    }

    public static removeViews(...args: IViewType[]): void {
        args.map(clazz => View.removeView(clazz));
    }

    public static notifyViews(cmd: string, data: any = null, sponsor: any = null): void {
        let notifyList: View[] = [];
        View.viewMap.forEach(view => {
            if (view.eventList.indexOf(cmd) !== -1) {
                notifyList.push(view);
            }
        });
        notifyList.map(view => view.handleEvent(cmd, data, sponsor));
    }

    constructor(viewComponent: any) {
        super();
        if (View.viewWeakMap.has(this.constructor as IViewType)) {
            throw new Error('View[' + this.constructor.name + '] instance already constructed !');
        }
        this.viewComponent = viewComponent;
        this.eventList = this.listEventInterests();

        this._name = 'view_' + this.hashCode;
        View.viewWeakMap.set(this.constructor as IViewType, this._name);
        View.viewMap.set(this._name, this);
        this.onRegister();
    }

    public onRegister(): void {
        // overwrite
    }

    public onRemove(): void {
        // overwrite

    }

    public listEventInterests(): string[] {
        return [];
    }

    public handleEvent(_type: string, _data: any = null, _sponsor: any = null): void {
        // overwrite
    }

    public sendEvent(type: string, data: any = null, strict: boolean = false): void {
        if (!strict) {
            Controller.notifyControllers(type, data, this);
        }
        View.notifyViews(type, data, this);
    }

    public registerView(clazz: IViewType, viewComponent: any): View {
        return new clazz(viewComponent);
    }

    public retrieveView(clazz: IViewType): View {
        return View.retrieveView(clazz);
    }

    public retrieveModel(clazz: IModelType): Model {
        return Model.retrieveModel(clazz);
    }
}
