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
  Watch,
} from '@stencil/core';
import { throttle } from 'lodash';

import { DRAG_EVENT_TYPES, DRAG_STOP_EVENT_TYPES } from '../../constants';
import { debounceEvent, getComponentIndex, isInViewport } from '../../utils';

/**
 * 滑动选择器组件
 *
 * 提供可拖动的滑块选择器，支持鼠标/触摸交互、键盘操作和数值输入框集成。
 *
 * @component zane-slider
 * @tags zane-slider
 * @shadow true
 *
 * @example
 * <!-- 基础用法 -->
 * <zane-slider min="0" max="100" value="50"></zane-slider>
 *
 * <!-- 禁用状态 -->
 * <zane-slider disabled value="30"></zane-slider>
 *
 * <!-- 隐藏数值输入框 -->
 * <zane-slider show-only-slider value="75"></zane-slider>
 */
@Component({
  shadow: true,
  styleUrl: 'slider.scss',
  tag: 'zane-slider',
})
export class Slider implements ComponentInterface, InputComponentInterface {
  /**
   * ARIA 属性配置对象
   * @prop {Object} configAria - 收集所有以 `aria-` 开头的自定义属性
   * @mutable
   * @reflect
   */
  @Prop({ mutable: true, reflect: true }) configAria: any = {};

  /**
   * 值变更事件的防抖时间（毫秒）
   * @prop {number} debounce - 用于优化频繁触发的事件
   * @default 300
   */
  @Prop() debounce = 300;

  /**
   * 禁用状态开关
   * @prop {boolean} disabled
   * @reflect
   * @default false
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** 宿主元素引用 */
  @Element() elm!: HTMLElement;

  /**
   * 数值格式化函数
   * @prop {(value: number | string) => string} formatter - 用于自定义显示值的格式
   * @example (val) => `${val}%`
   */
  @Prop() formatter: (value: number | string) => string;

  /** 组件唯一标识符 */
  gid: string = getComponentIndex();

  /** 当前是否获得焦点状态 */
  @State() hasFocus = false;

  /**
   * 滑块最大值
   * @prop {number} max
   * @default 100
   */
  @Prop() max: number = 100;

  /**
   * 滑块最小值
   * @prop {number} min
   * @default 0
   */
  @Prop() min: number = 0;

  /**
   * 表单字段名称
   * @prop {string} name - 自动生成唯一名称
   * @default `zane-input-${gid}`
   */
  @Prop() name: string = `zane-input-${this.gid}`;

  /** 标记是否需要释放事件 */
  @State() needsOnRelease = false;

  /**
   * 内部拖拽事件处理函数
   * @private
   * @param {Event} event - 鼠标/触摸事件
   */
  _onDrag = (event) => {
    // Do nothing if component is disabled
    if (this.disabled || this.readonly) {
      return;
    }

    this.openTooltip(this.thumbElement, true);

    const clientX: number =
      event.type === 'touchstart' || event.type === 'touchmove'
        ? event.touches[0].clientX
        : event.clientX;

    this.updateByPosition(clientX);
  };

  /** 节流后的拖拽处理函数（1ms节流） */
  onDrag = throttle(this._onDrag, 1);

  /**
   * 只读状态开关
   * @prop {boolean} readonly
   * @reflect
   * @default false
   */
  @Prop({ reflect: true }) readonly: boolean = false;

  /**
   * 必填状态
   * @prop {boolean} required
   * @reflect
   * @default false
   */
  @Prop({ reflect: true }) required: boolean = false;

  /**
   * 是否仅显示滑块（隐藏数值输入框）
   * @prop {boolean} showOnlySlider
   * @default false
   */
  @Prop() showOnlySlider: boolean = false;

  /** 滑块轨道宽度（像素） */
  @State()
  slideElementWidth: null | number = null;

  /**
   * 步进值
   * @prop {number} step - 每次增减的数值单位
   * @mutable
   * @default 1
   */
  @Prop({ mutable: true }) step: number = 1;

  /**
   * 当前滑块值
   * @prop {number} value - 受控属性
   * @mutable
   * @default 0
   */
  @Prop({ mutable: true }) value?: number = 0;

  /**
   * 值变更事件（带防抖）
   * @event zane-slider--change
   * @property {Object} detail - 事件详情
   * @property {number} detail.value  - 变更后的值
   */
  @Event({ eventName: 'zane-slider--change' }) zaneChange: EventEmitter;

  /**
   * 输入实时事件
   * @event zane-slider--input
   * @property {Object} detail - 事件详情
   * @property {number} detail.value  - 当前输入值
   */
  @Event({ eventName: 'zane-slider--input' }) zaneInput: EventEmitter;

  private displayElement?: HTMLElement;

  private inputValue: number;
  private nativeElement?: HTMLInputElement;
  private slideElement?: HTMLElement;
  private thumbElement?: HTMLElement;

  /**
   * 组件加载完成生命周期
   * 初始化滑块宽度计算并设置ResizeObserver
   */
  componentDidLoad() {
    this.#computeSliderWidth();

    const resizeObserver = new ResizeObserver(() => {
      this.#computeSliderWidth();
    });

    resizeObserver.observe(this.elm);
  }

  /**
   * 组件加载前生命周期
   * 收集ARIA属性并初始化内部值
   */
  componentWillLoad() {
    this.elm.getAttributeNames().forEach((name: string) => {
      if (name.includes('aria-')) {
        this.configAria[name] = this.elm.getAttribute(name);
        this.elm.removeAttribute(name);
      }
    });

    this.inputValue = this.value;
  }

  /** 连接回调 - 初始化防抖设置 */
  connectedCallback() {
    this.debounceChanged();
  }

  /**
   * 获取组件唯一ID
   * @method
   * @returns {Promise<string>} 组件唯一标识符
   */
  @Method()
  async getComponentId() {
    return this.gid;
  }

  /**
   * 拖拽开始事件处理
   * @param {Event} event - 鼠标/触摸事件
   */
  onDragStart = (event) => {
    // Do nothing if component is disabled
    if (this.disabled || this.readonly) {
      return;
    }

    // Register drag stop handlers
    DRAG_STOP_EVENT_TYPES.forEach((element) => {
      this.elm?.ownerDocument.addEventListener(element, this.onDragStop);
    });

    // Register drag handlers
    DRAG_EVENT_TYPES.forEach((element) => {
      this.elm?.ownerDocument.addEventListener(element, this.onDrag);
    });

    this.hasFocus = true;

    this.onDrag(event);
  };

  /**
   * 拖拽结束事件处理
   * @param {Event} event - 鼠标/触摸事件
   */
  onDragStop = (event) => {
    // Do nothing if component is disabled
    if (this.disabled || this.readonly) {
      return;
    }

    // Remove drag stop handlers
    DRAG_STOP_EVENT_TYPES.forEach((element) => {
      this.elm?.ownerDocument.removeEventListener(element, this.onDragStop);
    });

    // Remove drag handlers
    DRAG_EVENT_TYPES.forEach((element) => {
      this.elm?.ownerDocument.removeEventListener(element, this.onDrag);
    });

    const clientX: number =
      event.type === 'touchend'
        ? event.changedTouches[0].clientX
        : event.clientX;

    this.updateByPosition(clientX);
  };

  /**
   * 滚轮事件处理
   * @param {WheelEvent} event - 鼠标滚轮事件
   */
  onWheel = (event) => {
    // Do nothing if component is disabled
    if (this.disabled || this.readonly) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    let delta = 0;
    if (event.wheelDelta) {
      delta = event.wheelDelta / 120;
    } else if (event.detail) {
      delta = -event.detail / 3;
    }

    this.updateValue(Number.parseInt(String(this.value)) + delta * this.step);
  };

  /**
   * 控制工具提示显示
   * @param {HTMLElement} target - 目标元素
   * @param {boolean} open - 开启/关闭状态
   */
  openTooltip = (target, open) => {
    window.dispatchEvent(
      new CustomEvent('zane-tooltip-open', {
        detail: {
          open,
          target,
        },
      }),
    );
  };

  /**
   * 渲染组件
   * @returns {JSX.Element} 组件虚拟DOM树
   */
  render() {
    return (
      <Host has-focus={this.hasFocus} has-value={this.hasValue()}>
        <div class="slider-container">
          <div class="slider-wrapper">
            {!this.showOnlySlider && (
              <div class="slider-range-label">
                <span>{this.getFormattedValue(this.min)}</span>
              </div>
            )}
            <div
              class={{ 'has-focus': this.hasFocus, slider: true }}
              onMouseDown={this.onDragStart}
              onWheel={this.onWheel}
              ref={(elm) => (this.slideElement = elm)}
            >
              <div
                class="slider__thumb"
                onBlur={this.blurHandler}
                onFocus={this.focusHandler}
                onMouseLeave={(_e) => {
                  if (!this.hasFocus)
                    this.openTooltip(this.thumbElement, false);
                }}
                onMouseOver={(_e) => {
                  this.openTooltip(this.thumbElement, true);
                }}
                onTouchStart={this.onDragStart}
                ref={(elm) => (this.thumbElement = elm)}
                style={{
                  left: `${
                    (this.value * Math.trunc(this.slideElementWidth)) /
                      (this.max - this.min) -
                    8
                  }px`,
                }}
                tabIndex={0}
                tooltip-target={`slider-tooltip-${this.gid}`}
              ></div>
              <div class="slider__track"></div>
              <div
                class="slider__track--filled"
                style={{
                  width: `${
                    (this.value * Math.trunc(this.slideElementWidth)) /
                    (this.max - this.min)
                  }px`,
                }}
              ></div>
            </div>
            {!this.showOnlySlider && (
              <div class="slider-range-label">
                <span>{this.getFormattedValue(this.max)}</span>
              </div>
            )}
          </div>
          {this.showOnlySlider ? null : (
            <div class="slide-input">
              <zane-number
                class="input"
                hide-actions={true}
                onGoat-input={(e) => {
                  e.stopPropagation();
                }}
                onGoat-number--input={(e) => {
                  e.stopPropagation();
                  this.updateValue(e.target.value);
                }}
                size="sm"
                value={this.inputValue}
              ></zane-number>
            </div>
          )}
        </div>
        <zane-tooltip
          id={`slider-tooltip-${this.gid}`}
          placements="top,bottom"
          trigger={'manual'}
        >
          {this.getFormattedValue(this.value)}
        </zane-tooltip>
      </Host>
    );
  }

  /**
   * 移除组件焦点
   * @method
   */
  @Method()
  async setBlur() {
    if (this.nativeElement) {
      this.nativeElement.blur();
    }
  }

  /**
   * 设置组件焦点
   * @method
   */
  @Method()
  async setFocus(): Promise<void> {
    this.displayElement.focus();
  }

  /**
   * 根据坐标位置更新滑块值
   * @param {number} currentX - 当前指针X坐标
   */
  updateByPosition(current) {
    const start = this.slideElement.getBoundingClientRect().left;
    const total = this.slideElement.getBoundingClientRect().width;
    const value = Number.parseInt(
      String(((current - start) / total) * (this.max - this.min)),
    );
    this.updateValue(value);
    this.inputValue = this.value;
  }

  /**
   * 更新滑块值并触发事件
   * @param {number} newValue - 新数值
   */
  updateValue = (newValue) => {
    const oldValue = this.value;

    this.value = Math.round(newValue / this.step) * this.step;

    if (this.value === null || this.value < this.min) {
      this.value = this.min;
    } else if (this.value > this.max) {
      this.value = this.max;
    }

    this.zaneInput.emit({
      value: this.value,
    });

    if (oldValue !== this.value) {
      this.zaneChange.emit({
        value: this.value,
      });
    }
  };

  /** 全局点击监听（用于失焦处理） */
  @Listen('click', { target: 'window' })
  windowClick(evt) {
    const path = evt.path || evt.composedPath();
    for (const elm of path) {
      if (elm === this.elm) return;
    }
  }

  /**
   * 防抖时间变更监听
   * 动态更新防抖函数
   */
  @Watch('debounce')
  protected debounceChanged() {
    this.zaneChange = debounceEvent(this.zaneChange, this.debounce);
  }

  /**
   * 计算滑块轨道宽度
   * @private
   * 使用递归确保在视口内获取准确宽度
   */
  #computeSliderWidth() {
    if (this.slideElementWidth === null && !isInViewport(this.elm)) {
      setTimeout(() => this.#computeSliderWidth(), 100);
      return;
    }

    this.slideElementWidth = this.slideElement.getBoundingClientRect().width;
  }

  /** 滑块失焦处理 */
  private blurHandler = () => {
    this.hasFocus = false;
    this.openTooltip(this.thumbElement, false);
  };

  /** 滑块获焦处理 */
  private focusHandler = () => {
    this.hasFocus = true;
  };

  /**
   * 获取格式化值
   * @private
   * @param {number|string} value - 原始值
   * @returns {string} 格式化后的值
   */
  private getFormattedValue(value: number | string) {
    if (this.formatter) return this.formatter(value);
    return value;
  }

  /**
   * 检查是否有有效值
   * @private
   * @returns {boolean} 是否存在有效值
   */
  private hasValue(): boolean {
    return (this.value || '').toString().length > 0;
  }
}
