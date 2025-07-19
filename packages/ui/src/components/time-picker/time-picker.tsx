import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
} from '@stencil/core';

import { getComponentIndex } from '../../utils';

/**
 * 时间选择器组件
 */
@Component({
  shadow: true,
  styleUrl: 'time-picker.scss',
  tag: 'zane-time-picker',
})
export class TimePicker {
  /**
   * 动态收集的ARIA属性配置对象
   * @remarks
   * 在组件加载时会自动收集宿主元素上所有以"aria-"开头的属性，
   * 存储到该对象后从宿主元素移除，避免重复渲染问题
   */
  @Prop({ mutable: true, reflect: true }) configAria: any = {};

  /** 禁用状态标志（会反映到DOM属性） */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** 宿主元素引用 */
  @Element() elm!: HTMLElement;

  /** 组件实例唯一标识符 */
  gid: string = getComponentIndex();

  @State() hasFocus = false;

  @Prop({ reflect: true }) inline: boolean = false;

  /**
   * 自动生成的表单字段名称
   * @example
   * 当gid为"123"时，name值为"zane-input-123"
   */
  @Prop() name: string = `zane-input-${this.gid}`;

  @Prop() placeholder: string;

  @Prop({ reflect: true }) readonly: boolean = false;

  @Prop({ reflect: true }) size: 'lg' | 'md' | 'sm' = 'md';

  /**
   * 时间值绑定
   * @remarks
   * 支持三种格式：
   * - null: 未选择状态
   * - number: Unix时间戳（毫秒级）
   * - string: ISO格式时间字符串
   */
  @Prop({ mutable: true }) value?: null | number | string = '';

  /**
   * 当时间选择器失去焦点时触发
   * @event zane-time-picker--blur
   * @type {EventEmitter<FocusEvent>}
   */
  @Event({ eventName: 'zane-time-picker--blur' }) zaneBlur: EventEmitter;

  /**
   * 当时间选择器的值发生改变时触发（仅当值实际变化）
   * @event zane-time-picker--change
   * @type {EventEmitter<KeyboardEvent>}
   */
  @Event({ eventName: 'zane-time-picker--change' }) zaneChange: EventEmitter;

  /**
   * 当时间选择器获得焦点时触发
   * @event zane-time-picker--focus
   * @type {EventEmitter<FocusEvent>}
   */
  @Event({ eventName: 'zane-time-picker--focus' }) zaneFocus: EventEmitter;

  /**
   * 当时间选择器输入时触发（每次输入都会触发）
   * @event zane-time-picker--input
   * @type {EventEmitter<KeyboardEvent>}
   */
  @Event({ eventName: 'zane-time-picker--input' }) zaneInput: EventEmitter;

  /** 内部使用的原生输入元素引用 */
  private nativeElement?: HTMLInputElement;

  /** 从宿主元素传递下来的tabindex值 */
  private tabindex?: number | string;

  /**
   * 组件即将加载的生命周期钩子
   * @remarks
   * 在此阶段，组件会处理宿主元素上的`tabindex`属性和所有`aria-*`属性：
   * 1. 提取`tabindex`值并存储，然后从宿主元素移除，避免重复响应
   * 2. 收集所有`aria-*`属性到`configAria`对象，然后从宿主元素移除
   */
  componentWillLoad() {
    // If the ion-input has a tabindex attribute we get the value
    // and pass it down to the native input, then remove it from the
    // zane-input to avoid causing tabbing twice on the same element
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
  }

  /**
   * 获取组件实例的唯一标识符
   * @method
   * @async
   * @returns {Promise<string>} 组件实例ID
   */
  @Method()
  async getComponentId() {
    return this.gid;
  }

  /**
   * 渲染组件
   * @returns 组件虚拟DOM树
   */
  render() {
    return (
      <Host has-focus={this.hasFocus} has-value={this.hasValue()}>
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
            readOnly={this.readonly}
            ref={(input) => (this.nativeElement = input)}
            tabindex={this.tabindex}
            type="time"
          />

          <zane-button
            class="input-action"
            color={'secondary'}
            disabled={this.disabled}
            icon={'time'}
            onZane-button--click={() => {
              setTimeout(() => {
                this.nativeElement.showPicker();
              });
            }}
            size={this.size}
            variant="ghost.simple"
          ></zane-button>
        </div>
      </Host>
    );
  }

  /**
   * 主动使时间选择器失去焦点
   * @method
   * @async
   */
  @Method()
  async setBlur() {
    if (this.nativeElement) {
      this.nativeElement.blur();
      this.hasFocus = false;
    }
  }

  /**
   * 主动使时间选择器获得焦点
   * @method
   * @async
   */
  @Method()
  async setFocus() {
    if (this.nativeElement) {
      this.nativeElement.focus();
      this.hasFocus = true;
    }
  }

  /** 处理失去焦点事件 */
  private blurHandler = (ev: FocusEvent) => {
    this.hasFocus = false;
    this.zaneBlur.emit(ev);
  };

  /**
   * 清空当前输入值
   * @param {Event} evt - 触发事件
   */
  private clearInput = (evt: Event) => {
    this.nativeElement.value = '';
    this.inputHandler(evt);
  };

  /** 处理获得焦点事件 */
  private focusHandler = (ev: FocusEvent) => {
    this.hasFocus = true;
    this.zaneFocus.emit(ev);
  };

  /**
   * 获取当前值的字符串表示
   * @private
   * @returns {string} 当前值的字符串形式
   */
  private getValue(): string {
    return (this.value || '').toString();
  }

  /**
   * 判断当前是否有值（非空）
   * @private
   * @returns {boolean} 是否有值
   */
  private hasValue(): boolean {
    return this.getValue().length > 0;
  }

  /**
   * 处理输入事件
   * @param {Event} ev - 输入事件对象
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
   * 处理键盘按下事件
   * @param {KeyboardEvent} ev - 键盘事件对象
   * @remarks
   * 当前仅处理ESC键：按下ESC键时清空输入
   */
  private keyDownHandler = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
      this.clearInput(ev);
    }
  };
}
