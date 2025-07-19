import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core';

import { getComponentIndex } from '../../../utils';

/**
 * 可折叠面板项(Accordion Item)组件
 *
 * 作为zane-accordion的子组件使用，实现单个可折叠面板项的功能
 *
 * @component
 * @shadowDom 使用Shadow DOM封装组件样式
 * @slot heading 标题插槽，可自定义标题内容
 * @slot default 内容插槽，放置折叠面板的内容
 */
@Component({
  shadow: true,
  styleUrl: 'accordion-item.scss',
  tag: 'zane-accordion-item',
})
export class AccordionItem {

  /**
   * 禁用状态控制
   *
   * - true: 禁用该折叠项，不可交互
   * - false: 正常状态(默认)
   *
   * @type {boolean}
   * @default false
   */
  @Prop() disabled: boolean = false;

  /**
   * 组件宿主元素引用
   *
   * 用于直接访问组件DOM元素
   *
   * @type {HTMLElement}
   */
  @Element() elm!: HTMLElement;

  /**
   * 检测end插槽是否有内容
   *
   * 用于动态调整布局样式
   *
   * @type {boolean}
   */
  @State() endSlotHasContent = false;

  /**
   * 组件唯一标识符
   *
   * 用于ARIA属性和事件关联
   *
   * @type {string}
   */
  gid: string = getComponentIndex();

  /**
   * 焦点状态
   *
   * - true: 组件当前获得焦点
   * - false: 组件未获得焦点(默认)
   *
   * @type {boolean}
   */
  @State() hasFocus = false;

  /**
   * 面板标题文本
   *
   * 当heading插槽无内容时显示此文本
   *
   * @type {string}
   */
  @Prop() heading: string;

  /**
   * 面板展开状态
   *
   * - true: 面板已展开
   * - false: 面板已折叠(默认)
   *
   * @type {boolean}
   * @default false
   * @mutable 允许组件内部修改
   * @reflectToAttr 同步到DOM属性
   */
  @Prop({ mutable: true, reflect: true }) open: boolean = false;

  /**
   * 检测start插槽是否有内容
   *
   * 用于动态调整布局样式
   *
   * @type {boolean}
   */
  @State() startSlotHasContent = false;

  /**
   * 面板点击事件
   *
   * 当面板被点击时触发，携带当前元素引用和状态
   *
   * @type {EventEmitter}
   * @event zane-accordion-item--click
   */
  @Event({ eventName: 'zane-accordion-item--click' })
  zaneAccordionItemClick: EventEmitter;

  /**
   * 渲染组件
   *
   * 包含标题按钮和内容区域，实现完整的可折叠面板项
   *
   * @returns {JSX.Element} 组件JSX结构
   */
  render = () => {
    return (
      <Host open={this.open}>
        <div
          class={{
            'accordion-item': true,
            disabled: this.disabled,
            open: this.open,
          }}
        >
          <button
            aria-controls={`accordion-control-${this.gid}`}
            aria-disabled={`${this.disabled}`}
            aria-expanded={`${this.open}`}
            class={{ 'accordion-heading': true, 'has-focus': this.hasFocus }}
            id={`accordion-heading-${this.gid}`}
            onClick={() => {
              if (!this.disabled) {
                this.open = !this.open;
                this.hasFocus = true;
                this.zaneAccordionItemClick.emit({
                  element: this.elm,
                  gid: this.gid,
                  open: this.open,
                });
              }
            }}
            onBlur={this.blurHandler}
            onFocus={this.focusHandler}
            type="button"
          >
            <zane-icon
              class="accordion-icon inherit"
              name="chevron--down"
              size="1rem"
            />
            <div class="accordion-title" part="title">
              <slot name="heading">{this.heading}</slot>
            </div>
          </button>
          <div
            aria-labelledby={`accordion-heading-${this.gid}`}
            class="item-section slot-main"
            id={`accordion-control-${this.gid}`}
            role="region"
          >
            <slot />
          </div>
        </div>
      </Host>
    );
  };

  /**
   * 处理失去焦点事件
   *
   * @private
   */
  private blurHandler = () => {
    this.hasFocus = false;
  };

  /**
   * 处理获得焦点事件
   *
   * @private
   */
  private focusHandler = () => {
    this.hasFocus = true;
  };
}
