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

import { getComponentIndex } from '../../../utils';
import PopoverController from './popover-controller';

/**
 * 弹出框组件（Popover）
 *
 * @component zane-popover
 * @shadow true
 *
 * @description
 * `zane-popover` 是一个灵活的弹出框组件，可以在目标元素周围显示内容。它支持多种触发方式（点击、悬停、手动控制）、多种箭头样式以及自定义位置。
 *
 * 使用此组件时，需要在组件内部放置一个 `zane-popover-content` 组件作为弹出内容，以及一个触发元素（例如按钮）。
 *
 * @example
 * <zane-popover trigger="click">
 *   <button>点击我</button>
 *   <zane-popover-content>
 *     这里是弹出内容
 *   </zane-popover-content>
 * </zane-popover>
 */
@Component({
  shadow: true,
  styleUrl: 'popover.scss',
  tag: 'zane-popover',
})
export class Popover implements ComponentInterface {

  /**
   * 当弹出框关闭时发出的事件
   *
   * @event zane-popover--close
   */
  @Event({ eventName: 'zane-popover--close' }) closeEvent: EventEmitter;

  /**
   * 弹出框关闭的动画时间（毫秒）
   *
   * @prop {number} [dismissTimeout=300]
   */
  @Prop() dismissTimeout: number = 300;

  /** 组件实例的唯一标识符 */
  gid: string = getComponentIndex();

  /** 宿主元素引用 */
  @Element() host!: HTMLElement;

  /**
   * 弹出框与目标元素之间的偏移量（像素）
   *
   * @prop {number} [offset=4]
   */
  @Prop() offset: number = 4;

  /**
   * 控制弹出框的打开状态
   *
   * @prop {boolean} [open=false]
   * @mutable
   * @reflect
   */
  @Prop({ mutable: true, reflect: true }) open: boolean = false;

  /**
   * 当弹出框打开时发出的事件
   *
   * @event zane-popover--open
   */
  @Event({ eventName: 'zane-popover--open' }) openEvent: EventEmitter;

  /**
   * 弹出框打开的动画时间（毫秒）
   *
   * @prop {number} [openTimeout=200]
   */
  @Prop() openTimeout: number = 200;

  /**
   * 弹出框的位置偏好设置，使用逗号分隔的字符串，例如："top,bottom"
   *
   * 当 `tip` 属性为 'tab' 时，默认设置为 'bottom-end,bottom-start,top-end,top-start'
   *
   * @prop {string} [placements]
   * @mutable
   */
  @Prop({ mutable: true }) placements: string;

  /** 弹出框控制器实例 */
  popoverController: PopoverController;

  /** 插槽元素的引用，用于获取触发元素 */
  slotRef: HTMLSlotElement;

  /**
   * 弹出框的箭头样式
   *
   * @prop {'caret' | 'none' | 'tab'} [tip='caret']
   *
   * - 'caret': 使用一个三角形的箭头（默认）。
   * - 'none': 没有箭头。
   * - 'tab': 使用一个类似标签页的箭头，通常用于下拉菜单。
   *
   * @default 'caret'
   * @reflect
   */
  @Prop({ reflect: true }) tip: 'caret' | 'none' | 'tab' = 'caret';

  /**
   * 触发弹出框的方式
   *
   * @prop {'click' | 'hover' | 'manual'} [trigger='hover']
   *
   * - 'click': 点击触发元素时打开/关闭弹出框。
   * - 'hover': 鼠标悬停在触发元素上时打开，移开时关闭。
   * - 'manual': 手动控制，通过调用组件的 `show()` 和 `hide()` 方法控制。
   *
   * @default 'hover'
   */
  @Prop() trigger: 'click' | 'hover' | 'manual' = 'hover';

  /**
   * 组件加载完成生命周期方法
   *
   * 在此方法中初始化弹出框控制器，并设置触发元素。
   */
  async componentDidLoad() {
    const contentRef = this.host.querySelector('zane-popover-content');

    if (!contentRef) {
      throw new Error(
        'The zane-popover component requires a zane-popover-content component to be present.',
      );
    }

    const arrowRef = contentRef.shadowRoot.querySelector(
      '.arrow',
    ) as HTMLElement;

    this.popoverController = new PopoverController(
      this.host,
      this.trigger,
      this.open,
      contentRef as HTMLElement,
      this.tip === 'tab' ? 0 : this.offset,
      this.tip === 'tab' ? 8 : 0,
      this.showPopover,
      this.hidePopover,
      this.placements,
      this.openTimeout,
      this.dismissTimeout,
      this.tip === 'caret' ? arrowRef : null,
    );

    let triggerRef = this.slotRef.assignedElements()[0] as HTMLElement;
    if (triggerRef.nodeName === 'SLOT') {
      const assignedElements = (
        triggerRef as HTMLSlotElement
      ).assignedElements();
      if (
        assignedElements.length > 0 &&
        assignedElements[0].nodeName !== 'ZANE-POPOVER-CONTENT'
      ) {
        triggerRef = assignedElements[0] as HTMLSlotElement;
      }
    }

    if (triggerRef) {
      this.popoverController.registerTarget(triggerRef);
      this.popoverController.setTriggerRef(triggerRef);
    }

    if (this.open) {
      const triggerObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            this.popoverController.computePositionThrottle('onLoad');
            triggerObserver.disconnect();
          }
        },
        {
          threshold: [0, 1],
        },
      );
      triggerObserver.observe(triggerRef);
    }
  }

  /**
   * 组件更新生命周期方法
   *
   * 当组件的状态或属性发生变化时，更新弹出框控制器的状态，并在需要时重新计算位置。
   */
  componentDidUpdate() {
    this.popoverController.setOpen(this.open);
    if (this.open) {
      this.popoverController.computePositionThrottle('onUpdate');
    }
  }

  /**
   * 组件将要加载生命周期方法
   *
   * 在组件加载前，根据 `tip` 属性设置默认的弹出位置（如果未提供 `placements` 且 `tip` 为 'tab'）。
   */
  componentWillLoad() {
    if (this.tip === 'tab' && !this.placements) {
      this.placements = 'bottom-end,bottom-start,top-end,top-start';
    }
  }

  /**
   * 组件卸载生命周期方法
   *
   * 清理弹出框控制器的资源，移除事件监听器等。
   */
  disconnectedCallback() {
    this.popoverController.destroy();
  }

  /**
   * 隐藏弹出框的公共方法
   *
   * @method hide
   * @async
   */
  @Method()
  async hide() {
    this.open = false;
  }

  /**
   * 内部使用的隐藏弹出框函数
   *
   * 将 `open` 状态设置为 false，并发出关闭事件。
   */
  hidePopover = () => {
    this.open = false;
    this.closeEvent.emit();
  };

  /**
   * 渲染组件
   *
   * @returns {JSX.Element} 组件的虚拟DOM表示
   */
  render() {
    return (
      <Host gid={this.gid}>
        <div
          class={{
            [`tip-${this.tip}`]: true,
            open: this.open,
            popover: true,
          }}
        >
          <slot ref={(el) => (this.slotRef = el as HTMLSlotElement)} />
        </div>
      </Host>
    );
  }

  /**
   * 监听窗口的 resize 事件
   *
   * 当窗口大小改变时，重新计算弹出框的位置（使用节流）。
   *
   * @listens window:resize
   */
  @Listen('resize', { target: 'window' })
  resizeHandler() {
    this.popoverController.computePositionThrottle('resize');
  }

  /**
   * 显示弹出框的公共方法
   *
   * @method show
   * @async
   * @param {HTMLElement} [target] - 可选的触发元素。如果提供，将使用此元素作为触发元素。
   */
  @Method()
  async show(target?: HTMLElement) {
    if (target) {
      this.popoverController.registerTarget(target);
      this.popoverController.setTriggerRef(target);
    }
    this.showPopover();
  }

  /**
   * 内部使用的显示弹出框函数
   *
   * 将 `open` 状态设置为 true，并在短暂的延迟后发出打开事件（以确保动画效果）。
   */
  showPopover = () => {
    this.open = true;
    setTimeout(() => this.openEvent.emit());
  };

  /**
   * 监听窗口的点击事件
   *
   * 用于实现点击外部关闭弹出框的功能（当触发方式为 'click' 时）。
   *
   * @listens window:click
   * @param {MouseEvent} evt - 点击事件对象
   */
  @Listen('click', { target: 'window' })
  windowClickHandler(evt) {
    this.popoverController.windowClickHandler(evt);
  }
}
