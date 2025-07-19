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
 * 自定义输入框组件 zane-input
 *
 * 实现功能：
 * 1. 支持多种输入类型（文本、密码、邮箱等）及尺寸控制
 * 2. 包含表单验证状态（错误/警告）及辅助文本展示
 * 3. 提供前后插槽(start/end)扩展能力
 * 4. 支持防抖事件处理与无障碍访问
 * 5. 集成密码可见性切换功能
 *
 */
@Component({
  shadow: true,
  styleUrl: './input.scss',
  tag: 'zane-input',
})
export class Input implements ComponentInterface, InputComponentInterface {

  /**
   * 自动填充控制
   * - `on`: 允许浏览器自动填充
   * - `off`: 禁用自动填充
   * @default 'off'
   */
  @Prop() autocomplete: 'off' | 'on' = 'off';

  /**
   * 动态ARIA属性配置对象
   * - 收集宿主元素上所有`aria-*`属性并转移到内部input元素
   * - 需通过mutable允许组件内修改
   */
  @Prop({ mutable: true, reflect: true }) configAria: any = {};

  /**
   * 输入内容变化事件(zane-input--change)的防抖延迟(ms)
   * @default 300
   */
  @Prop() debounce = 300;

  /**
   * 禁用状态
   * - 设置后阻止用户交互
   * @attr
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  @Element() elm!: HTMLElement;

  gid: string = getComponentIndex();

  /**
   * 辅助说明文本
   * - 在非错误/警告状态下显示
   */
  @Prop() helperText: string;

  /**
   * 行内布局模式
   * - 设置后标签与输入框水平排列
   * @attr
   */
  @Prop({ reflect: true }) inline: boolean = false;

  /**
   * 验证失败状态
   * - 激活时会显示invalidText并应用错误样式
   */
  @Prop() invalid: boolean = false;

  /**
   * 验证失败提示文本
   * - 当invalid=true时显示
   */
  @Prop() invalidText: string;

  /**
   * 输入框标签文本
   * - 显示在输入区域上方
   */
  @Prop() label: string;

  /**
   * 输入框名称
   * - 用于表单提交时识别字段
   * - 默认生成唯一ID: zane-input-{gid}
   */
  @Prop() name: string = `zane-input-${this.gid}`;

  /**
   * 占位提示文本
   */
  @Prop() placeholder: string;

  /**
   * 只读状态
   * - 允许查看但禁止修改内容
   * @attr
   */
  @Prop({ reflect: true }) readonly: boolean = false;

  /**
   * 必填标识
   * - 显示红色星号(*)并触发浏览器原生验证
   * @attr
   */
  @Prop({ reflect: true }) required: boolean = false;

  /**
   * 尺寸控制
   * - `sm`: 小尺寸(高度32px)
   * - `md`: 中尺寸(高度40px)
   * - `lg`: 大尺寸(高度48px)
   * @default 'md'
   * @attr
   */
  @Prop({ reflect: true }) size: 'lg' | 'md' | 'sm' = 'md';

  /**
   * 骨架屏模式
   * - 加载状态时显示灰色占位块
   */
  @Prop() skeleton: boolean = false;

  /**
   * 输入类型
   * - `text`: 普通文本
   * - `password`: 密码(带可见切换按钮)
   * - `email`: 邮箱格式验证
   * - `tel`: 电话号码输入
   * @default 'text'
   */
  @Prop() type: 'email' | 'password' | 'tel' | 'text' = 'text';

  /**
   * 输入框值
   * - 使用双向数据绑定
   */
  @Prop({ mutable: true }) value: string;

  /**
   * 警告状态
   * - 非致命性错误提示，显示warnText
   */
  @Prop() warn: boolean = false;

  /**
   * 警告提示文本
   * - 当warn=true时显示
   */
  @Prop() warnText: string;

  /**
   * 输入框聚焦状态
   * - 控制宿主元素has-focus属性
   */
  @State() hasFocus = false;

  /**
   * 密码可见性状态
   * - 仅当type=password时生效
   * - true: 显示明文
   * - false: 显示掩码
   */
  @State() passwordVisible = false;

  /**
   * 检测start插槽是否有内容
   * - 用于动态调整输入框内边距
   */
  @State() startSlotHasContent = false;

  /**
   * 检测end插槽是否有内容
   * - 用于动态调整输入框内边距
   */
  @State() endSlotHasContent = false;

  /**
   * 失去焦点事件
   * @event zane-input--blur
   * @param {FocusEvent} ev - 原生焦点事件对象
   */
  @Event({ eventName: 'zane-input--blur' }) zaneBlur: EventEmitter;

  /**
   * 防抖后的值变更事件
   * @event zane-input--change
   * @param {KeyboardEvent} ev - 键盘事件对象(防抖处理)
   */
  @Event({ eventName: 'zane-input--change' }) zaneChange: EventEmitter;

  /**
   * 获得焦点事件
   * @event zane-input--focus
   * @param {FocusEvent} ev - 原生焦点事件对象
   */
  @Event({ eventName: 'zane-input--focus' }) zaneFocus: EventEmitter;

  /**
   * 实时输入事件
   * @event zane-input--input
   * @param {KeyboardEvent} ev - 每次按键触发的键盘事件
   */
  @Event({ eventName: 'zane-input--input' }) zaneInput: EventEmitter;
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
   * 获取组件唯一ID
   * @returns {string} 组件全局唯一标识(gid)
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
              <div class="input-container-skeleton skeleton" />
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
    const type =
      this.type === 'password' && this.passwordVisible ? 'text' : this.type;

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
          onInput={(evt) => this.inputHandler(evt)}
          placeholder={this.placeholder}
          readOnly={this.readonly}
          ref={(input) => (this.nativeElement = input)}
          required={this.required}
          tabIndex={this.tabindex}
          type={type}
          value={this.value}
          {...this.configAria}
        />

        {this.type === 'password' && (
          <zane-tooltip
            content={this.passwordVisible ? 'Show password' : 'Hide password'}
          >
            <zane-button
              color={'secondary'}
              icon={this.passwordVisible ? 'view--off' : 'view'}
              onGoat-button--click={() => {
                this.passwordVisible = !this.passwordVisible;
              }}
              size={this.size}
              variant="ghost.simple"
            ></zane-button>
          </zane-tooltip>
        )}

        <div class="slot-container end">
          <slot name="end" />
        </div>
      </div>
    );
  }

  /**
   * 移除输入框焦点
   * - 同时更新hasFocus状态
   */
  @Method()
  async setBlur() {
    if (this.nativeElement) {
      this.nativeElement.blur();
      this.hasFocus = false;
    }
  }

  /**
   * 激活输入框焦点
   * - 同时更新hasFocus状态
   */
  @Method()
  async setFocus() {
    if (this.nativeElement) {
      this.nativeElement.focus();
      this.hasFocus = true;
    }
  }

  /**
   * 防抖配置变更监听
   * - 当debounce属性变化时更新事件防抖设置
   */
  @Watch('debounce')
  protected debounceChanged() {
    this.zaneChange = debounceEvent(this.zaneChange, this.debounce);
  }

  /** 输入框失焦处理函数 */
  private blurHandler = (ev: FocusEvent) => {
    this.hasFocus = false;
    this.zaneBlur.emit(ev);
  };

  /** 输入框聚焦处理函数 */
  private focusHandler = (ev: FocusEvent) => {
    this.hasFocus = true;
    this.zaneFocus.emit(ev);
  };

  /** 获取当前输入值的字符串表示 */
  private getValue(): string {
    return (this.value || '').toString();
  }

  /** 检测输入值是否非空 */
  private hasValue(): boolean {
    return this.getValue().length > 0;
  }

  /**
   * 输入事件处理
   * - 更新value值
   * - 触发zaneInput/zaneChange事件
   */
  private inputHandler = (ev: Event) => {
    const input = ev.target as HTMLInputElement | null;
    const oldValue = this.value;
    if (input) {
      this.value = input.value;
    }
    this.zaneInput.emit(ev as KeyboardEvent);
    if (oldValue !== this.value) {
      this.zaneChange.emit(ev as KeyboardEvent);
    }
  };
}
