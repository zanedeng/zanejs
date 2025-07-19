import type { InputComponentInterface } from '../../interfaces';

import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import { debounceEvent, getComponentIndex } from '../../utils';

/**
 * 数字输入框组件 zane-number
 *
 * 核心功能：
 * 1. 支持数字输入及增减按钮控制
 * 2. 提供四种状态反馈（默认/成功/警告/错误）
 * 3. 表单验证支持（必填/禁用/只读）
 * 4. 防抖事件处理与无障碍访问优化
 * 5. 插槽扩展能力（前后扩展区域）
 *
 * @implements {ComponentInterface}
 * @implements {InputComponentInterface}
 * @part input - 原生输入框元素（可通过::part CSS定制）
 */
@Component({
  shadow: true,
  styleUrl: 'input-number.scss',
  tag: 'zane-number',
})
export class InputNumber
  implements ComponentInterface, InputComponentInterface
{

  gid: string = getComponentIndex();

  @Element() elm!: HTMLElement;

  /**
   * 自动填充控制
   * - `on`: 允许浏览器自动填充
   * - `off`: 禁用自动填充
   * @default 'off'
   */
  @Prop() autocomplete: 'off' | 'on' = 'off';

  @Prop({ mutable: true, reflect: true }) configAria: any = {};

  /**
   * 防抖延迟(ms)
   * - 控制 zane-number--change 事件触发频率
   * @default 300
   */
  @Prop() debounce = 300;

  @Prop({ reflect: true }) disabled: boolean = false;

  @Prop() helperText: string;

  /**
 * 操作按钮可见性控制
  * - true: 隐藏增减按钮
  * - false: 显示（默认）
  * @attr
  */
  @Prop({ reflect: true }) hideActions: boolean = false;

  @Prop({ reflect: true }) inline: boolean = false;

  @Prop() invalid: boolean = false;

  @Prop() invalidText: string;

  @Prop() label: string;

  @Prop() name: string = `zane-input-${this.gid}`;

  @Prop() placeholder: string;

  @Prop({ reflect: true }) readonly: boolean = false;

  @Prop({ reflect: true }) required: boolean = false;

  /**
   * 尺寸规格
   * - `sm`: 小尺寸(高度约32px)
   * - `md`: 中尺寸(高度约40px)
   * - `lg`: 大尺寸(高度约48px)
   * @attr
   * @default 'md'
   */
  @Prop({ reflect: true }) size: 'lg' | 'md' | 'sm' = 'md';

  @Prop() skeleton: boolean = false;

  /**
   * 组件状态标识
   * - `default`: 默认状态（无特殊样式）
   * - `success`: 成功状态（通常用绿色标识）
   * - `warning`: 警告状态（通常用橙色标识）
   * - `error`: 错误状态（通常用红色标识）
   * @attr
   * @default 'default'
   */
  @Prop({ reflect: true }) state: 'default' | 'error' | 'success' | 'warning' =
    'default';

  /**
   * 输入值（数字类型）
   * - 支持 null 表示空值
   * - 使用 mutable 实现双向绑定
   * @example <zane-number value={5} />
   */
  @Prop({ mutable: true }) value?: null | number = null;

  @Prop() warn: boolean = false;

  @Prop() warnText: string;

  @State() hasFocus = false;

  @State() endSlotHasContent = false;

  @State() startSlotHasContent = false;

  @State() passwordVisible = false;

  /**
   * 失去焦点事件
   * @event zane-number--blur
   * @param {FocusEvent} ev - 焦点事件对象
   */
  @Event({ eventName: 'zane-number--blur' }) zaneBlur: EventEmitter;

  /**
   * 数字变化事件（防抖处理）
   * @event zane-number--change
   * @param {KeyboardEvent} ev - 键盘事件对象
   * @property {number} value - 当前输入值
   */
  @Event({ eventName: 'zane-number--change' }) zaneChange: EventEmitter;

  /**
   * 获得焦点事件
   * @event zane-number--focus
   * @param {FocusEvent} ev - 焦点事件对象
   */
  @Event({ eventName: 'zane-number--focus' }) zaneFocus: EventEmitter;

  /**
   * 实时输入事件
   * @event zane-number--input
   * @param {KeyboardEvent} ev - 原始输入事件
   */
  @Event({ eventName: 'zane-number--input' }) zaneInput: EventEmitter;
  private nativeElement?: HTMLInputElement;
  private tabindex?: number | string;

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
    this.startSlotHasContent = !!this.elm.querySelector('[slot="start"]');
    this.endSlotHasContent = !!this.elm.querySelector('[slot="end"]');
  }

  connectedCallback() {
    this.debounceChanged();
  }

  /**
   * 获取组件全局唯一标识
   * @returns {string} 组件ID
   */
  @Method()
  async getComponentId() {
    return this.gid;
  }

  getLabel() {
    return this.skeleton ? (
      <div class="label skeleton" />
    ) : (
      <label class="label">
        {this.required && <span class="required">*</span>}
        {this.label}
      </label>
    );
  }

  render() {
    return (
      <Host
        has-focus={this.hasFocus}
        has-value={this.hasValue()}
        invalid={this.invalid}
        warn={this.warn}
      >
        <div class={{ 'form-control': true, inline: this.inline }}>
          {this.label && this.getLabel()}
          <div class="field">
            {this.skeleton ? (
              <div class="input-container-skeleton" />
            ) : (
              this.renderInput()
            )}
          </div>
          {this.renderHelper()}
        </div>
      </Host>
    );
  }

  renderHelper() {
    if (this.invalid)
      return <div class="helper invalid">{this.invalidText}</div>;
    else if (this.warn) return <div class="helper warn">{this.warnText}</div>;
    else if (this.helperText || this.helperText === '')
      return <div class="helper text">{this.helperText}</div>;
  }

  renderInput() {
    return (
      <div
        class={{
          disabled: this.disabled,
          'end-slot-has-content': this.endSlotHasContent,
          'has-focus': this.hasFocus,
          'input-container': true,
          'start-slot-has-content': this.startSlotHasContent,
        }}
      >
        <div class="slot-container start">
          <slot name="start" />
        </div>

        <input
          autoComplete={this.autocomplete}
          class="input input-native"
          disabled={this.disabled}
          name={this.name}
          onBlur={this.blurHandler}
          onFocus={this.focusHandler}
          onInput={this.inputHandler}
          placeholder={this.placeholder}
          readOnly={this.readonly}
          ref={(input) => (this.nativeElement = input)}
          required={this.required}
          tabIndex={this.tabindex}
          type="number"
          value={this.value}
          {...this.configAria}
        />

        {!this.readonly && !this.disabled && !this.hideActions && (
          <zane-button
            aria-label="Decrease"
            class="input-action"
            color={'secondary'}
            icon="subtract"
            onGoat-button--click={(evt) => {
              this.decrease(evt);
            }}
            size={this.size}
            variant="ghost.simple"
          ></zane-button>
        )}

        {!this.readonly && !this.disabled && !this.hideActions && (
          <zane-button
            class="input-action"
            color={'secondary'}
            icon="add"
            onGoat-button--click={(evt) => {
              this.increment(evt);
            }}
            size={this.size}
            variant="ghost.simple"
          ></zane-button>
        )}

        <div class="slot-container end">
          <slot name="end" />
        </div>
      </div>
    );
  }

  @Method()
  async setBlur() {
    if (this.nativeElement) {
      this.nativeElement.blur();
      this.hasFocus = false;
    }
  }

  @Method()
  async setFocus() {
    if (this.nativeElement) {
      this.nativeElement.focus();
      this.hasFocus = true;
    }
  }

  @Watch('debounce')
  protected debounceChanged() {
    this.zaneChange = debounceEvent(this.zaneChange, this.debounce);
  }

  private blurHandler = (ev: FocusEvent) => {
    this.hasFocus = false;
    this.zaneBlur.emit(ev);
  };

  /**
   * 数字递减操作
   * @param {Event} ev - 触发事件对象
   */
  private decrease(ev) {
    if (this.value === undefined || this.value === null) this.value = 0;
    if (typeof this.value === 'number') {
      this.value = (this.value || 0) - 1;
      this.zaneChange.emit(ev);
    }
  }

  private focusHandler = (ev: FocusEvent) => {
    this.hasFocus = true;
    this.zaneFocus.emit(ev);
  };

  private getValue(): string {
    return (this.value || '').toString();
  }

  private hasValue(): boolean {
    return this.getValue().length > 0;
  }

  /**
   * 数字递增操作
   * @param {Event} ev - 触发事件对象
   */
  private increment(ev) {
    if (this.value === undefined || this.value === null) this.value = 0;
    if (typeof this.value === 'number') {
      this.value = (this.value || 0) + 1;
      this.zaneChange.emit(ev);
    }
  }
  private inputHandler = (ev: Event) => {
    const input = ev.target as HTMLInputElement | null;
    const oldValue = this.value;
    if (input) {
      this.value =
        input.value === '' || input.value === undefined
          ? null
          : JSON.parse(input.value);
    }
    this.zaneInput.emit(ev as KeyboardEvent);
    if (oldValue !== this.value) {
      this.zaneChange.emit(ev as KeyboardEvent);
    }
  };
}
