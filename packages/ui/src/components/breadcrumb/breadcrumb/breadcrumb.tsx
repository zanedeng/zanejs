import { Component, ComponentInterface, Element, h, Host } from '@stencil/core';

/**
 * 面包屑导航组件
 *
 * 用于显示当前页面在网站层次结构中的位置，并提供快速导航功能。
 *
 * @example
 * ```html
 * <zane-breadcrumb>
 *   <zane-breadcrumb-item href="/home">首页</zane-breadcrumb-item>
 *   <zane-breadcrumb-item href="/products">产品</zane-breadcrumb-item>
 *   <zane-breadcrumb-item>当前页面</zane-breadcrumb-item>
 * </zane-breadcrumb>
 * ```
 *
 * @Component 装饰器定义了组件的元数据
 * @property {boolean} shadow - 启用 Shadow DOM 封装
 * @property {string} styleUrl - 组件样式文件路径
 * @property {string} tag - 组件的自定义元素标签名
 */
@Component({
  shadow: true,
  styleUrl: 'breadcrumb.scss',
  tag: 'zane-breadcrumb',
})
export class Breadcrumb implements ComponentInterface {
  /**
   * 对宿主元素的引用
   *
   * 使用 @Element() 装饰器自动注入宿主 DOM 元素。
   * 这里声明为 HTMLElement 类型，表示可以访问标准 HTML 元素的所有属性和方法。
   *
   * @type {HTMLElement}
   */
  @Element() elm!: HTMLElement;

  /**
   * 组件即将加载生命周期钩子
   *
   * 在组件首次连接到 DOM 后、渲染之前调用。
   * 这里用于初始化面包屑项的位置信息。
   *
   * 遍历所有子项(zane-breadcrumb-item)，为每个项设置 position 属性，
   * 值从1开始递增，表示项在面包屑导航中的顺序位置。
   *
   * 这些位置信息可用于样式化或辅助功能。
   */
  componentWillLoad() {
    this.elm.querySelectorAll('zane-breadcrumb-item').forEach((item, i) => {
      item.position = `${i + 1}`;
    });
  }

  /**
   * 渲染函数
   *
   * 定义组件的 DOM 结构。
   * 使用 Host 组件作为根元素，并添加微数据标记以增强 SEO。
   *
   * @returns {JSX.Element} 返回组件的 JSX 表示
   */
  render() {
    return (
      <Host itemscope itemtype="http://schema.org/BreadcrumbList">
        <div class="breadcrumb">
          <slot />
        </div>
      </Host>
    );
  }
}
