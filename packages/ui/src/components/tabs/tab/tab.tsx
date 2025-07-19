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
  State,
} from '@stencil/core';

import { getComponentIndex } from '../../../utils';

/**
 * 单个标签页元素，支持多种交互状态和类型
 *
 */
@Component({
  shadow: true,
  styleUrl: 'tab.scss',
  tag: 'zane-tab',
})
export class Tab implements ComponentInterface {
  /**
   * 是否禁用标签
   *
   * @type {boolean}
   * @prop disabled
   * @default false
   * @reflect
   */

  @Prop({ reflect: true }) disabled: boolean = false;

  /**
   * 禁用状态提示信息（支持无障碍访问）
   *
   * @type {string}
   * @prop disabledReason
   * @default ''
   */
  @Prop() disabledReason: string = '';

  // 组件唯一标识符
  gid: string = getComponentIndex();

  /**
   * 焦点状态跟踪
   *
   * @type {boolean}
   * @state hasFocus
   */
  @State() hasFocus = false;

  // 宿主元素引用
  @Element() host!: HTMLElement;

  /**
   * 链接地址（存在时渲染为<a>标签）
   *
   * @type {string}
   * @prop href
   */
  @Prop({ reflect: true }) href: string;

  /**
   * 图标名称（内置图标库）
   *
   * @type {string}
   * @prop icon
   */
  @Prop() icon: string;

  /**
   * 激活状态（用于点击效果）
   *
   * @type {boolean}
   * @state isActive
   */
  @State() isActive = false;

  /**
   * 标签文本（备用显示内容）
   *
   * @type {string}
   * @prop label
   */
  @Prop() label: string;

  /**
   * 选中状态（与父级Tabs组件联动）
   *
   * @type {boolean}
   * @prop selected
   * @default false
   * @reflect
   */
  @Prop({ reflect: true }) selected: boolean = false;

  /**
   * 显示加载指示器
   *
   * @type {boolean}
   * @prop showLoader
   * @default false
   */
  @Prop() showLoader: boolean = false;

  /**
   * 插槽内容存在状态
   *
   * @type {boolean}
   * @state slotHasContent
   */
  @State() slotHasContent = false;

  /**
   * 关联面板标识
   *
   * @type {string}
   * @prop target
   */
  @Prop() target: string;

  /**
   * 标签类型（需与父级Tabs组件同步）
   *
   * @type {'contained' | 'contained-bottom' | 'default'}
   * @prop type
   * @default 'default'
   * @reflect
   */
  @Prop({ reflect: true }) type: 'contained' | 'contained-bottom' | 'default' =
    'default';

  /**
   * 标签值（用于表单场景）
   *
   * @type {string}
   * @prop value
   */
  @Prop() value: string;

  /**
   * 标签点击事件（冒泡给父级Tabs）
   *
   * @event zane-tab--click
   * @type {EventEmitter<{element: HTMLElement; target: string; value: string}>}
   */
  @Event({ eventName: 'zane-tab--click' }) zaneTabClick: EventEmitter;

  /** 原生元素引用（动态切换button/a） */
  private nativeElement?: HTMLButtonElement;

  /** 原始tabindex缓存  */
  private tabindex?: number | string;

  /**
   * 组件加载前初始化
   */
  componentWillLoad() {
    if (this.host.hasAttribute('tabindex')) {
      const tabindex = this.host.getAttribute('tabindex');
      this.tabindex = tabindex === null ? undefined : tabindex;
      this.host.removeAttribute('tabindex');
    }
    this.slotHasContent = this.host.hasChildNodes();
  }

  render() {
    const NativeElementTag = this.#getNativeElementTagName();

    return (
      <Host active={this.isActive} has-focus={this.hasFocus}>
        <div
          class={{
            [`type-${this.type}`]: true,
            active: this.isActive,
            disabled: this.disabled,
            'has-content': this.slotHasContent,
            'has-focus': this.hasFocus,
            selected: this.selected,
            'show-loader': this.showLoader,
            tab: true,
          }}
        >
          <div class="tab-background" />
          <NativeElementTag
            aria-describedby={
              this.disabled && this.disabledReason
                ? `disabled-reason-${this.gid}`
                : null
            }
            aria-disabled={`${this.disabled || this.showLoader}`}
            class="native-button"
            disabled={this.disabled}
            href={this.href}
            onBlur={this.blurHandler}
            onClick={this.#clickHandler}
            onFocus={this.focusHandler}
            onKeyDown={this.#keyDownHandler}
            onMouseDown={this.mouseDownHandler}
            ref={(elm) => (this.nativeElement = elm)}
            tabindex={this.tabindex}
            target={'_blank'}
          >
            <div class="tab-content">
              {this.showLoader && (
                <zane-spinner class="spinner inherit" size="1rem" />
              )}

              {!this.showLoader && this.icon && (
                <zane-icon class="icon inherit" name={this.icon} size="1rem" />
              )}

              {!this.showLoader && (
                <div class="slot-container">
                  <slot />
                </div>
              )}

              {!this.showLoader && this.href && (
                <zane-icon class="icon inherit" name={'launch'} size="1rem" />
              )}
            </div>
          </NativeElementTag>
          {this.renderDisabledReason()}
        </div>
      </Host>
    );
  }

  /**
   * 设置焦点（公共方法）
   *
   * @method setFocus
   */
  @Method()
  async setFocus() {
    if (this.nativeElement) {
      this.nativeElement.focus();
    }
  }

  /**
   * 触发点击（公共方法）
   *
   * @method triggerClick
   */
  @Method()
  async triggerClick() {
    if (this.nativeElement) {
      this.nativeElement.click();
    }
  }

  /**
   * 全局空格键释放监听（用于取消激活状态）
   * @listens window:keyup
   * @param {KeyboardEvent} evt - 键盘事件对象
   */
  @Listen('keyup', { target: 'window' })
  windowKeyUp(evt) {
    if (this.isActive && evt.key === ' ') this.isActive = false;
  }

  /**
   * 全局鼠标释放监听（用于取消激活状态）
   * @listens window:mouseup
   */
  @Listen('mouseup', { target: 'window' })
  windowMouseUp() {
    if (this.isActive) this.isActive = false;
  }

  /**
   * 点击事件核心处理器（私有方法）
   * 触发条件：非禁用状态、非加载中、非外链场景
   * @emits zane-tab--click
   * @private
   */
  #clickHandler = () => {
    if (!this.disabled && !this.showLoader && !this.href) {
      this.zaneTabClick.emit({
        element: this.host,
        target: this.target,
        value: this.value,
      });
    }
  };

  /**
   * 动态获取原生标签类型（私有方法）
   * @returns {'a' | 'button'} 根据href存在性决定渲染元素
   * @private
   */
  #getNativeElementTagName() {
    return this.href ? 'a' : 'button';
  }

  /**
   * 键盘交互处理器（私有方法）
   * @param {KeyboardEvent} evt - 键盘事件对象
   * @private
   */
  #keyDownHandler(evt: KeyboardEvent) {
    if (!this.disabled && !this.showLoader) {
      if (!this.href && evt.key === 'Enter') {
        evt.preventDefault();
        this.isActive = true;
        this.#clickHandler();
      } else if (this.href && (evt.key === 'Enter' || evt.key === ' ')) {
        evt.preventDefault();
        this.isActive = true;
        this.#clickHandler();
        window.open(this.href, '_blank');
      }
    }
  }

  private blurHandler = () => {
    this.hasFocus = false;
  };

  private focusHandler = () => {
    this.hasFocus = true;
  };

  private mouseDownHandler = () => {
    this.isActive = true;
  };

  /**
   * 渲染无障碍提示信息
   * @returns {JSX.Element | null} 隐藏式提示元素
   * @private
   */
  private renderDisabledReason() {
    if (this.disabled && this.disabledReason)
      return (
        <div class="sr-only" id={`disabled-reason-${this.gid}`} role="tooltip">
          {this.disabledReason}
        </div>
      );
  }
}
