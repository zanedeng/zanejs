import { Component, h, Host, Prop } from '@stencil/core';

/**
 * 卡片组件
 * 提供可自定义阴影级别的卡片容器
 */
@Component({
  shadow: true,
  styleUrl: 'card.scss',
  tag: 'zane-card',
})
export class Card {
  /**
   * 卡片阴影级别
   * @type {'lg' | 'md' | 'sm' | 'xl' | 'xs' | 'xxl' | undefined}
   * - 'xs': 超小阴影 (extra small)
   * - 'sm': 小阴影 (small)
   * - 'md': 中等阴影 (medium，默认未指定时)
   * - 'lg': 大阴影 (large)
   * - 'xl': 超大阴影 (extra large)
   * - 'xxl': 特大阴影 (extra extra large)
   * - undefined: 无阴影
   * 阴影级别应在card.scss中定义对应的box-shadow值
   */
  @Prop() shadowLevel: 'lg' | 'md' | 'sm' | 'xl' | 'xs' | 'xxl' | undefined;

  /**
   * 渲染方法
   * @returns {JSX.Element} 卡片组件结构
   */
  render() {
    return (
      <Host shadow-level={this.shadowLevel}>
        <div class="card">
          <slot />
        </div>
      </Host>
    );
  }
}
