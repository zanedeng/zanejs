import {
  Component,
  ComponentInterface,
  Element,
  h,
  Host,
  Method,
} from '@stencil/core';

import { getComponentIndex } from '../../../utils';

/**
 * 下拉菜单内容组件（需与zane-dropdown配合使用）
 * @Component 装饰器定义组件元数据
 * @shadow 启用Shadow DOM封装
 * @styleUrl 组件样式表路径
 * @tag 组件自定义标签名称
 */
@Component({
  shadow: true,
  styleUrl: 'dropdown-menu.scss',
  tag: 'zane-dropdown-menu',
})
export class DropdownMenu implements ComponentInterface {
  /**
   * 组件唯一ID
   * 通过工具函数生成
   */
  gid: string = getComponentIndex();

  /**
   * 宿主元素引用
   * @Element 装饰器获取宿主元素
   */
  @Element() host!: HTMLElement;

  /**
   * 内部菜单组件引用
   * 用于操作底层zane-menu组件
   */
  menuRef: HTMLZaneMenuElement;

  /**
   * 渲染组件
   * @returns 组件虚拟DOM
   */
  render() {
    return (
      <Host>
        <zane-menu class="dropdown-content" ref={(elm) => (this.menuRef = elm)}>
          <slot />
        </zane-menu>
      </Host>
    );
  }

  /**
   * 设置焦点的公共方法
   * 将焦点设置到菜单组件
   * @Method 装饰器定义公共方法
   */
  @Method()
  async setFocus() {
    await this.menuRef.setFocus();
  }
}
