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
 * 日期选择器组件
 * @Component 装饰器定义组件元数据
 * @shadow 启用Shadow DOM封装
 * @styleUrl 组件样式表路径
 * @tag 组件自定义标签名称
 */
@Component({
  shadow: true,
  styleUrl: 'date-picker.scss',
  tag: 'zane-date-picker',
})
export class DatePicker implements ComponentInterface {
  /**
   * ARIA无障碍属性配置对象
   * 用于存储所有aria-*属性
   * @Prop 装饰器表示这是组件的公开属性
   * @mutable 表示属性可变
   * @reflect 表示属性值会反映到DOM属性上
   */
  @Prop({ mutable: true, reflect: true }) configAria: any = {};

  /**
   * 事件防抖时间(毫秒)
   * 用于控制change事件的触发频率
   * @Prop 默认值为300ms
   */
  @Prop() debounce = 300;

  /**
   * 是否禁用组件
   * @Prop 装饰器，reflect表示会反映到DOM属性上
   * 默认值为false
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  /**
   * 宿主元素引用
   * @Element 装饰器获取宿主元素
   */
  @Element() elm!: HTMLElement;

  /**
   * 组件唯一ID
   */
  gid: string = getComponentIndex();

  /**
   * 是否获得焦点状态
   * @State 装饰器表示这是组件内部状态
   */
  @State() hasFocus = false;

  /**
   * 辅助文本
   * 显示在输入框下方的帮助信息
   * @Prop
   */
  @Prop() helperText: string;

  /**
   * 是否为内联模式
   * @Prop 装饰器，reflect表示会反映到DOM属性上
   */
  @Prop({ reflect: true }) inline: boolean = false;

  /**
   * 是否为无效状态
   * @Prop
   */
  @Prop() invalid: boolean = false;

  /**
   * 无效状态提示文本
   * @Prop
   */
  @Prop() invalidText: string;

  /**
   * 标签文本
   * @Prop
   */
  @Prop() label: string;

  /**
   * 输入框name属性
   * 默认值为"zane-input-{唯一ID}"
   * @Prop
   */
  @Prop() name: string = `zane-input-${this.gid}`;

  /**
   * 占位符文本
   * @Prop
   */
  @Prop() placeholder: string;

  /**
   * 是否为只读状态
   * @Prop 装饰器，reflect表示会反映到DOM属性上
   */
  @Prop({ reflect: true }) readonly: boolean = false;

  /**
   * 是否为必填项
   * @Prop 装饰器，reflect表示会反映到DOM属性上
   */
  @Prop({ reflect: true }) required: boolean = false;

  /**
   * 组件尺寸
   * - 'lg': 大尺寸
   * - 'md': 中等尺寸(默认)
   * - 'sm': 小尺寸
   * @Prop 装饰器，reflect表示会反映到DOM属性上
   */
  @Prop({ reflect: true }) size: 'lg' | 'md' | 'sm' = 'md';

  /**
   * 当前值
   * 可以是null、number或string类型
   * @Prop 装饰器，mutable表示属性可变
   */
  @Prop({ mutable: true }) value?: null | number | string = '';

  /**
   * 是否为警告状态
   * @Prop
   */
  @Prop() warn: boolean = false;

  /**
   * 警告状态提示文本
   * @Prop
   */
  @Prop() warnText: string;

  /**
   * 失去焦点事件
   * @Event 装饰器定义自定义事件
   * 事件名称为'zane-date-picker--blur'
   */
  @Event({ eventName: 'zane-date-picker--blur' }) zaneBlur: EventEmitter;

  /**
   * 值变化事件(带防抖)
   * @Event 装饰器定义自定义事件
   * 事件名称为'zane-date-picker--change'
   */
  @Event({ eventName: 'zane-date-picker--change' }) zaneChange: EventEmitter;

  /**
   * 获得焦点事件
   * @Event 装饰器定义自定义事件
   * 事件名称为'zane-date-picker--focus'
   */
  @Event({ eventName: 'zane-date-picker--focus' }) zaneFocus: EventEmitter;

  /**
   * 输入事件(实时触发)
   * @Event 装饰器定义自定义事件
   * 事件名称为'zane-date-picker--input'
   */
  @Event({ eventName: 'zane-date-picker--input' }) zaneInput: EventEmitter;

  /**
   * 原生input元素引用
   */
  private nativeElement?: HTMLInputElement;

  /**
   * tabindex值
   * 从宿主元素获取并传递给内部input元素
   */
  private tabindex?: number | string;

  /**
   * 组件即将加载生命周期钩子
   * 处理ARIA属性和tabindex
   */
  componentWillLoad() {
    // 处理tabindex
    if (this.elm.hasAttribute('tabindex')) {
      const tabindex = this.elm.getAttribute('tabindex');
      this.tabindex = tabindex === null ? undefined : tabindex;
      this.elm.removeAttribute('tabindex');
    }
    // 收集所有aria-*属性
    this.elm.getAttributeNames().forEach((name: string) => {
      if (name.includes('aria-')) {
        this.configAria[name] = this.elm.getAttribute(name);
        this.elm.removeAttribute(name);
      }
    });
  }

  /**
   * 组件连接到DOM时的生命周期回调
   * 初始化防抖设置
   */
  connectedCallback() {
    this.debounceChanged();
  }

  /**
   * 获取组件ID的公共方法
   * @Method 装饰器定义公共方法
   * @returns 组件唯一ID
   */
  @Method()
  async getComponentId() {
    return this.gid;
  }

  /**
   * 渲染组件
   * @returns 组件虚拟DOM
   */
  render() {
    return (
      <Host has-focus={this.hasFocus} has-value={this.hasValue()}>
        <div class={{ 'form-control': true, inline: this.inline }}>
          {this.label && (
            <label class="label">
              {this.required && <span class="required">*</span>}
              {this.label}
            </label>
          )}

          <div class="field">
            <div
              class={{
                disabled: this.disabled,
                'has-focus': this.hasFocus,
                'input-container': true,
              }}
            >
              <input
                class="input input-native"
                disabled={this.disabled}
                onBlur={this.blurHandler}
                onFocus={this.focusHandler}
                onInput={this.inputHandler}
                onKeyDown={this.keyDownHandler}
                readonly={this.readonly}
                ref={(input) => (this.nativeElement = input)}
                required={this.required}
                tabindex={this.tabindex}
                type="date"
              />

              <zane-button
                class="input-action"
                color={'secondary'}
                disabled={this.disabled}
                icon={'calendar'}
                onZane-button--click={() => {
                  setTimeout(() => {
                    this.nativeElement.showPicker();
                  });
                }}
                size={this.size}
                variant="ghost.simple"
              ></zane-button>
            </div>
            {this.renderHelper()}
          </div>
        </div>
      </Host>
    );
  }

  /**
   * 渲染辅助信息
   * 根据状态显示不同的辅助文本
   * @returns 辅助信息虚拟DOM
   */
  renderHelper() {
    if (this.invalid)
      return <div class="helper invalid">{this.invalidText}</div>;
    else if (this.warn) return <div class="helper warn">{this.warnText}</div>;
    else if (this.helperText || this.helperText === '')
      return <div class="helper text">{this.helperText}</div>;
  }

  /**
   * 设置失去焦点的公共方法
   * @Method 装饰器定义公共方法
   */
  @Method()
  async setBlur() {
    if (this.nativeElement) {
      this.nativeElement.blur();
      this.hasFocus = false;
    }
  }

  /**
   * 设置获得焦点的公共方法
   * @Method 装饰器定义公共方法
   */
  @Method()
  async setFocus() {
    if (this.nativeElement) {
      this.nativeElement.focus();
      this.hasFocus = true;
    }
  }

  /**
   * 监听debounce属性变化
   * 更新防抖设置
   * @Watch 装饰器监听属性变化
   */
  @Watch('debounce')
  protected debounceChanged() {
    this.zaneChange = debounceEvent(this.zaneChange, this.debounce);
  }

  /**
   * 失去焦点事件处理
   * @param ev 焦点事件对象
   */
  private blurHandler = (ev: FocusEvent) => {
    this.hasFocus = false;
    this.zaneBlur.emit(ev);
  };

  /**
   * 清空输入值
   * @param evt 事件对象
   */
  private clearInput = (evt: Event) => {
    this.nativeElement.value = '';
    this.inputHandler(evt);
  };

  /**
   * 获得焦点事件处理
   * @param ev 焦点事件对象
   */
  private focusHandler = (ev: FocusEvent) => {
    this.hasFocus = true;
    this.zaneFocus.emit(ev);
  };

  /**
   * 获取当前值的字符串表示
   * @returns 值的字符串形式
   */
  private getValue(): string {
    return (this.value || '').toString();
  }

  /**
   * 检查是否有值
   * @returns 是否有值的布尔结果
   */
  private hasValue(): boolean {
    return this.getValue().length > 0;
  }

  /**
   * 输入事件处理
   * @param ev 输入事件对象
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

  /**
   * 键盘按下事件处理
   * 特别处理ESC键清空输入
   * @param ev 键盘事件对象
   */
  private keyDownHandler = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
      this.clearInput(ev);
    }
  };
}
