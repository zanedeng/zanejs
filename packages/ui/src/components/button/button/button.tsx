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
  Watch,
} from '@stencil/core';
import { throttle } from 'lodash';

import {
  getComponentIndex,
  hasSlot,
  isDarkMode,
  isLightOrDark,
  observeThemeChange,
} from '../../../utils';

/**
 * 预定义的按钮颜色集合
 * @type {Set<string>}
 */
const PREDEFINED_BUTTON_COLORS = new Set([
  'black',    // 黑色
  'danger',   // 危险操作(红色)
  'error',    // 错误状态
  'info',     // 信息提示
  'primary',  // 主品牌色
  'secondary',// 次要品牌色
  'success',  // 成功状态(绿色)
  'warning',  // 警告状态(黄色)
  'white',    // 白色
]);

/**
 * 多功能按钮组件
 *
 * 提供丰富的交互样式和状态管理，支持：
 * - 多种视觉变体(variant)
 * - 完整的大小(size)控制
 * - 主题颜色(color)系统
 * - 暗黑模式适配
 * - 完善的ARIA可访问性
 * - 图标集成
 * - 加载状态
 *
 * @example 基础使用
 * ```html
 * <zane-button>普通按钮</zane-button>
 * <zane-button variant="outline">轮廓按钮</zane-button>
 * <zane-button icon="settings" iconAlign="start">带图标按钮</zane-button>
 * ```
 *
 * @example 高级使用
 * ```html
 * <zane-button
 *   color="danger"
 *   darkModeColor="warning"
 *   variant="ghost.simple"
 *   size="xl"
 *   disabled
 *   disabledReason="权限不足"
 * >
 *   危险操作
 * </zane-button>
 * ```
 */
@Component({
  shadow: true,
  styleUrl: 'button.scss',
  tag: 'zane-button',
})
export class Button implements ComponentInterface {

  /**
   * 附加数据对象
   *
   * 会在点击事件中回传，用于携带上下文数据
   * @type {any}
   */
  @Prop() appendData: any;

  /**
   * 按钮点击事件
   *
   * 触发时会返回包含appendData的事件对象
   * @event zane-button--click
   * @type {EventEmitter<{ appendData: any }>}
   */
  @Event({ eventName: 'zane-button--click' }) clickEvent: EventEmitter<{
    appendData: any;
  }>;

  /**
   * 按钮主题色
   *
   * 支持预设颜色或自定义颜色名称(需在CSS中定义对应变量)
   * @type {'black' | 'danger' | 'primary' | 'secondary' | 'success' | 'warning' | 'white'}
   * @default 'primary'
   *
   * @example 预设颜色
   * - 'primary': 品牌主色
   * - 'danger': 危险操作红色
   * - 'success': 成功操作绿色
   *
   * @example 自定义颜色
   * 需在CSS中定义: --color-custom和--color-custom-10等变量
   */
  @Prop({ reflect: true }) color:
    | 'black'
    | 'danger'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'white' = 'primary';
  @State() computedColor: string;

  /**
   * ARIA 可访问性配置
   * 可动态修改并反映到DOM属性
   * @type {Object}
   * @default {}
   */
  @Prop({ mutable: true, reflect: true }) configAria: any = {};

  /**
   * 暗黑模式下的替代颜色
   *
   * 当检测到暗黑模式时自动切换为此颜色
   * @type {'black' | 'danger' | 'primary' | 'secondary' | 'success' | 'warning' | 'white'}
   */
  @Prop({ reflect: true }) darkModeColor?:
    | 'black'
    | 'danger'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'white';

  /**
   * 按钮禁用状态
   * @type {boolean}
   * @default false
   * @reflectToAttr
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  /**
   * 禁用原因说明
   *
   * 会以ARIA方式提供给辅助技术，提升可访问性
   * @type {string}
   * @default ''
   */
  @Prop() disabledReason: string = '';

  /**
   * 是否获得焦点状态
   * @internal
   */
  @State() hasFocus = false;

  /**
   * 鼠标悬停状态
   * @internal
   */
  @State() hasHover = false;

  /**
   * 宿主元素引用
   * @internal
   */
  @Element() host!: HTMLElement;

  /**
   * 链接地址（使按钮表现为链接）
   * 设置后按钮渲染为 <a> 标签
   */
  @Prop({ reflect: true }) href: string;

  /**
   * 图标名称
   *
   * 指定要显示的图标，需要配合zane-icon组件使用
   * @type {string}
   */
  @Prop() icon?: string;

  /**
   * 图标对齐方式
   *
   * 控制图标相对于文本的位置
   * @type {'end' | 'start'}
   * @default 'end'
   *
   * @description
   * - 'start': 图标在文本左侧
   * - 'end': 图标在文本右侧
   */
  @Prop() iconAlign: 'end' | 'start' = 'end';

  /**
   * 激活状态（按下状态）
   * @internal
   */
  @State() isActive = false;

  /**
   * 按钮选中状态
   *
   * 常用于按钮组或切换场景
   * @type {boolean}
   * @default false
   * @reflectToAttr
   */
  @Prop({ reflect: true }) selected: boolean = false;

  /**
   * 显示加载指示器
   *
   * 设置为true时会显示旋转加载图标并禁用交互
   * @type {boolean}
   * @default false
   */
  @Prop() showLoader: boolean = false;

  /**
   * 按钮尺寸
   *
   * 支持从xs到2xl共6种预设尺寸
   * @type {'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'}
   * @default 'md'
   * @reflectToAttr
   *
   * @description
   * - xs: 超小尺寸(24px)
   * - sm: 小尺寸(32px)
   * - md: 中尺寸(40px)
   * - lg: 大尺寸(48px)
   * - xl: 超大尺寸(56px)
   * - 2xl: 特大尺寸(64px)
   */
  @Prop({ reflect: true }) size: '2xl' | 'lg' | 'md' | 'sm' | 'xl' | 'xs' =
    'md';

  /**
   * 插槽是否有内容
   * @internal
   */
  @State() slotHasContent = false;

  /**
   * 链接打开目标（当href存在时有效）
   * @default '_self'
   */
  @Prop() target: string = '_self';

  /**
   * 点击事件节流延迟(ms)
   * @default 200
   */
  @Prop() throttleDelay = 200;

  /**
   * 是否为切换型按钮
   * 启用时点击会保持激活状态
   * @default false
   */
  @Prop() toggle: boolean = false;

  /**
   * 按钮类型（当作为表单按钮时）
   * - 'button': 普通按钮
   * - 'reset': 表单重置按钮
   * - 'submit': 表单提交按钮
   * @default 'button'
   */
  @Prop() type: 'button' | 'reset' | 'submit' = 'button';


  /**
   * 按钮视觉变体
   *
   * 支持基础变体和带.simple后缀的简化变体
   * @type {
   *   'default' | 'default.simple'  |
   *   'ghost' | 'ghost.simple'  |
   *   'light' | 'light.simple'  |
   *   'link' | 'link.simple'  |
   *   'neo' | 'neo.simple'  |
   *   'outline' | 'outline.simple'
   * }
   * @default 'default'
   * @reflectToAttr
   *
   * @description
   * - default: 实心填充按钮
   * - ghost: 透明背景按钮
   * - light: 浅色背景按钮
   * - link: 链接样式按钮
   * - neo: 新拟态风格按钮
   * - outline: 边框轮廓按钮
   * - .simple: 简化版变体(减少视觉效果)
   */
  @Prop({ reflect: true }) variant:
    | 'default'
    | 'default.simple'
    | 'ghost'
    | 'ghost.simple'
    | 'light'
    | 'light.simple'
    | 'link'
    | 'link.simple'
    | 'neo'
    | 'neo.simple'
    | 'outline'
    | 'outline.simple' = 'default';

  private buttonElm?: HTMLDivElement;

  private gid: string = getComponentIndex();

  private handleClickWithThrottle: () => void;

  private nativeElement: HTMLButtonElement;
  private tabindex?: number | string;

  /**
   * 监听颜色变化
   * @internal
   */
  @Watch('color')
  @Watch('darkModeColor')
  colorChanged() {
    this.#computedColor();
  }

  /**
   * 组件渲染完成后
   * 根据颜色亮度设置对比度变量
   */
  componentDidRender() {
    if (this.#computeColorLightOrDark() === 'dark') {
      this.buttonElm.style.setProperty(
        '--internal-button-support-contrast-color',
        `var(--zane-button-support-contrast-color, white)`,
      );
    } else {
      this.buttonElm.style.setProperty(
        '--internal-button-support-contrast-color',
        `var(--zane-button-support-contrast-color, black)`,
      );
    }
  }

  /**
   * 组件加载前
   * 初始化属性/状态/事件监听
   */
  componentWillLoad() {
    // If the zane-button has a tabindex attribute we get the value
    // and pass it down to the native input, then remove it from the
    // zane-button to avoid causing tabbing twice on the same element
    if (this.host.hasAttribute('tabindex')) {
      const tabindex = this.host.getAttribute('tabindex');
      this.tabindex = tabindex === null ? undefined : tabindex;
      this.host.removeAttribute('tabindex');
    }
    if (this.host.getAttributeNames)
      this.host.getAttributeNames().forEach((name: string) => {
        if (name.includes('aria-')) {
          this.configAria[name] = this.host.getAttribute(name);
          this.host.removeAttribute(name);
        }
      });
    this.#computeSlotHasContent();
    this.#computedColor();
    observeThemeChange(() => {
      this.#computedColor();
    });
  }

  /**
   * 组件连接后
   * 初始化节流函数
   */
  connectedCallback() {
    this.handleClickWithThrottle = throttle(
      this.handleClick,
      this.throttleDelay,
    );
  }

  /**
   * 点击事件处理器
   * 触发zane-button--click事件
   */
  handleClick = () => {
    this.clickEvent.emit({
      appendData: this.appendData,
    });
  };

  /**
   * 主渲染函数
   * @returns {JSX.Element} 组件虚拟DOM树
   */
  render() {
    const NativeElementTag = this.#getNativeElementTagName();

    const variants = this.variant?.split('.');
    if (
      ['default', 'ghost', 'light', 'link', 'neo', 'outline'].includes(
        variants[0],
      ) === false
    ) {
      variants.unshift('default');
    }

    const [variant, subVariant] = variants as [string, string?];

    const hostStyle: any = {};
    if (subVariant === 'block') {
      hostStyle.display = `block`;
      hostStyle.width = `100%`;
    }

    const style = {};
    if (!PREDEFINED_BUTTON_COLORS.has(this.computedColor)) {
      style['--internal-button-color'] = `var(--color-${this.computedColor})`;
      style['--internal-button-color-light'] =
        `var(--color-${this.computedColor}-10)`;
      style['--internal-button-color-neo'] =
        `var(--color-${this.computedColor}-50)`;
      style['--internal-button-color-hover'] =
        `var(--color-${this.computedColor}-70, var(--color-${this.computedColor}-hover-60))`;
      style['--internal-button-color-active'] =
        `var(--color-${this.computedColor}-80)`;
    }

    return (
      <Host active={this.isActive} style={hostStyle}>
        <div
          class={{
            [`color-${this.computedColor}`]: true,
            [`color-is-${this.#computeColorLightOrDark()}`]: true,
            [`size-${this.size}`]: true,
            [`variant-${subVariant}`]: !!subVariant,
            [`variant-${variant}`]: true,
            active: this.isActive,
            button: true,
            disabled: this.disabled,
            'has-content': this.slotHasContent,
            'has-focus': this.hasFocus,
            'has-icon': !!this.icon,
            hover: this.hasHover,
            selected: this.selected,
            'show-loader': this.showLoader,
          }}
          ref={(elm: HTMLDivElement) => (this.buttonElm = elm)}
          style={style}
        >
          <div class="button-neo-background" />
          <div class="button-background" />
          <NativeElementTag
            aria-describedby={
              this.disabled && this.disabledReason
                ? `disabled-reason-${this.gid}`
                : null
            }
            aria-disabled={`${this.disabled || this.showLoader}`}
            class="native-button"
            href={this.href}
            onBlur={() => this.#onBlur()}
            onClick={(evt) => this.#onClick(evt)}
            onFocus={() => this.#onFocus()}
            onKeyDown={(evt) => this.#onKeyDown(evt)}
            onKeyUp={(evt) => this.#onKeyUp(evt)}
            onMouseDown={() => this.#onMouseDown()}
            onMouseOut={() => this.#onMouseOut()}
            onMouseOver={() => this.#onMouseOver()}
            ref={(elm: HTMLButtonElement) => (this.nativeElement = elm)}
            role="button"
            tabindex={this.tabindex}
            target={this.target}
            type={this.type}
            {...this.configAria}
          >
            <div class="button-content">
              {!this.showLoader &&
                this.icon &&
                this.iconAlign === 'start' &&
                this.#renderIcon(this.icon)}

              <div class="slot-container">
                <slot onSlotchange={() => this.#computeSlotHasContent()} />
              </div>

              {this.showLoader && (
                <zane-spinner
                  class="spinner loader inherit"
                  hideBackground={true}
                />
              )}

              {!this.showLoader &&
                this.icon &&
                this.iconAlign === 'end' &&
                this.#renderIcon(this.icon)}
            </div>
          </NativeElementTag>
          {this.#renderDisabledReason()}
        </div>
      </Host>
    );
  }

  /**
   * 以编程方式使按钮失去焦点
   * @method
   * @async
   * @returns {Promise<void>}
   */
  @Method()
  async setBlur() {
    this.nativeElement.blur();
    this.hasFocus = false;
  }

  /**
   * 以编程方式聚焦按钮
   * @method
   * @async
   * @returns {Promise<void>}
   */
  @Method()
  async setFocus() {
    this.nativeElement.focus();
    this.hasFocus = true;
  }

  /**
   * 以编程方式触发按钮点击
   * @method
   * @async
   * @returns {Promise<void>}
   */
  @Method()
  async triggerClick() {
    this.nativeElement.click();
  }

  @Listen('keyup', { target: 'window' })
  windowKeyUp(evt: { key: string }) {
    if (this.isActive && !this.toggle && evt.key === ' ') this.isActive = false;
  }

  @Listen('mouseup', { target: 'window' })
  windowMouseUp() {
    if (this.isActive && !this.toggle) this.isActive = false;
  }

  /**
   * 计算当前颜色的亮度模式
   *
   * @private
   * @returns {'light' | 'dark'} 返回颜色亮度类型
   */
  #computeColorLightOrDark() {
    if (!this.buttonElm) return;
    let color = getComputedStyle(this.buttonElm).getPropertyValue(
      `--internal-button-color`,
    );
    if (this.variant !== 'link') {
      if (this.hasHover)
        color = getComputedStyle(this.buttonElm).getPropertyValue(
          `--internal-button-color-hover`,
        );
      if (this.isActive || this.selected)
        color = getComputedStyle(this.buttonElm).getPropertyValue(
          `--internal-button-color-active`,
        );
    }
    return isLightOrDark(color);
  }

  /**
   * 计算最终使用的颜色
   *
   * 考虑暗黑模式自动切换
   * @private
   */
  #computedColor() {
    this.computedColor = this.color;
    if (isDarkMode() && this.darkModeColor) {
      this.computedColor = this.darkModeColor;
    }
  }

  #computeSlotHasContent() {
    this.slotHasContent = hasSlot(this.host);
  }

  #getNativeElementTagName() {
    return this.href ? 'a' : 'button';
  }

  #onBlur = () => {
    this.hasFocus = false;
  };

  #onClick(evt: MouseEvent) {
    if (!this.disabled && !this.showLoader) {
      this.handleClickWithThrottle();
    } else {
      evt.preventDefault();
      evt.stopPropagation();
      evt.stopImmediatePropagation();
    }
  }

  #onFocus = () => {
    this.hasFocus = true;
  };

  #onKeyDown = (evt: KeyboardEvent) => {
    if (
      !this.disabled &&
      !this.showLoader &&
      (evt.key === 'Enter' || evt.key === ' ')
    ) {
      if (this.href) {
        evt.preventDefault();
        this.isActive = true;
        this.handleClickWithThrottle();
        window.open(this.href, this.target);
      } else {
        evt.preventDefault();
        this.isActive = this.toggle ? !this.isActive : true;
        this.handleClickWithThrottle();
      }
    }
  };

  #onKeyUp = (evt: KeyboardEvent) => {
    if (
      !this.disabled &&
      !this.showLoader &&
      !this.toggle &&
      (evt.key === 'Enter' || evt.key === ' ')
    ) {
      this.isActive = false;
    }
  };

  #onMouseDown = () => {
    this.isActive = this.toggle ? !this.isActive : true;
  };

  #onMouseOut = () => {
    this.hasHover = false;
  };

  #onMouseOver = () => {
    this.hasHover = true;
  };

  #renderDisabledReason() {
    if (this.disabled && this.disabledReason)
      return (
        <div class="sr-only" id={`disabled-reason-${this.gid}`} role="tooltip">
          {this.disabledReason}
        </div>
      );
  }

  /**
   * 渲染图标元素
   *
   * @private
   * @param {string} iconName 图标名称
   * @returns {JSX.Element} 图标组件
   */
  #renderIcon(iconName: string) {
    return <zane-icon class="icon inherit" name={iconName} />;
  }
}
