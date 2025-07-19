import { Component, ComponentInterface, h, Host } from '@stencil/core';

/**
 * 菜单分隔线组件
 * @component zane-menu-divider
 * @slot - 此组件不包含插槽
 * @shadow true
 *
 * @description
 * 提供菜单项之间的视觉分隔效果，用于增强菜单结构的可读性。该组件：
 * - 实现菜单项分组逻辑分隔
 * - 支持深浅主题色自动适配
 * - 提供标准化的间距和高度
 *
 * @example
 * <!-- 基础用法 -->
 * <zane-menu>
 *   <zane-menu-item>选项一</zane-menu-item>
 *   <zane-menu-divider></zane-menu-divider> <!-- 分隔线 -->
 *   <zane-menu-item>选项二</zane-menu-item>
 * </zane-menu>
 *
 * <!-- 分组场景 -->
 * <zane-menu>
 *   <zane-menu-item>操作类</zane-menu-item>
 *   <zane-menu-divider></zane-menu-divider>
 *   <zane-menu-item>设置类</zane-menu-item>
 * </zane-menu>
 */
@Component({
  shadow: true,
  styleUrl: 'menu-divider.scss',
  tag: 'zane-menu-divider',
})
export class MenuDivider implements ComponentInterface {
  /**
   * 核心渲染方法
   * @returns {JSX.Element} 组件虚拟DOM结构
   */
  render() {
    return (
      <Host>
        <div class="divider"></div>
      </Host>
    );
  }
}
