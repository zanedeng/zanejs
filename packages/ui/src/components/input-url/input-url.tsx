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
 * 双模式URL输入组件
 *
 * @component zane-input-url
 * @tags form-control, input, url
 * @shadow true
 *
 * @description
 * 提供URL输入与预览双模式交互的输入组件。在展示模式下显示可点击的URL链接，
 * 在编辑模式下提供带验证功能的输入框。支持防抖值变化事件和实时URL验证。
 *
 * @example
 * <!-- 基础用法 -->
 * <zane-input-url
 *   value="https://example.com"
 *   placeholder="输入网站地址"
 * />
 *
 * <!-- 带尺寸控制 -->
 * <zane-input-url size="sm" />
 */
@Component({
  shadow: true,
  styleUrl: 'input-url.scss',
  tag: 'zane-input-url',
})
export class InputUrl implements ComponentInterface, InputComponentInterface {

  /**
   * 值变化事件的防抖时间（毫秒）
   * @type {number}
   * @default 300
   *
   * @description
   * 控制`valueChange`事件触发前的延迟时间，用于优化频繁输入时的性能表现。
   * 值越小响应越快，值越大可减少事件触发次数。
   */
  @Prop() debounce = 300;

  /**
   * 禁用状态
   * @type {boolean}
   * @default false
   * @reflect
   *
   * @description
   * 当设置为true时，组件进入禁用状态：
   * - 输入框不可交互
   * - 视觉上呈现禁用样式
   * - 编辑按钮不可点击
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  /**
   * 编辑模式状态
   * @type {boolean}
   * @default false
   * @mutable
   * @reflect
   *
   * @description
   * 控制组件当前交互模式：
   * - `false`: 展示模式（显示URL链接）
   * - `true`: 编辑模式（显示输入框）
   *
   * 该属性支持双向绑定，组件内部状态变化时会自动更新。
   */
  @Prop({ mutable: true, reflect: true }) editing: boolean = false;

  /**
   * 宿主元素引用
   * @type {HTMLElement}
   *
   * @description
   * Stencil提供的装饰器，自动注入组件宿主DOM元素。
   * 用于访问组件DOM结构和查询插槽内容。
   */
  @Element() elm!: HTMLElement;

  /**
   * 尾部插槽内容存在状态
   * @type {boolean}
   * @state
   *
   * @description
   * 内部状态，标识是否在`end`插槽中提供了内容。
   * 用于动态调整输入框的样式布局。
   */
  @State() endSlotHasContent = false;

  /**
   * 组件全局唯一标识符
   * @type {string}
   *
   * @description
   * 自动生成的唯一ID，格式为递增数字字符串。
   * 用于：
   * - 生成默认的`name`属性
   * - 组件实例标识
   */
  gid: string = getComponentIndex();

  /**
   * 输入框聚焦状态
   * @type {boolean}
   * @state
   *
   * @description
   * 标识输入框当前是否获得焦点。
   * 用于：
   * - 触发聚焦样式
   * - 辅助功能状态指示
   */
  @State() hasFocus = false;

  /**
   * 输入无效事件
   * @event inputInvalid
   * @type {EventEmitter<boolean>}
   *
   * @description
   * 当URL验证状态变化时触发，携带当前是否无效的状态。
   * 事件数据：
   * - `true`: 当前值无效
   * - `false`: 当前值有效
   *
   * @example
   * <zane-input-url onInputInvalid={(e) => console.log(' 无效状态:', e.detail)}  />
   */
  @Event() inputInvalid: EventEmitter<boolean>;

  /**
   * URL验证状态
   * @type {boolean}
   * @state
   *
   * @description
   * 标识当前`value`是否为有效的URL格式。
   * 遵循规则：
   * - 空值视为有效
   * - 符合URL格式规范的值有效
   * - 不符合URL格式的值无效
   */
  @State() isValid = true;

  /**
   * 输入框名称属性
   * @type {string}
   * @default `zane-input-url-${gid}`
   *
   * @description
   * 对应原生input元素的`name`属性，用于表单提交。
   * 默认自动生成格式为`zane-input-url-{唯一ID}`的值。
   */
  @Prop() name: string = `zane-input-url-${this.gid}`;

  /**
   * 输入框占位文本
   * @type {string}
   *
   * @description
   * 编辑模式下输入框显示的提示文本。
   * 当输入值为空时显示。
   */
  @Prop() placeholder: string;

  /**
   * 组件尺寸规格
   * @type {'lg' | 'md' | 'sm'}
   * @default 'md'
   * @reflect
   *
   * @description
   * 控制组件的视觉尺寸，可选值：
   * - `'sm'`: 小尺寸 (适用于紧凑界面)
   * - `'md'`: 中尺寸 (默认标准尺寸)
   * - `'lg'`: 大尺寸 (适用于强调场景)
   *
   * 该属性会反映到宿主元素的HTML属性上，可通过CSS属性选择器进行样式定制。
   */
  @Prop({ reflect: true }) size: 'lg' | 'md' | 'sm' = 'md';

  /**
   * 起始插槽内容存在状态
   * @type {boolean}
   * @state
   *
   * @description
   * 内部状态，标识是否在`start`插槽中提供了内容。
   * 用于动态调整输入框的样式布局。
   */
  @State() startSlotHasContent = false;

  /**
   * 输入值
   * @type {string}
   * @mutable
   *
   * @description
   * 组件的当前URL值，支持双向绑定。
   * 在展示模式下显示为可点击链接，在编辑模式下作为输入框的值。
   */
  @Prop({ mutable: true }) value: string;

  /**
   * 值变化事件
   * @event valueChange
   * @type {EventEmitter<string>}
   *
   * @description
   * 当输入值变化时触发（经过防抖处理）。
   * 携带当前输入框的最新值。
   *
   * @example
   * <zane-input-url onValueChange={(e) => console.log(' 新值:', e.detail)}  />
   */
  @Event() valueChange: EventEmitter<string>;

  /** 原生输入框元素的引用 */
  private nativeElement?: HTMLInputElement;

  /**
   * 组件加载完成生命周期
   *
   * @description
   * 检测插槽内容存在状态：
   * 1. 检查`slot="start"`是否存在内容
   * 2. 检查`slot="end"`是否存在内容
   *
   * 结果用于动态调整输入框的样式布局。
   */
  componentDidLoad() {
    this.startSlotHasContent =
      this.elm.querySelector('[slot="start"]') !== null;
    this.endSlotHasContent = this.elm.querySelector('[slot="end"]') !== null;
  }

  /**
   * 组件将要加载生命周期
   *
   * @description
   * 初始化防抖事件处理，确保`valueChange`事件使用当前设置的防抖时间。
   */
  componentWillLoad() {
    this.debounceChanged();
  }

  /**
   * 获取组件唯一标识符
   * @method
   * @returns {Promise<string>} 组件全局唯一ID
   *
   * @description
   * 提供获取组件实例唯一标识符的公共方法。
   * 可用于表单关联或组件间通信。
   */
  @Method()
  async getComponentId() {
    return this.gid;
  }

  /**
   * 主渲染方法
   * @returns {JSX.Element} 组件JSX结构
   */
  render() {
    return (
      <Host has-focus={this.hasFocus} invalid={!this.isValid}>
        <div class="form-control">
          <div class="field">{this.renderInput()}</div>
          {this.renderHelper()}
        </div>
      </Host>
    );
  }

  /**
   * 渲染辅助信息
   * @returns {JSX.Element | null} 验证错误提示或null
   *
   * @description
   * 当URL无效时显示验证错误提示信息。
   */
  renderHelper() {
    if (!this.isValid) {
      return <div class="helper invalid">Please enter a valid URL</div>;
    }
    return null;
  }

  /**
   * 渲染输入区域
   * @returns {JSX.Element} 输入区域JSX结构
   *
   * @description
   * 根据`editing`状态决定渲染：
   * - 展示模式：URL链接+编辑按钮
   * - 编辑模式：输入框
   */
  renderInput() {
    return (
      <div class={{ editing: this.editing, 'url-input': true }}>
        <div class={{ 'url-container': true }}>
          <zane-link href={this.value} target="_blank">
            {this.value}
          </zane-link>
          <zane-button
            icon="edit"
            onZane-button--click={() => {
              this.#startEditing();
            }}
            size="sm"
            variant="ghost"
          ></zane-button>
        </div>

        <div
          class={{
            disabled: this.disabled,
            'end-slot-has-content': this.endSlotHasContent,
            'has-focus': this.hasFocus,
            'input-container': true,
            invalid: !this.isValid,
            'start-slot-has-content': this.startSlotHasContent,
          }}
        >
          <input
            class="input input-native"
            disabled={this.disabled}
            name={this.name}
            onBlur={this.blurHandler}
            onFocus={this.focusHandler}
            onInput={(evt) => this.inputHandler(evt)}
            placeholder={this.placeholder}
            ref={(input) => (this.nativeElement = input)}
            type="url"
            value={this.value}
          />
        </div>
      </div>
    );
  }

  /**
   * 移除输入框焦点
   * @method
   *
   * @description
   * 公共方法，以编程方式移除输入框焦点：
   * 1. 调用原生input元素的blur()
   * 2. 更新hasFocus状态
   */
  @Method()
  async setBlur() {
    if (this.nativeElement) {
      this.nativeElement.blur();
      this.hasFocus = false;
    }
  }

  /**
   * 设置输入框焦点
   * @method
   *
   * @description
   * 公共方法，以编程方式聚焦输入框：
   * 1. 调用原生input元素的focus()
   * 2. 更新hasFocus状态
   */
  @Method()
  async setFocus() {
    if (this.nativeElement) {
      this.nativeElement.focus();
      this.hasFocus = true;
    }
  }

  /**
   * 防抖时间变化监听
   * @watch debounce
   *
   * @description
   * 当`debounce`属性变化时，重新初始化防抖事件处理函数。
   */
  @Watch('debounce')
  protected debounceChanged() {
    this.valueChange = debounceEvent(this.valueChange, this.debounce);
  }

  /**
   * 关闭编辑模式（私有方法）
   *
   * @description
   * 1. 验证当前URL值
   * 2. 发射inputInvalid事件
   * 3. 如果验证通过则退出编辑模式
   */
  #closeEditing() {
    this.isValid = this.validateUrl(this.value);
    this.inputInvalid.emit(!this.isValid);

    if (this.isValid) this.editing = false;
  }

  /**
   * 开启编辑模式（私有方法）
   *
   * @description
   * 1. 设置editing状态为true
   * 2. 80ms延迟后聚焦输入框（确保DOM更新完成）
   */
  #startEditing() {
    this.editing = true;
    setTimeout(() => this.setFocus(), 80);
  }

  /** 输入框失焦处理函数 */
  private blurHandler = () => {
    this.hasFocus = false;

    // 失焦时验证并关闭编辑模式
    this.#closeEditing();
  };

  /** 输入框聚焦处理函数 */
  private focusHandler = () => {
    this.hasFocus = true;
  };

  /** 输入处理函数 */
  private inputHandler = (ev: Event) => {
    const input = ev.target as HTMLInputElement | null;
    const oldValue = this.value;

    if (input) {
      this.value = input.value;
    }

    if (oldValue !== this.value) {
      this.valueChange.emit(this.value);
    }
  };

  /**
   * URL验证方法
   * @param {string} url - 待验证的URL字符串
   * @returns {boolean} 验证结果
   *
   * @description
   * 使用浏览器原生URL构造函数进行验证：
   * 1. 空值返回true（视为有效）
   * 2. 有效URL返回true
   * 3. 无效URL返回false
   */
  private validateUrl(url: string): boolean {
    if (!url) return true; // 空值视为有效

    try {
      new URL(url); // 使用浏览器原生验证
      return true;
    } catch {
      return false;
    }
  }
}
