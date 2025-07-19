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

import { getComponentIndex } from '../../../utils';

/**
 * 菜单项组件 (zane-menu-item)
 *
 * @component zane-menu-item
 * @slot - 主内容区域（必填）
 * @slot end - 右侧附加内容区域（如图标/徽章）
 * @shadow true
 *
 * @description
 * 实现标准导航菜单项的核心组件，提供：
 * - 多状态交互（正常/选中/禁用/聚焦）
 * - 8种语义化色彩主题
 * - 可选中标记功能（带对勾图标）
 * - 原生链接支持（href/target）
 * - 键盘导航支持（空格/回车触发）
 * - 无障碍ARIA兼容设计
 *
 * @example
 * <!-- 基础文本菜单项 -->
 * <zane-menu-item>个人中心</zane-menu-item>
 *
 * <!-- 带图标和选中状态的菜单项 -->
 * <zane-menu-item selected selectable>
 *   收件箱
 *   <zane-badge slot="end">12</zane-badge>
 * </zane-menu-item>
 *
 * <!-- 作为链接的菜单项 -->
 * <zane-menu-item
 *   href="/settings"
 *   color="primary"
 *   target="_blank">
 *   系统设置
 * </zane-menu-item>
 *
 * @designSystem
 * | 状态         | 视觉特征                     |
 * |--------------|----------------------------|
 * | 正常         | 浅灰背景，深灰文字          |
 * | 悬停         | 浅蓝色背景（#f0f7ff）       |
 * | 聚焦         | 2px蓝色边框（#1a73e8）      |
 * | 选中         | 左侧蓝色条+对勾图标         |
 * | 禁用         | 50%透明度，阻止交互事件     |
 */
@Component({
  shadow: true,
  styleUrl: 'menu-item.scss',
  tag: 'zane-menu-item',
})
export class MenuItem {
  /**
   * 菜单项色彩主题
   * @prop {string} color - 预定义色彩方案，默认'default'
   * @options
   * - 'black'：深黑商务风
   * - 'danger'：错误操作（红）
   * - 'default'：中性灰（默认）
   * - 'primary'：品牌主色（蓝）
   * - 'secondary'：辅助色（紫）
   * - 'success'：成功状态（绿）
   * - 'warning'：警示操作（黄）
   * - 'white'：浅色模式专用
   */
  @Prop() color:
    | 'black'
    | 'danger'
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'white' = 'default';

  /**
   * 禁用状态开关
   * @prop {boolean} disabled - 禁用交互并降低透明度（默认false）
   * @designNote 禁用时阻止所有点击/键盘事件传递
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  @Element() elm!: HTMLElement;

  @State() endSlotHasContent = false;

  gid: string = getComponentIndex();

  @State() hasFocus = false;

  /**
   * 链接目标地址
   * @prop {string} href - 设置后组件渲染为<a>元素（默认undefined）
   * @behavior 点击时自动执行 window.open(href,  target)
   */
  @Prop({ reflect: true }) href: string;

  @State() isActive = false;

  /**
   * 视觉层级
   * @prop {string} layer - 背景透明度层级（默认继承父菜单）
   * @options '01'|'02'|'background'
   */
  @Prop({ reflect: true }) layer?: '01' | '02' | 'background';

  /**
   * 可选状态开关
   * @prop {boolean} selectable - 启用选中标记功能（默认false）
   * @visualEffect 激活时显示左侧选中条和对勾图标
   */
  @Prop({ reflect: true }) selectable: boolean = false;

  /**
   * 选中状态
   * @prop {boolean} selected - 标记为选中项（需selectable=true）
   * @renderCondition 当selectable=true时显示选中状态视觉
   */
  @Prop({ reflect: true }) selected: boolean = false;

  @State() startSlotHasContent = false;

  /**
   * 链接打开方式
   * @prop {string} target - 同<a>标签target属性（默认'_self'）
   */
  @Prop() target: string = '_self';

  /**
   * 菜单项值
   * @prop {string|number} value - 事件传递的标识值（默认innerText）
   * @emitChange 点击事件中作为payload.value 传递
   */
  @Prop({ mutable: true }) value?: null | number | string;

  /**
   * 菜单项点击事件
   * @event zane-menu-item--click
   * @payload { value: string|number }
   * @description 点击时触发（禁用状态不触发）
   */
  @Event({ eventName: 'zane-menu-item--click' })
  zaneMenuItemClick: EventEmitter;

  private nativeElement?: HTMLElement;
  private tabindex?: number | string = 1;

  async componentWillLoad() {
    if (this.elm.hasAttribute('tabindex')) {
      const tabindex = this.elm.getAttribute('tabindex');
      this.tabindex = tabindex === null ? undefined : tabindex;
      this.elm.removeAttribute('tabindex');
    }
    this.endSlotHasContent = !!this.elm.querySelector('[slot="end"]');
  }

  /**
   * 动态确定根元素类型
   * @private
   * @returns {'a'|'div'} href存在时为<a>，否则为<div>
   */
  getNativeElementTagName() {
    return this.href ? 'a' : 'div';
  }

  /**
   * 核心渲染逻辑
   * @returns {JSX.Element} 组件虚拟DOM树
   *
   * @renderProcess
   * 1. Host容器：承载状态属性（active/focus）
   * 2. 动态根元素：根据href决定使用<a>或<div>
   * 3. 三栏式布局：
   *    - Start区：选中状态图标（条件渲染）
   *    - Main区：默认插槽（主内容）
   *    - End区：end插槽（附加内容）
   *
   * @a11y 实现：
   * - aria-disabled：屏幕阅读器禁用状态声明
   * - 键盘空格/回车：触发点击事件
   * - 焦点可视化：has-focus状态样式
   */
  render = () => {
    const NativeElementTag = this.getNativeElementTagName();

    return (
      <Host active={this.isActive} has-focus={this.hasFocus}>
        <NativeElementTag
          aria-disabled={this.disabled}
          class={{
            [`color-${this.color}`]: true,
            active: this.isActive,
            disabled: this.disabled,
            'end-slot-has-content': this.endSlotHasContent,
            'has-focus': this.hasFocus,
            'menu-item': true,
            selected: this.selected,
          }}
          href={this.href}
          onBlur={this.blurHandler}
          onClick={this.clickHandler}
          onFocus={this.focusHandler}
          onKeyDown={this.keyDownHandler}
          onMouseDown={this.mouseDownHandler}
          ref={(el) => (this.nativeElement = el as HTMLElement)}
          tabindex={this.tabindex}
          target={this.target}
        >
          {this.selectable && (
            <div class="item-section start">
              {this.selected && (
                <zane-icon class="checkmark" name="checkmark" />
              )}
            </div>
          )}

          <div class="item-section slot-main">
            <slot />
          </div>

          <div class="item-section slot-end">
            <slot name="end" />
          </div>
        </NativeElementTag>
      </Host>
    );
  };

  /**
   * 移除焦点方法
   * @method setBlur
   * @public
   * @description 通过编程方式使菜单项失去焦点
   * @usage 常用于菜单关闭时清除焦点状态
   */
  @Method()
  async setBlur() {
    if (this.nativeElement) {
      this.nativeElement.blur();
    }
  }

  /**
   * 获取焦点方法
   * @method setFocus
   * @public
   * @description 通过编程方式聚焦菜单项
   * @usage 常用于键盘导航时移动焦点
   */
  @Method()
  async setFocus() {
    if (this.nativeElement) {
      this.nativeElement.focus();
    }
  }

  /**
   * 全局键盘释放监听
   * @listens window:keyup
   * @private
   * @param {KeyboardEvent} evt - 键盘事件对象
   */
  @Listen('keyup', { target: 'window' })
  windowKeyUp(evt) {
    if (this.isActive && evt.key === ' ') this.isActive = false;
  }

  /**
   * 全局鼠标释放监听
   * @listens window:mouseup
   * @private
   */
  @Listen('mouseup', { target: 'window' })
  windowMouseUp() {
    if (this.isActive) this.isActive = false;
  }

  private blurHandler = () => {
    this.hasFocus = false;
  };

  /**
   * 点击事件处理器
   * @private
   * @param {MouseEvent} event - 原始点击事件
   */
  private clickHandler = (event) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.setFocus();
      this.zaneMenuItemClick.emit({
        value: this.value || this.elm.innerText,
      });
      if (this.href) window.open(this.href, this.target);
    }
  };

  private focusHandler = () => {
    this.hasFocus = true;
  };

  /**
   * 键盘事件处理器
   * @private
   * @param {KeyboardEvent} evt - 键盘事件对象
   */
  private keyDownHandler = (evt) => {
    if (evt.key === ' ' || evt.key === 'Enter') {
      evt.preventDefault();
      this.isActive = true;
      this.clickHandler(evt);
    }
  };

  private mouseDownHandler = () => {
    this.isActive = true;
  };
}
