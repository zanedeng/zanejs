import { Component, ComponentInterface, Element, h, Prop } from '@stencil/core';

/**
 * 侧边导航栏组件，提供页面侧边导航功能
 * @Component 装饰器定义组件元数据
 * @shadow 启用Shadow DOM封装
 * @styleUrl 指定组件样式文件
 * @tag 定义组件在HTML中的标签名
 */
@Component({
  shadow: true,
  styleUrl: 'sidenav.scss',
  tag: 'zane-sidenav',
})
export class Sidenav implements ComponentInterface {
  /**
   * 宿主元素引用
   * @Element 获取组件宿主元素
   */
  @Element() elm!: HTMLElement;

  /**
   * 是否显示加载指示器
   * @Prop 可从外部设置的属性
   * @default false
   */
  @Prop() showLoader: boolean = false;

  /**
   * 组件加载前生命周期钩子
   * 预留用于未来可能的初始化逻辑
   */
  componentWillLoad() {}

  /**
   * 渲染组件
   * @returns 返回JSX表示的组件结构
   */
  render() {
    return (
      <div class="sidenav">
        <slot />
      </div>
    );
  }
}
