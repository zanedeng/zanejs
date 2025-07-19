import { Component, ComponentInterface, h, Host } from '@stencil/core';

/**
 * 按钮组容器组件
 */
@Component({
  shadow: true,
  styleUrl: 'button-group.scss',
  tag: 'zane-button-group',
})
export class ButtonGroup implements ComponentInterface {
  /**
   * 渲染组件
   * @returns {JSX.Element} 组件JSX结构
   */
  render() {
    return (
      <Host>
        <div class="button-group">
          <slot />
        </div>
      </Host>
    );
  }
}
