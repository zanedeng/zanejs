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
 * 多功能文本区域输入组件
 *
 * 提供完整的表单文本区域解决方案，支持响应式布局、表单验证、辅助文本提示和丰富的交互功能。
 * 集成了 ARIA 可访问性支持和多状态反馈设计，适用于复杂表单场景。
 *
 * @example
 * <!-- 基础用法 -->
 * <zane-textarea label="用户反馈" placeholder="请输入您的建议"></zane-textarea>
 *
 * <!-- 带验证状态 -->
 * <zane-textarea
 *   label="密码"
 *   state="error"
 *   invalid-text="密码长度不足8位"
 * ></zane-textarea>
 */
@Component({
  shadow: true,
  styleUrl: './textarea.scss',
  tag: 'zane-textarea',
})
export class Textarea implements ComponentInterface, InputComponentInterface {

  /**
   * 是否显示清除按钮
   *
   * 设置为 true 时，在输入框有内容时会显示清除按钮
   *
   * @prop clearable
   * @type {boolean}
   * @default false
   */
  @Prop() clearable = false;

  /**
   * ARIA 属性配置
   *
   * 存储动态收集的 ARIA 属性，用于增强组件可访问性。
   * 组件加载时会自动收集宿主元素上的 aria-* 属性。
   *
   * @prop configAria
   * @type {any}
   * @mutable
   * @reflect
   */
  @Prop({ mutable: true, reflect: true }) configAria: any = {};

  /**
   * 输入事件防抖时间（毫秒）
   *
   * 减少频繁输入事件的处理频率，优化性能
   *
   * @prop debounce
   * @type {number}
   * @default 300
   */
  @Prop() debounce = 300;

  /**
   * 禁用状态
   *
   * 设置为 true 时，组件不可交互且样式变灰
   *
   * @prop disabled
   * @type {boolean}
   * @default false
   * @reflect
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  /**
   * 宿主元素引用
   *
   * 提供对组件宿主 DOM 元素的访问
   *
   * @prop elm
   * @type {HTMLElement}
   */
  @Element() elm!: HTMLElement;

  /**
   * 尾部插槽内容状态
   *
   * 检测是否在 slot[name="end"] 插槽中添加了内容
   *
   * @state endSlotHasContent
   * @type {boolean}
   */
  @State() endSlotHasContent = false;

  /**
   * 组件全局唯一ID
   *
   * 用于表单关联和标识
   *
   * @type {string}
   */
  gid: string = getComponentIndex();

  /**
   * 焦点状态
   *
   * 跟踪文本域是否获得焦点
   *
   * @state hasFocus
   * @type {boolean}
   */
  @State() hasFocus = false;

  /**
   * 辅助提示文本
   *
   * 显示在输入区域下方的帮助信息
   *
   * @prop helperText
   * @type {string}
   */
  @Prop() helperText: string;

  /**
   * 行内布局模式
   *
   * 设置为 true 时，标签和输入框水平排列
   *
   * @prop inline
   * @type {boolean}
   * @default false
   * @reflect
   */
  @Prop({ reflect: true }) inline: boolean = false;

  /**
   * 错误验证状态
   *
   * 设置为 true 时显示错误样式和错误文本
   *
   * @prop invalid
   * @type {boolean}
   * @default false
   */
  @Prop() invalid: boolean = false;

  /**
   * 错误提示文本
   *
   * 当 invalid 为 true 时显示的错误信息
   *
   * @prop invalidText
   * @type {string}
   */
  @Prop() invalidText: string;

  /**
   * 输入框标签文本
   *
   * 显示在输入区域上方的描述标签
   *
   * @prop label
   * @type {string}
   */
  @Prop() label: string;

  /**
   * 表单字段名称
   *
   * 用于表单提交的字段名，默认自动生成唯一值
   *
   * @prop name
   * @type {string}
   * @default `zane-input-${gid}`
   */
  @Prop() name: string = `zane-input-${this.gid}`;

  /**
   * 占位符文本
   *
   * 输入框为空时显示的提示文本
   *
   * @prop placeholder
   * @type {string}
   */
  @Prop() placeholder: string;

  /**
   * 只读状态
   *
   * 设置为 true 时，内容不可编辑但可复制
   *
   * @prop readonly
   * @type {boolean}
   * @default false
   * @reflect
   */
  @Prop({ reflect: true }) readonly: boolean = false;

  /**
   * 必填状态
   *
   * 设置为 true 时，标签旁显示红色星号标记
   *
   * @prop required
   * @type {boolean}
   * @default false
   */
  @Prop() required: boolean = false;

  /**
   * 尺寸规格
   *
   * 控制输入框的整体尺寸：
   * - `lg`: 大尺寸（48px）
   * - `md`: 中尺寸（40px，默认）
   * - `sm`: 小尺寸（32px）
   *
   * @prop size
   * @type {'lg' | 'md' | 'sm'}
   * @default 'md'
   * @reflect
   */
  @Prop({ reflect: true }) size: 'lg' | 'md' | 'sm' = 'md';

  /**
   * 骨架屏状态
   *
   * 设置为 true 时显示加载占位样式
   *
   * @prop skeleton
   * @type {boolean}
   * @default false
   */
  @Prop() skeleton: boolean = false;

  /**
   * 输入状态标识
   *
   * 控制输入框的视觉状态反馈：
   * - `default`: 默认状态（无特殊样式）
   * - `error`: 错误状态（红色边框）
   * - `success`: 成功状态（绿色边框）
   * - `warning`: 警告状态（黄色边框）
   *
   * @prop state
   * @type {'default' | 'error' | 'success' | 'warning'}
   * @default 'default'
   * @reflect
   */
  @Prop({ reflect: true }) state: 'default' | 'error' | 'success' | 'warning' =
    'default';

  /**
   * 输入值
   *
   * 文本域的当前值，支持双向绑定
   *
   * @prop value
   * @type {string}
   * @mutable
   */
  @Prop({ mutable: true }) value: string;

  /**
   * 警告状态
   *
   * 设置为 true 时显示警告样式和警告文本
   *
   * @prop warn
   * @type {boolean}
   * @default false
   */
  @Prop() warn: boolean = false;

  /**
   * 警告提示文本
   *
   * 当 warn 为 true 时显示的警告信息
   *
   * @prop warnText
   * @type {string}
   */
  @Prop() warnText: string;

  /**
   * 操作按钮点击事件
   *
   * 当操作按钮（如清除按钮）被点击时触发
   *
   * @event zane-textarea--action-click
   * @type {EventEmitter}
   */
  @Event({ eventName: 'zane-textarea--action-click' })
  zaneActionClick: EventEmitter;

  /**
   * 失去焦点事件
   *
   * 当文本域失去焦点时触发
   *
   * @event zane-textarea--blur
   * @type {EventEmitter}
   */
  @Event({ eventName: 'zane-textarea--blur' }) zaneBlur: EventEmitter;

  /**
   * 值变更事件（防抖）
   *
   * 当文本域值变化且经过防抖处理后触发
   *
   * @event zane-textarea--change
   * @type {EventEmitter}
   */
  @Event({ eventName: 'zane-textarea--change' }) zaneChange: EventEmitter;

  /**
   * 获得焦点事件
   *
   * 当文本域获得焦点时触发
   *
   * @event zane-textarea--focus
   * @type {EventEmitter}
   */
  @Event({ eventName: 'zane-textarea--focus' }) zaneFocus: EventEmitter;

  /**
   * 输入事件（实时）
   *
   * 当文本域值变化时实时触发
   *
   * @event zane-textarea--input
   * @type {EventEmitter}
   */
  @Event({ eventName: 'zane-textarea--input' }) zaneInput: EventEmitter;

  /**
   * 原生文本域元素引用
   *
   * 用于直接操作文本域DOM
   *
   * @private
   * @type {HTMLTextAreaElement}
   */
  private nativeElement?: HTMLTextAreaElement;

  /**
   * 标签索引值
   *
   * 存储从宿主元素提取的tabindex值
   *
   * @private
   * @type {number | string}
   */
  private tabindex?: number | string;

  /**
   * 组件加载前生命周期
   *
   * 1. 提取宿主元素的 tabindex 属性
   * 2. 收集所有 aria-* 属性
   * 3. 检测 end 插槽内容
   */
  componentWillLoad() {
    // If the ion-input has a tabindex attribute we get the value
    // and pass it down to the native input, then remove it from the
    // ion-input to avoid causing tabbing twice on the same element
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
    this.endSlotHasContent = !!this.elm.querySelector('[slot="end"]');
  }

  /**
   * 组件连接后生命周期
   *
   * 初始化事件防抖设置
   */
  connectedCallback() {
    this.debounceChanged();
  }

  /**
   * 获取组件ID
   *
   * 公开方法，获取组件全局唯一ID
   *
   * @method getComponentId
   * @returns {Promise<string>}
   */
  @Method()
  async getComponentId() {
    return this.gid;
  }

  /**
   * 渲染标签
   *
   * 根据骨架屏状态渲染标签或占位符
   *
   * @private
   * @returns {JSX.Element}
   */
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

  /**
   * 主渲染方法
   *
   * 组织组件整体结构：
   * 1. 标签区域
   * 2. 输入区域
   * 3. 辅助信息区域
   *
   * @returns {JSX.Element}
   */
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

  /**
   * 渲染辅助信息
   *
   * 根据状态渲染不同类型的辅助文本：
   * 1. 错误状态 → 红色文本
   * 2. 警告状态 → 黄色文本
   * 3. 普通状态 → 灰色辅助文本
   *
   * @private
   * @returns {JSX.Element | null}
   */
  renderHelper() {
    if (this.invalid)
      return <div class="helper invalid">{this.invalidText}</div>;
    else if (this.warn) return <div class="helper warn">{this.warnText}</div>;
    else if (this.helperText || this.helperText === '')
      return <div class="helper text">{this.helperText}</div>;
  }

  /**
   * 渲染输入区域
   *
   * 包含文本域、操作按钮和尾部插槽
   *
   * @private
   * @returns {JSX.Element}
   */
  renderInput() {
    return (
      <div
        class={{
          disabled: this.disabled,
          'end-slot-has-content': this.endSlotHasContent,
          'has-focus': this.hasFocus,
          'input-container': true,
          readonly: this.readonly,
          textarea: true,
        }}
      >
        <textarea
          class="input input-native"
          disabled={this.disabled}
          name={this.name}
          onBlur={this.blurHandler}
          onFocus={this.focusHandler}
          onInput={this.inputHandler}
          onKeyDown={this.keyDownHandler}
          placeholder={this.placeholder}
          readonly={this.readonly}
          ref={(input) => (this.nativeElement = input)}
          required={this.required}
          rows={4}
          tabindex={this.tabindex}
          value={this.value}
          {...this.configAria}
        />

        <div class={'actions-container'}>
          {this.clearable && this.hasValue() && (
            <zane-button
              class="clear clear-action"
              color={'secondary'}
              icon="close"
              onClick={this.clearInput}
              size={this.size}
              variant="ghost"
            />
          )}
        </div>

        <div class="slot-container end">
          <slot name="end" />
        </div>
      </div>
    );
  }

  /**
   * 移除焦点
   *
   * 公开方法，使文本域失去焦点
   *
   * @method setBlur
   * @returns {Promise<void>}
   */
  @Method()
  async setBlur() {
    if (this.nativeElement) {
      this.nativeElement.blur();
      this.hasFocus = false;
    }
  }

  /**
   * 设置焦点
   *
   * 公开方法，使文本域获得焦点
   *
   * @method setFocus
   * @returns {Promise<void>}
   */
  @Method()
  async setFocus() {
    if (this.nativeElement) {
      this.nativeElement.focus();
      this.hasFocus = true;
    }
  }

  /**
   * 防抖时间变更监听
   *
   * 当 debounce 属性变化时更新防抖设置
   *
   * @watch debounce
   */
  @Watch('debounce')
  protected debounceChanged() {
    this.zaneChange = debounceEvent(this.zaneChange, this.debounce);
  }

  /**
   * 失去焦点处理
   *
   * 更新焦点状态并触发 zaneBlur 事件
   *
   * @private
   * @param {FocusEvent} ev
   */
  private blurHandler = (ev: FocusEvent) => {
    this.hasFocus = false;
    this.zaneBlur.emit(ev);
  };

  /**
   * 清除输入内容
   *
   * 清空文本域值并触发输入事件
   *
   * @private
   * @param {Event} evt
   */
  private clearInput = (evt: Event) => {
    this.nativeElement.value = '';
    this.inputHandler(evt);
  };

  /**
   * 获得焦点处理
   *
   * 更新焦点状态并触发 zaneFocus 事件
   *
   * @private
   * @param {FocusEvent} ev
   */
  private focusHandler = (ev: FocusEvent) => {
    this.hasFocus = true;
    this.zaneFocus.emit(ev);
  };

  /**
   * 获取当前值
   *
   * 返回文本域的当前字符串值
   *
   * @private
   * @returns {string}
   */
  private getValue(): string {
    return (this.value || '').toString();
  }

  /**
   * 获取当前值
   *
   * 返回文本域的当前字符串值
   *
   * @private
   * @returns {string}
   */
  private hasValue(): boolean {
    return this.getValue().length > 0;
  }

  /**
   * 输入处理
   *
   * 1. 更新 value 属性
   * 2. 触发实时输入事件
   * 3. 触发防抖后的变更事件
   *
   * @private
   * @param {Event} ev
   */
  private inputHandler = (ev: Event) => {
    const input = ev.target as HTMLInputElement | null;
    if (input) {
      this.value = input.value || '';
    }
    this.zaneInput.emit(ev as KeyboardEvent);
    this.zaneChange.emit(ev as KeyboardEvent);
  };

  /**
   * 按键处理
   *
   * 监听 ESC 键触发清除操作
   *
   * @private
   * @param {KeyboardEvent} ev
   */
  private keyDownHandler = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape' && this.clearable) {
      this.clearInput(ev);
    }
  };
}
