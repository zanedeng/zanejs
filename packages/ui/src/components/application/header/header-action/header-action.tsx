import { Component, Element, h, Method, Prop, State } from '@stencil/core';

/**
 * 头部操作按钮组件，用于在头部导航栏中创建可交互的操作项
 * @Component 装饰器定义组件元数据
 * @shadow 启用Shadow DOM封装
 * @styleUrl 指定组件样式文件
 * @tag 定义组件在HTML中的标签名
 */
@Component({
  shadow: true,
  styleUrl: 'header-action.scss',
  tag: 'zane-header-action',
})
export class HeaderAction {
  /**
   * 徽标内容
   * @Prop 可从外部设置的属性
   * @default '_self'
   */
  @Prop() badge: string = '_self';

  /**
   * 按钮颜色
   * @State 内部状态，可通过setColor方法修改
   */
  @State() color: any;

  /**
   * ARIA可访问性配置
   * @Prop 可从外部设置的属性
   * @mutable 允许组件内部修改
   * @reflect 将属性值反映到DOM属性
   * @default {}
   */
  @Prop({ mutable: true, reflect: true }) configAria: any = {};

  /**
   * 宿主元素引用
   * @Element 获取组件宿主元素
   */
  @Element() elm!: HTMLElement;

  /**
   * 链接地址
   * @Prop 可从外部设置的属性
   * @reflect 将属性值反映到DOM属性
   */
  @Prop({ reflect: true }) href: string;

  /**
   * 图标名称
   * @Prop 可从外部设置的属性
   */
  @Prop() icon: string;

  /**
   * 是否选中状态
   * @Prop 可从外部设置的属性
   * @default false
   */
  @Prop() selected: boolean = false;

  /**
   * 按钮尺寸
   * @Prop 可从外部设置的属性
   * @type {'lg' | 'md' | 'none' | 'sm' | 'xl' | 'xxl'}
   * - 'lg': 大尺寸
   * - 'md': 中等尺寸(默认)
   * - 'none': 无特定尺寸
   * - 'sm': 小尺寸
   * - 'xl': 超大尺寸
   * - 'xxl': 特大尺寸
   * @default 'md'
   */
  @Prop() size: 'lg' | 'md' | 'none' | 'sm' | 'xl' | 'xxl' = 'md';

  /**
   * 插槽是否有内容
   * @State 内部状态，跟踪插槽内容变化
   */
  @State() slotHasContent = false;

  /**
   * 链接打开方式
   * @Prop 可从外部设置的属性
   * @default '_self'
   */
  @Prop() target: string = '_self';

  /**
   * 组件加载前生命周期钩子
   * 检查插槽内容并收集ARIA属性
   */
  componentWillLoad() {
    this.slotHasContent = this.elm.hasChildNodes();
    if (this.elm.getAttributeNames)
      this.elm.getAttributeNames().forEach((name: string) => {
        if (name.includes('aria-')) {
          this.configAria[name] = this.elm.getAttribute(name);
          this.elm.removeAttribute(name);
        }
      });
  }

  /**
   * 渲染组件
   * @returns 返回JSX表示的组件结构
   */
  render() {
    return (
      <zane-button
        class="header-action"
        color={this.color}
        configAria={this.configAria}
        href={this.href}
        icon={this.icon}
        selected={this.selected}
        target={this.target}
        variant={'default.simple'}
      >
        {this.slotHasContent && <slot></slot>}
      </zane-button>
    );
  }

  /**
   * 设置按钮颜色
   * @Method 暴露给外部调用的方法
   * @param color 要设置的颜色值
   */
  @Method()
  async setColor(color: string) {
    this.color = color;
  }
}
