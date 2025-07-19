import { Component, Element, h, Host, Prop } from '@stencil/core';

/**
 * 页脚(Footer)组件
 *
 * 提供可定制的页脚布局，支持多种变体和插槽内容
 *
 * @component
 * @shadowDom 使用Shadow DOM封装组件样式
 * @slot start 左侧内容插槽
 * @slot end 右侧内容插槽
 */
@Component({
  shadow: true,
  styleUrl: 'footer.scss',
  tag: 'zane-footer',
})
export class Footer {
  /**
   * 组件宿主元素引用
   *
   * 用于直接访问组件DOM元素
   *
   * @type {HTMLElement}
   */
  @Element() host!: HTMLElement;

  /**
   * 页脚样式变体
   *
   * 通过CSS类名控制不同样式变体
   * 默认值'simple'会生成'variant-simple'类名
   *
   * @type {string}
   * @default 'simple'
   * @reflectToAttr 同步到DOM属性
   */
  @Prop({ reflect: true }) variant: string = 'simple';

  /**
   * 版权年份
   *
   * 默认为当前年份，可通过属性覆盖
   *
   * @type {number}
   * @default new Date().getFullYear()
   */
  @Prop() year = new Date().getFullYear();

  /**
   * 渲染组件
   *
   * 包含两个命名插槽的页脚布局结构
   *
   * @returns {JSX.Element} 组件JSX结构
   */
  render() {
    return (
      <Host>
        <div class="footer-container">
          <footer class={{ [`variant-${this.variant}`]: true, footer: true }}>
            <div class={'slot-container start'}>
              <slot name={'start'} />
            </div>
            <div class={'slot-container end'}>
              <slot name={'end'} />
            </div>
          </footer>
        </div>
      </Host>
    );
  }
}
