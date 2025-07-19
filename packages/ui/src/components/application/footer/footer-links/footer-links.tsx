import { Component, Element, h, Host, Prop } from '@stencil/core';

/**
 * 页脚链接(Footer Links)组件
 *
 * 用于展示页脚导航链接列表，支持动态链接数据传入
 *
 * @component
 * @shadowDom 使用Shadow DOM封装组件样式
 */
@Component({
  shadow: true,
  styleUrl: 'footer-links.scss',
  tag: 'zane-footer-links',
})
export class FooterLinks {
  /**
   * 组件宿主元素引用
   *
   * 用于直接访问组件DOM元素
   *
   * @type {HTMLElement}
   */
  @Element() elm!: HTMLElement;

  /**
   * 链接数据数组
   *
   * 支持两种格式：
   * 1. 对象数组格式: [{href: string, name: string}]
   * 2. JSON字符串格式: '[{"href":"...","name":"..."}]'
   *
   * @type {(Array<{href: string, name: string}>|string)}
   * @default []
   */
  @Prop() links: { href: string; name: string }[]|string = [];

  /**
   * 获取处理后的链接数据
   *
   * 统一处理字符串和数组两种输入格式
   *
   * @returns {Array<{href: string, name: string}>} 标准化后的链接数组
   */
  getLinks() {
    if (typeof this.links === 'string') return JSON.parse(this.links);
    return this.links;
  }

  /**
   * 渲染组件
   *
   * 生成无序列表结构的导航链接
   *
   * @returns {JSX.Element} 组件JSX结构
   */
  render() {
    return (
      <Host>
        <ul class={'nav-links'}>
          {this.getLinks().map((link) => {
            return (
              <li>
                <zane-link class={'no-style link'} href={link.href}>
                  {link.name}
                </zane-link>
              </li>
            );
          })}
        </ul>
      </Host>
    );
  }
}
