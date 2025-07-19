import type { InputComponentInterface } from '../../interfaces';

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

import { getComponentIndex } from '../../utils';

/**
 * 自定义复选框组件
 *
 * 实现可定制的复选框控件，支持选中/未选/中间态三种状态，
 * 提供完整的ARIA支持、键盘交互和事件响应机制。
 *
 * @example
 * ```html
 * <zane-checkbox
 *   label="同意协议"
 *   size="md"
 *   layer="02"
 *   rounded
 *   required
 * ></zane-checkbox>
 * ```
 */
@Component({
  shadow: true,
  styleUrl: 'checkbox.scss',
  tag: 'zane-checkbox',
})
export class Checkbox implements ComponentInterface, InputComponentInterface {
  /**
   * ARIA属性配置对象
   *
   * 用于动态设置ARIA属性（如aria-label, aria-describedby等），
   * 组件会自动收集元素上所有`aria-*`属性到该对象。
   *
   * @defaultValue `{}`
   */
  @Prop({ mutable: true, reflect: true }) configAria: any = {};

  /**
   * 禁用状态
   *
   * 当设置为`true`时，组件不可交互且视觉上变灰
   *
   * @defaultValue `false`
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** 宿主元素实例 */
  @Element() elm!: HTMLElement;

  /** 组件唯一ID（自动生成） */
  gid: string = getComponentIndex();

  /** 焦点状态（内部使用） */
  @State() hasFocus = false;

  /**
   * 中间态状态
   *
   * 当设置为`true`时显示"-"图标，表示部分选中状态，
   * 与`value`属性互斥（中间态时`value`应为false）
   *
   * @defaultValue `false`
   */
  @Prop({ mutable: true }) intermediate: boolean = false;

  /** 激活状态（按下鼠标/空格键时） */
  @State() isActive = false;

  /** 复选框标签文本 */
  @Prop() label: string;

  /**
   * 视觉层级
   *
   * 控制组件在UI中的层级深度，影响阴影和背景色：
   * - `01`: 表层组件（最高层级）
   * - `02`: 中层组件
   * - `background`: 背景层组件（最低层级）
   */
  @Prop({ reflect: true }) layer?: '01' | '02' | 'background';

  /** 表单字段名（自动生成） */
  @Prop() name: string = `zane-input-${this.gid}`;

  /** 只读状态 */
  @Prop({ reflect: true }) readonly: boolean = false;

  /** 必填状态 */
  @Prop({ reflect: true }) required: boolean = false;

  /** 圆角样式 */
  @Prop() rounded: boolean = false;

  /**
   * 尺寸规格
   *
   * - `lg`: 大尺寸(48px)
   * - `md`: 中尺寸(40px)
   * - `sm`: 小尺寸(32px)
   *
   * @defaultValue `'md'`
   */
  @Prop() size: 'lg' | 'md' | 'sm' = 'md';

  /** 是否存在插槽内容 */
  @State() slotHasContent = false;

  /**
   * 选中状态
   *
   * 当设置为`true`时显示选中图标，
   * 与`intermediate`属性互斥
   *
   * @defaultValue `false`
   */
  @Prop({ mutable: true }) value: boolean = false;

  /** 失去焦点事件 */
  @Event({ eventName: 'zane-checkbox--blur' }) zaneBlur: EventEmitter;

  /** 值变更事件 */
  @Event({ eventName: 'zane-checkbox--change' }) zaneChange: EventEmitter;

  /** 获得焦点事件 */
  @Event({ eventName: 'zane-checkbox--focus' }) zaneFocus: EventEmitter;

  /** 图标容器元素引用 */
  private iconContainer?: HTMLElement;

  /** 原生input元素引用 */
  private nativeElement?: HTMLInputElement;

  /** 自定义tabindex值 */
  private tabindex?: number | string = 1;

  /**
   * 组件加载前生命周期
   *
   * 1. 处理宿主元素上的tabindex属性
   * 2. 收集所有ARIA属性到configAria对象
   * 3. 检测是否存在插槽内容
   */
  componentWillLoad() {
    if (this.elm.hasAttribute('tabindex')) {
      const tabindex = this.elm.getAttribute('tabindex');
      this.tabindex = tabindex === null ? undefined : tabindex;
      this.elm.removeAttribute('tabindex');
    }
    this.elm.getAttributeNames().forEach((name: string) => {
      if (name.includes('aria-')) {
        this.configAria[name] = this.elm.getAttribute(name);
        this.elm.removeAttribute(name);
      }
    });
    this.slotHasContent = this.elm.hasChildNodes();
  }

  /**
   * 获取组件ID
   *
   * @returns 组件唯一标识符
   */
  @Method()
  async getComponentId() {
    return this.gid;
  }

  /**
   * 渲染函数
   *
   * 生成复选框的DOM结构，包含：
   * 1. 可视化的复选框图标
   * 2. 隐藏的原生input元素
   * 3. 标签区域（支持文本或插槽）
   */
  render() {
    return (
      <Host active={this.isActive} has-focus={this.hasFocus}>
        <label
          class={{
            [`size-${this.size}`]: true,
            active: this.isActive,
            checkbox: true,
            disabled: this.disabled,
            'has-content': this.slotHasContent,
            'has-focus': this.hasFocus,
            readonly: this.readonly,
            required: this.required,
            rounded: this.rounded,
            'state-checked': this.value,
            'state-intermediate': !this.value && this.intermediate,
          }}
        >
          <div
            aria-checked={`${this.value}`}
            aria-disabled={`${this.disabled}`}
            aria-required={`${this.required}`}
            class="box"
            onBlur={this.blurHandler}
            onFocus={this.focusHandler}
            onKeyDown={this.keyDownHandler}
            onKeyUp={(evt) => {
              if (evt.keyCode === 13) {
                this.clickHandler(evt);
              }
            }}
            onMouseDown={this.mouseDownHandler}
            ref={(elm) => (this.iconContainer = elm)}
            role="checkbox"
            tabindex={this.tabindex}
            {...this.configAria}
          >
            <div class="tick" />
          </div>

          <input
            aria-hidden="true"
            checked={this.value}
            class="input-native"
            name={this.name}
            onClick={this.clickHandler}
            ref={(elm) => (this.nativeElement = elm)}
            required={this.required}
            tabindex="-1"
            type="checkbox"
            value={`${this.value}`}
          />

          {(() => {
            return this.label ? (
              <div class="label">{this.label}</div>
            ) : (
              <div class="label slot-container">
                <slot />
              </div>
            );
          })()}
        </label>
      </Host>
    );
  }

  /**
   * 移除焦点
   */
  @Method()
  async setBlur() {
    if (this.nativeElement) {
      this.nativeElement.blur();
    }
  }

  /**
   * 设置焦点
   */
  @Method()
  async setFocus() {
    if (this.nativeElement) {
      this.nativeElement.focus();
    }
  }

  /** 全局空格键释放监听 */
  @Listen('keyup', { target: 'window' })
  windowKeyUp(evt) {
    if (this.isActive && evt.key === ' ') this.isActive = false;
  }

  /** 全局鼠标释放监听 */
  @Listen('mouseup', { target: 'window' })
  windowMouseUp() {
    if (this.isActive) this.isActive = false;
  }

  /** 失去焦点处理 */
  private blurHandler = (ev: FocusEvent) => {
    this.hasFocus = false;
    this.zaneBlur.emit(ev);
  };

  /** 点击/Enter键处理 */
  private clickHandler = (ev: KeyboardEvent | MouseEvent) => {
    if (!this.disabled && !this.readonly) {
      this.value = !JSON.parse(this.nativeElement.value);
      this.intermediate = false;
      this.zaneChange.emit(ev);
      this.iconContainer.focus();
    }
  };

  /** 获得焦点处理 */
  private focusHandler = (ev: FocusEvent) => {
    this.hasFocus = true;
    this.zaneFocus.emit(ev);
  };

  /** 空格键按下处理 */
  private keyDownHandler = (evt) => {
    if (evt.key === ' ') {
      evt.preventDefault();
      this.isActive = true;
      this.clickHandler(evt);
    }
  };

  /** 鼠标按下处理 */
  private mouseDownHandler = () => {
    this.isActive = true;
  };
}
