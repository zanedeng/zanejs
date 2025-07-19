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
 * 开关组件
 *
 * 该组件实现了可定制的开关切换控件，支持多种交互状态和样式配置，
 * 符合WAI-ARIA无障碍规范，可无缝集成到表单中使用。
 *
 */
@Component({
  shadow: true,
  styleUrl: 'toggle.scss',
  tag: 'zane-toggle',
})
export class Toggle implements ComponentInterface, InputComponentInterface {
  /**
   * ARIA属性配置对象
   * @prop {Object} configAria - 动态收集的ARIA属性键值对
   * @mutable 允许组件内部修改
   * @reflect 属性值变化时同步到DOM属性
   */
  @Prop({ mutable: true, reflect: true }) configAria: any = {};

  /**
   * 禁用状态
   * @prop {boolean} disabled - 是否禁用开关交互
   * @default false
   * @reflect 同步到DOM属性
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  // 获取宿主元素引用
  @Element() elm!: HTMLElement;

  // 组件唯一标识符
  gid: string = getComponentIndex();

  /**
   * 焦点状态
   * @state {boolean} hasFocus - 指示组件是否获得焦点
   */
  @State() hasFocus = false;

  /**
   * 激活状态（鼠标/键盘按下时）
   * @state {boolean} isActive - 指示组件是否处于激活状态
   */
  @State() isActive = false;

  /**
   * 开关标签文本
   * @prop {string} label - 显示在开关旁的文本内容
   */
  @Prop() label: string;

  /**
   * 表单字段名称
   * @prop {string} name - 关联input元素的name属性
   * @default `zane-input-${this.gid}`
   */
  @Prop() name: string = `zane-input-${this.gid}`;

  /**
   * 只读状态
   * @prop {boolean} readonly - 是否只读（可聚焦但不可修改）
   * @default false
   * @reflect 同步到DOM属性
   */
  @Prop({ reflect: true }) readonly: boolean = false;

  /**
   * 必填状态
   * @prop {boolean} required - 是否必填项
   * @default false
   * @reflect 同步到DOM属性
   */
  @Prop({ reflect: true }) required: boolean = false;

  /**
   * 圆角样式
   * @prop {boolean} rounded - 是否显示为圆形开关
   * @default true
   */
  @Prop() rounded: boolean = true;

  /**
   * 开关尺寸
   * @prop {'lg' | 'md'} size - 控制开关尺寸的枚举值
   *   - 'lg': 大尺寸 (large)
   *   - 'md': 中尺寸 (medium)
   * @default 'md'
   */
  @Prop() size: 'lg' | 'md' = 'md';

  /**
   * 插槽内容状态
   * @state {boolean} slotHasContent - 检测是否存在slot内容
   */
  @State() slotHasContent = false;

  /**
   * 开关值
   * @prop {boolean} value - 开关当前状态（开/关）
   * @mutable 允许双向绑定
   * @default false
   */
  @Prop({ mutable: true }) value: boolean = false;

  /**
   * 失去焦点事件
   * @event zane-toggle--blur
   * @emits {FocusEvent} 原生焦点事件对象
   */
  @Event({ eventName: 'zane-toggle--blur' }) zaneBlur: EventEmitter;

  /**
   * 值变更事件
   * @event zane-toggle--change
   * @emits {UIEvent} 原生UI事件对象
   */
  @Event({ eventName: 'zane-toggle--change' }) zaneChange: EventEmitter;

  /**
   * 获得焦点事件
   * @event zane-toggle--focus
   * @emits {FocusEvent} 原生焦点事件对象
   */
  @Event({ eventName: 'zane-toggle--focus' }) zaneFocus: EventEmitter;

  private iconContainer?: HTMLElement;

  private nativeElement?: HTMLInputElement;

  private tabindex?: number | string = 1;

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
    this.slotHasContent = this.elm.hasChildNodes();
  }

  /**
   * 获取组件唯一ID
   * @method getComponentId
   * @returns {Promise<string>} 组件ID
   */
  @Method()
  async getComponentId() {
    return this.gid;
  }
  render() {
    return (
      <Host active={this.isActive} has-focus={this.hasFocus}>
        <label
          class={{
            [`size-${this.size}`]: true,
            active: this.isActive,
            disabled: this.disabled,
            'has-content': this.slotHasContent,
            'has-focus': this.hasFocus,
            readonly: this.readonly,
            required: this.required,
            rounded: this.rounded,
            'state-checked': this.value,
            toggle: true,
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
            <div class="node" />
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
              <div class="slot-container">
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
   * @method setBlur
   */
  @Method()
  async setBlur() {
    if (this.nativeElement) {
      this.nativeElement.blur();
    }
  }

  /**
   * 设置焦点
   * @method setFocus
   */
  @Method()
  async setFocus() {
    if (this.nativeElement) {
      this.nativeElement.focus();
    }
  }

  /**
   * 监听全局键盘释放事件（处理空格键激活状态）
   * @listen window:keyup
   * @param {KeyboardEvent} evt - 键盘事件对象
   */
  @Listen('keyup', { target: 'window' })
  windowKeyUp(evt) {
    if (this.isActive && evt.key === ' ') this.isActive = false;
  }

  /**
   * 监听全局鼠标释放事件（清除激活状态）
   * @listen window:mouseup
   */
  @Listen('mouseup', { target: 'window' })
  windowMouseUp() {
    if (this.isActive) this.isActive = false;
  }

  private blurHandler = (ev: FocusEvent) => {
    this.hasFocus = false;
    this.zaneBlur.emit(ev);
  };

  private clickHandler = (ev: KeyboardEvent | MouseEvent) => {
    if (!this.disabled && !this.readonly) {
      this.value = !JSON.parse(this.nativeElement.value);
      this.zaneChange.emit(ev);
      this.iconContainer.focus();
    }
  };

  private focusHandler = (ev: FocusEvent) => {
    this.hasFocus = true;
    this.zaneFocus.emit(ev);
  };

  private keyDownHandler = (evt) => {
    if (evt.key === ' ') {
      evt.preventDefault();
      this.isActive = true;
      this.clickHandler(evt);
    }
  };

  private mouseDownHandler = () => {
    this.isActive = true;
  };
}
