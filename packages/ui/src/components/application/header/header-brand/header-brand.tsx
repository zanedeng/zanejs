import { Component, Fragment, h, Method, Prop, State } from '@stencil/core';

/**
 * 头部品牌标识组件，用于显示网站/应用的品牌标识和名称
 * @Component 装饰器定义组件元数据
 * @shadow 启用Shadow DOM封装
 * @styleUrl 指定组件样式文件
 * @tag 定义组件在HTML中的标签名
 */
@Component({
  shadow: true,
  styleUrl: 'header-brand.scss',
  tag: 'zane-header-brand',
})
export class HeaderBrand {
  /**
   * 品牌标识颜色
   * @State 内部状态，可通过setColor方法修改
   */
  @State() color: any;

  /**
   * 品牌链接地址
   * @Prop 可从外部设置的属性
   * @default '#' 默认链接到页面顶部
   */
  @Prop() href: string = '#';

  /**
   * 品牌logo图片路径
   * @Prop 可从外部设置的属性
   * 支持SVG和普通图片格式
   */
  @Prop() logo: string;

  /**
   * 品牌名称
   * @Prop 可从外部设置的属性
   */
  @Prop() name: string;

  /**
   * 品牌副标题
   * @Prop 可从外部设置的属性
   */

  @Prop() subTitle: string;

  /**
   * 渲染组件
   * @returns 返回JSX表示的组件结构
   */
  render() {
    // 检测logo是否为SVG格式
    const isLogoSVG = this.logo.endsWith('.svg');
    return (
      <div class="header-brand">
        <zane-button
          class="brand-link no-style"
          color={this.color}
          href={this.href}
          variant={'link'}
        >
          <div class="brand">
            {(() => {
              if (this.logo) {
                return isLogoSVG ? (
                  <zane-svg class="logo inherit" src={this.logo} />
                ) : (
                  <img alt={this.name} class="logo" src={this.logo} />
                );
              }
            })()}
            {this.name && <span class="brand-name">{this.name}</span>}
          </div>
        </zane-button>
        {(() => {
          if (this.subTitle)
            return (
              <Fragment>
                <zane-divider class="subtitle-divider" vertical={true} />
                <div class="subtitle">{this.subTitle}</div>
              </Fragment>
            );
        })()}
      </div>
    );
  }

  /**
   * 设置品牌颜色
   * @Method 暴露给外部调用的方法
   * @param color 要设置的颜色值
   * @async 异步方法
   */
  @Method()
  async setColor(color: string) {
    this.color = color;
  }
}
