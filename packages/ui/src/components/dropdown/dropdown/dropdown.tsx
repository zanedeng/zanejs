import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
} from '@stencil/core';

import PopoverController from '../../popover/popover/popover-controller';

/**
 * 下拉菜单组件
 * @Component 装饰器定义组件元数据
 * @shadow 启用Shadow DOM封装
 * @styleUrl 组件样式表路径
 * @tag 组件自定义标签名称
 */
@Component({
  shadow: true,
  styleUrl: 'dropdown.scss',
  tag: 'zane-dropdown',
})
export class Dropdown implements ComponentInterface {

  /**
   * 下拉菜单关闭事件
   * @Event 装饰器定义自定义事件
   * 事件名称为'zane-dropdown--close'
   */
  @Event({ eventName: 'zane-dropdown--close' }) closeEvent: EventEmitter;

  /**
   * 是否禁用下拉菜单
   * @Prop 默认值为false
   */
  @Prop() disabled: boolean = false;

  /**
   * 宿主元素引用
   * @Element 装饰器获取宿主元素
   */
  @Element() host!: HTMLElement;

  /**
   * 是否为受控模式
   * 在受控模式下，组件的状态完全由外部控制
   * @Prop 装饰器，reflect表示会反映到DOM属性上
   */
  @Prop({ reflect: true }) managed: boolean = false;

  /**
   * 下拉菜单内容区域的引用
   */
  menuRef: HTMLZaneDropdownMenuElement;

  /**
   * 下拉菜单是否打开
   * @Prop 装饰器，mutable表示属性可变，reflect表示会反映到DOM属性上
   */
  @Prop({ mutable: true, reflect: true }) open: boolean = false;

  /**
   * 下拉菜单打开事件
   * @Event 装饰器定义自定义事件
   * 事件名称为'zane-dropdown--open'
   */
  @Event({ eventName: 'zane-dropdown--open' }) openEvent: EventEmitter;

  /**
   * 下拉菜单位置选项
   * 多个位置用逗号分隔，按优先级排序
   * @Prop 装饰器，reflect表示会反映到DOM属性上
   * 默认值为'bottom-start,top-start,bottom-end,top-end'
   */
  @Prop({ reflect: true }) placements: string =
    'bottom-start,top-start,bottom-end,top-end';

  /**
   * Popover控制器实例
   * 用于管理弹出位置、显示/隐藏等逻辑
   */
  popoverController: PopoverController;

  /**
   * 触发器插槽引用
   */
  slotRef: HTMLSlotElement;

  /**
   * 触发下拉菜单的方式
   * - 'click': 点击触发
   * - 'hover': 悬停触发
   * - 'manual': 手动控制
   * @Prop 装饰器，reflect表示会反映到DOM属性上
   * 默认值为'click'
   */
  @Prop({ reflect: true }) trigger: 'click' | 'hover' | 'manual' = 'click';

  /**
   * 触发器元素引用
   * 可以是任何HTML元素或zane-button组件
   */
  triggerRef: HTMLElement | HTMLZaneButtonElement;

  /**
   * 菜单项点击事件
   * @Event 装饰器定义自定义事件
   * 事件名称为'zane-dropdown--item-click'
   */
  @Event({ eventName: 'zane-dropdown--item-click' })
  zaneDropdownItemClick: EventEmitter;

  /**
   * 组件加载完成生命周期钩子
   * 初始化下拉菜单控制器和事件监听
   */
  componentDidLoad() {
    // 获取下拉菜单内容区域
    const contentRef = this.host.querySelector('zane-dropdown-menu');

    if (!contentRef) {
      throw new Error(
        'zane-dropdown: The dropdown component must have a zane-dropdown-menu child component',
      );
    }

    this.menuRef = contentRef;

    // 初始化Popover控制器
    this.popoverController = new PopoverController(
      this.host,
      this.trigger,
      this.open,
      contentRef,
      0,
      0,
      this.showPopover,
      this.hidePopover,
      this.placements,
    );

    // 获取触发器元素
    this.triggerRef = this.slotRef.assignedElements()[0] as HTMLElement;
    if (this.triggerRef.nodeName === 'SLOT') {
      const assignedElements = (
        this.triggerRef as HTMLSlotElement
      ).assignedElements();
      if (assignedElements.length > 0) {
        this.triggerRef = assignedElements[0] as HTMLSlotElement;
      }
    }

    // 注册触发器并设置引用
    this.popoverController.registerTarget(this.triggerRef);
    this.popoverController.setTriggerRef(this.triggerRef);

    // 监听菜单项点击事件
    this.host.addEventListener('zane-menu-item--click', (evt: CustomEvent) => {
      this.zaneDropdownItemClick.emit(evt.detail);
      this.setFocusOnTrigger();
      this.popoverController.hidePopover();
    });

    // 监听ESC键关闭下拉菜单
    this.host.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        this.popoverController.hidePopover();
      }
    });
  }

  /**
   * 组件更新生命周期钩子
   * 更新Popover控制器的状态
   */
  componentDidUpdate() {
    this.popoverController.setOpen(this.open);
    if (this.open) {
      this.popoverController.computePositionThrottle('onUpdate');
    }
  }

  /**
   * 组件断开连接生命周期钩子
   * 清理Popover控制器
   */
  disconnectedCallback() {
    this.popoverController.destroy();
  }

  /**
   * 隐藏下拉菜单的回调函数
   */
  hidePopover = () => {
    this.open = false;
    this.closeEvent.emit();
  };

  /**
   * 渲染组件
   * @returns 组件虚拟DOM
   */
  render() {
    return (
      <Host>
        <div
          class={{
            dropdown: true,
            open: this.open,
          }}
        >
          <slot ref={(el) => (this.slotRef = el as HTMLSlotElement)} />
        </div>
      </Host>
    );
  }

  /**
   * 监听窗口resize事件
   * 调整下拉菜单位置
   * @Listen 装饰器监听window的resize事件
   */
  @Listen('resize', { target: 'window' })
  resizeHandler() {
    this.popoverController.computePositionThrottle('resize');
  }

  /**
   * 设置焦点的公共方法
   * @Method 装饰器定义公共方法
   */
  @Method()
  async setFocus() {
    this.setFocusOnTrigger();
  }

  /**
   * 将焦点设置到触发器元素
   */
  setFocusOnTrigger() {
    (this.triggerRef as HTMLZaneButtonElement).setFocus
      ? (this.triggerRef as HTMLZaneButtonElement).setFocus()
      : this.triggerRef.focus();
  }

  /**
   * 显示下拉菜单的回调函数
   */
  showPopover = () => {
    this.open = true;
    setTimeout(() => {
      this.menuRef.setFocus();
      this.openEvent.emit();
    });
  };

  /**
   * 监听window的click事件
   * 处理点击外部关闭下拉菜单
   * @Listen 装饰器监听window的click事件
   * @param evt 点击事件对象
   */
  @Listen('click', { target: 'window' })
  windowClickHandler(evt) {
    this.popoverController.windowClickHandler(evt);
  }
}
