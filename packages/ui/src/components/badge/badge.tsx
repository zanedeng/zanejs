import { Component, h, Host, Prop } from '@stencil/core';

/**
 * 徽章组件
 *
 * @Component 装饰器定义组件元数据
 * @shadow 启用Shadow DOM封装
 * @styleUrl 指定组件样式文件
 * @tag 定义组件在HTML中的标签名
 */
@Component({
  shadow: true,
  styleUrl: 'badge.scss',
  tag: 'zane-badge',
})
export class Badge {
  /**
   * 徽章颜色主题
   * @type {'error'|'primary'|'secondary'|'success'|'warning'}
   * @default 'error'
   * @reflect 属性值会反射到DOM属性
   *
   * 枚举说明：
   * - error: 错误状态（红色系）
   * - primary: 主要状态（品牌主色系）
   * - secondary: 次要状态（中性色系）
   * - success: 成功状态（绿色系）
   * - warning: 警告状态（黄色系）
   */
  @Prop({ reflect: true }) color:
    | 'error'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning' = 'error';

  /**
   * 徽章显示内容
   * @type {string}
   */
  @Prop() content: string;

  /**
   * 渲染组件
   * @returns {JSX.Element} 组件JSX结构
   */
  render() {
    return (
      <Host>
        <div class={{ [`color-${this.color}`]: true, badge: true }}>
          <div
            class={{
              'badge-content': true,
              'has-content': this.content !== '',
            }}
          >
            {this.content}
          </div>
          <slot />
        </div>
      </Host>
    );
  }
}
