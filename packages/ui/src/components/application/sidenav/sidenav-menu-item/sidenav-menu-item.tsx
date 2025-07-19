import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State,
} from '@stencil/core';

import { getComponentIndex } from '../../../../utils';

/**
 * 侧边导航菜单项组件
 *
 * @Component 装饰器定义组件元数据
 * @shadow 启用Shadow DOM封装
 * @styleUrl 指定组件样式文件
 * @tag 定义组件在HTML中的标签名
 */
@Component({
  shadow: true,
  styleUrl: 'sidenav-menu-item.scss',
  tag: 'zane-sidenav-menu-item',
})
export class SidenavMenuItem {

  /**
   * 是否禁用菜单项
   * @type {boolean}
   * @default false
   * @reflect 属性值会反射到DOM属性
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  /**
   * 获取组件宿主元素引用
   * @type {HTMLElement}
   */
  @Element() elm!: HTMLElement;

  /**
   * 右侧插槽是否有内容
   * @type {boolean}
   * @State 内部状态变化会触发重新渲染
   */
  @State() endSlotHasContent = false;

  /**
   * 组件唯一标识符
   * @type {string}
   */
  gid: string = getComponentIndex();

  /**
   * 是否获得焦点状态
   * @type {boolean}
   */
  @State() hasFocus = false;

  /**
   * 激活状态(鼠标/键盘交互时)
   * @type {boolean}
   */
  @State() isActive = false;

  /**
   * 选中状态
   * @type {boolean}
   * @default false
   * @reflect 属性值会反射到DOM属性
   */
  @Prop({ reflect: true }) selected: boolean = false;

  /**
   * 左侧插槽是否有内容
   * @type {boolean}
   */
  @State() startSlotHasContent = false;

  /**
   * 菜单项值，支持null/数字/字符串类型
   * @type {null|number|string}
   * @mutable 可变的
   */
  @Prop({ mutable: true }) value?: null | number | string;

  /**
   * 菜单项点击事件
   * @type {EventEmitter}
   * @event zane:sidenav-menu-item-click
   */
  @Event({ eventName: 'zane:sidenav-menu-item-click' })
  zaneMenuItemClick: EventEmitter;

  private nativeElement?: HTMLElement;

  private tabindex?: number | string = 1;

  /**
   * 组件加载前生命周期
   * 初始化tabindex和插槽状态
   */
  componentWillLoad() {
    if (this.elm.hasAttribute('tabindex')) {
      const tabindex = this.elm.getAttribute('tabindex');
      this.tabindex = tabindex === null ? undefined : tabindex;
      this.elm.removeAttribute('tabindex');
    }
    this.startSlotHasContent = !!this.elm.querySelector('[slot="start"]');
    this.endSlotHasContent = !!this.elm.querySelector('[slot="end"]');
  }

  /**
   * 渲染组件
   * @returns {JSX.Element} 组件JSX结构
   */
  render = () => {
    return (
      <Host active={this.isActive} has-focus={this.hasFocus}>
        <div
          aria-disabled={this.disabled}
          class={{
            active: this.isActive,
            disabled: this.disabled,
            'end-slot-has-content': this.endSlotHasContent,
            'has-focus': this.hasFocus,
            selected: this.selected,
            'sidenav-menu-item': true,
            'start-slot-has-content': this.startSlotHasContent,
          }}
          onBlur={this.blurHandler}
          onClick={this.clickHandler}
          onFocus={this.focusHandler}
          onKeyDown={this.keyDownHandler}
          onMouseDown={this.mouseDownHandler}
          ref={(el) => (this.nativeElement = el as HTMLElement)}
          tabindex={this.tabindex}
        >
          <div class="item-section slot-start">
            <slot name="start" />
          </div>

          <div class="item-section slot-main">
            <slot />
          </div>

          <div class="item-section slot-end">
            <slot name="end" />
          </div>
        </div>
      </Host>
    );
  };

  /**
   * 移除焦点
   * @Method 装饰器定义公共API方法
   * @returns {Promise<void>}
   */
  @Method()
  async setBlur() {
    if (this.nativeElement) {
      this.nativeElement.blur();
    }
  }

  /**
   * 设置焦点
   * @Method 装饰器定义公共API方法
   * @returns {Promise<void>}
   */
  @Method()
  async setFocus() {
    if (this.nativeElement) {
      this.nativeElement.focus();
    }
  }

  /**
   * 监听全局键盘释放事件
   * @param {KeyboardEvent} evt 键盘事件对象
   */
  @Listen('keyup', { target: 'window' })
  windowKeyUp(evt) {
    if (this.isActive && evt.key === ' ') this.isActive = false;
  }

  /**
   * 监听全局鼠标释放事件
   */
  @Listen('mouseup', { target: 'window' })
  windowMouseUp() {
    if (this.isActive) this.isActive = false;
  }

  private blurHandler = () => {
    this.hasFocus = false;
  };

  private clickHandler = (event) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.zaneMenuItemClick.emit({
        value: this.value || this.elm.innerText,
      });
    }
  };

  private focusHandler = () => {
    this.hasFocus = true;
  };

  private keyDownHandler = (evt) => {
    if (evt.key === ' ') {
      evt.preventDefault();
      this.isActive = true;
      this.clickHandler(evt);
    }
  };

  private mouseDownHandler = () => {
    this.isActive = true;
  };
}
