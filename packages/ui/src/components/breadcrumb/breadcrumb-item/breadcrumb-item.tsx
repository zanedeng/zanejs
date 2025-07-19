import { Component, ComponentInterface, h, Host, Prop } from '@stencil/core';

/**
 * 面包屑导航项组件
 *
 * 作为面包屑导航系统的单个项使用，必须作为`zane-breadcrumb`的子元素使用。
 * 支持链接导航、活动状态指示和Schema.org 结构化数据。
 *
 * @example
 * ```html
 * <!-- 活动状态项(当前页面) -->
 * <zane-breadcrumb-item active>
 *   当前页面
 * </zane-breadcrumb-item>
 *
 * <!-- 可点击链接项 -->
 * <zane-breadcrumb-item href="/products" position="2">
 *   产品列表
 * </zane-breadcrumb-item>
 * ```
 *
 * @Component 配置项说明：
 * @property {boolean} shadow - 启用Shadow DOM封装
 * @property {string} styleUrl - 组件样式文件路径
 * @property {string} tag - 自定义元素标签名
 */
@Component({
  shadow: true,
  styleUrl: 'breadcrumb-item.scss',
  tag: 'zane-breadcrumb-item',
})
export class BreadcrumbItem implements ComponentInterface {
  /**
   * 活动状态标识
   *
   * 表示当前面包屑项是否为活动状态(通常是当前页面)。
   * 当设置为true时，该项会以非链接形式呈现。
   *
   * @type {boolean}
   * @default false
   * @memberof BreadcrumbItem
   */
  @Prop({ reflect: true }) active: boolean = false;

  /**
   * 链接目标地址
   *
   * 指定面包屑项的跳转链接。未设置时表示该项不可点击。
   * 当active为true时，此属性会被忽略。
   *
   * @type {string}
   * @memberof BreadcrumbItem
   */
  @Prop({ reflect: true }) href: string;

  /**
   * 项在列表中的位置
   *
   * 表示该项在面包屑导航中的序号位置(从1开始)。
   * 用于Schema.org 微数据和样式控制。
   *
   * @type {string}
   * @memberof BreadcrumbItem
   */
  @Prop({ reflect: true }) position: string;

  /**
   * 链接打开方式
   *
   * 指定链接的打开方式，等同于HTML的target属性。
   * 常用值: '_blank'|'_self'|'_parent'|'_top'
   *
   * @type {string}
   * @memberof BreadcrumbItem
   */
  @Prop() target: string;

  /**
   * 渲染函数
   *
   * 根据active状态渲染不同的内容结构：
   * 1. 活动状态：渲染纯文本
   * 2. 非活动状态：渲染可点击链接
   *
   * 同时添加Schema.org 微数据标记，增强SEO效果。
   *
   * @returns {JSX.Element} 组件JSX结构
   */
  render() {
    return (
      <Host
        itemprop="itemListElement"
        itemscope
        itemtype="http://schema.org/ListItem"
      >
        {this.active ? (
          <zane-text expressive={false} inline={true} type="body-compact">
            <span itemProp="name">
              <slot />
            </span>
            <meta content={this.position} itemProp="position" />
          </zane-text>
        ) : (
          <zane-text expressive={false} inline={true} type="body-compact">
            <zane-link href={this.href} itemprop="item" target={this.target}>
              <span itemProp="name">
                <slot />
              </span>
              <meta content={this.position} itemProp="position" />
            </zane-link>
          </zane-text>
        )}
      </Host>
    );
  }
}
