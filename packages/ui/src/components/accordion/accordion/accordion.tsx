import { Component, Element, h, Host, Listen, Prop } from '@stencil/core';

/**
 * 可折叠面板(Accordion)容器组件
 *
 * 提供可折叠内容区域的容器组件，管理多个折叠项的状态和交互。
 * 支持单开/多开模式、多种尺寸和图标位置配置。
 * @slot default - 默认插槽
 */
@Component({
  shadow: true,
  styleUrl: 'accordion.scss',
  tag: 'zane-accordion',
})
export class Accordion {

  /**
   * 控制折叠指示图标的位置
   *
   * 1. `end`: 图标显示在面板标题的末尾(右侧)(默认值)
   * 2. `start`: 图标显示在面板标题的开头(左侧)
   *
   * @type {'end' | 'start'}
   * @default 'end'
   * @reflectToAttr 属性值会同步到DOM元素上
   * @example <zane-accordion align="start"></zane-accordion>
   */
  @Prop({ reflect: true }) align: 'end' | 'start' = 'end';

  /**
   * 组件宿主元素的引用
   *
   * 用于直接访问组件DOM元素，主要用于查询子元素
   *
   * @type {HTMLElement}
   * @readonly
   */
  @Element() elm!: HTMLElement;

  /**
   * 是否允许多个面板同时展开
   *
   * - true: 允许多个面板同时保持展开状态
   * - false: 同一时间只能展开一个面板(默认值)
   *
   * @type {boolean}
   * @default false
   * @example <zane-accordion multiple></zane-accordion>
   */
  @Prop() multiple: boolean = false;

  /**
   * 控制折叠面板的尺寸变体
   *
   * - 'lg': 大尺寸，适合需要突出显示的内容
   * - 'md': 中等尺寸(默认值)，通用尺寸
   * - 'sm': 小尺寸，适合紧凑布局
   *
   * @type {'lg' | 'md' | 'sm'}
   * @default 'md'
   * @reflectToAttr 属性值会同步到DOM元素上
   * @example <zane-accordion size="lg"></zane-accordion>
   */
  @Prop({ reflect: true }) size: 'lg' | 'md' | 'sm' = 'md';

  /**
   * 处理折叠项点击事件
   *
   * 当子项触发'zane-accordion-item--click'事件时，
   * 如果multiple为false，会自动关闭其他展开的面板
   *
   * @param {CustomEvent} evt 自定义事件对象
   * @param {HTMLElement} evt.detail.element 触发事件的折叠项元素
   * @listens zane-accordion-item--click
   * @private
   */
  @Listen('zane-accordion-item--click')
  accordionItemClick(evt: CustomEvent<any>) {
    if (!this.multiple) {
      const accordionItems = this.elm.querySelectorAll('zane-accordion-item');
      accordionItems.forEach((item) => {
        if (item !== evt.detail.element) {
          (item as any).open = false;
        }
      });
    }
  }

  /**
   * 渲染组件
   *
   * 使用Host元素包裹默认插槽，所有样式和属性将应用到Host元素
   *
   * @returns {JSX.Element} 组件JSX结构
   */
  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
