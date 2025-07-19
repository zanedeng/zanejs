import { Component, Element, h, Host, Prop } from '@stencil/core';

/**
 * 页脚版权(Footer Copyright)组件
 *
 * 用于展示标准版权声明，包含年份、版权所有者链接和保留权利声明
 *
 * @component
 * @shadowDom 使用Shadow DOM封装组件样式
 */
@Component({
  shadow: true,
  styleUrl: 'footer-copyright.scss',
  tag: 'zane-footer-copyright',
})
export class FooterCopyright {
  /**
   * 版权所有者名称
   *
   * 将显示为可点击链接（当copyrightHref设置时）
   *
   * @type {string}
   */
  @Prop() copyright: string;

  /**
   * 版权所有者链接
   *
   * 设置后会将版权名称渲染为可点击链接
   *
   * @type {string}
   */
  @Prop() copyrightHref: string;

  /**
   * 组件宿主元素引用
   *
   * 用于直接访问组件DOM元素
   *
   * @type {HTMLElement}
   */
  @Element() elm!: HTMLElement;

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
   * 生成标准版权声明结构，包含年份和版权所有者链接
   *
   * @returns {JSX.Element} 组件JSX结构
   */
  render() {
    return (
      <Host>
        <zane-text class={'legal'} expressive={true} type="legal">
          &copy; {this.year}&nbsp;
          <zane-link href={this.copyrightHref}>{this.copyright}</zane-link>. All
          Rights Reserved.
        </zane-text>
      </Host>
    );
  }
}
