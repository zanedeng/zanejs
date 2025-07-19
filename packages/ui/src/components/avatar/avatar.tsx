import { Component, Element, h, Host, Prop } from '@stencil/core';

/**
 * 头像组件
 *
 * @Component 装饰器定义组件元数据
 * @shadow 启用Shadow DOM封装
 * @styleUrl 指定组件样式文件
 * @tag 定义组件在HTML中的标签名
 */
@Component({
  shadow: true,
  styleUrl: 'avatar.scss',
  tag: 'zane-avatar',
})
export class Avatar {
  /**
   * 获取组件宿主元素引用
   * @type {HTMLElement}
   */
  @Element() elm!: HTMLElement;

  /**
   * 用户姓名（用于生成首字母头像）
   * @type {string}
   * @default ''
   */
  @Prop() name: string = '';

  /**
   * 头像尺寸（支持CSS单位）
   * @type {string}
   * @default '2rem'
   */
  @Prop() size: string = '2rem';

  /**
   * 头像图片URL（优先级高于name）
   * @type {string}
   * @default ''
   */
  @Prop() src: string = '';

  /**
   * 渲染组件
   * @returns {JSX.Element} 组件JSX结构
   */
  render() {
    const cssCls = ['avatar'];
    if (this.src) {
      cssCls.push('avatar-image');
    } else {
      cssCls.push('avatar-initials');
    }
    return (
      <Host title={this.name}>
        <div class="avatar-container">
          <div
            class={cssCls.join(' ')}
            style={{
              fontSize: this.getFontSize(),
              height: this.size,
              width: this.size,
            }}
          >
            {(() => {
              return this.src ? (
                <img alt={this.name} class="image" src={this.src} />
              ) : (
                <div class="initials">{this.getInitials()}</div>
              );
            })()}
          </div>
        </div>
      </Host>
    );
  }

  /**
   * 计算字体大小（基于头像尺寸）
   * @private
   * @returns {string} 计算后的字体大小（带单位）
   */
  private getFontSize() {
    const size = this.size;
    const fontSize = this.size.match(/^\d+(\.\d{1,2})?/)[0];
    return (+fontSize * 4) / 10 + size.replace(/^\d+(\.\d{1,2})?/, '');
  }

  /**
   * 生成姓名首字母
   * @private
   * @returns {string} 大写首字母组合（如"JD"）
   */
  private getInitials() {
    const name = this.name.split(' ');
    const firstName = name[0] ? name[0].charAt(0).toUpperCase() : '';
    const lastName = name[1] ? name[1].charAt(0).toUpperCase() : '';
    return `${firstName}${lastName}`;
  }
}
