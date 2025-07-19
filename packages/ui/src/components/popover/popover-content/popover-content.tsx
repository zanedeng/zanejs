import { Component, ComponentInterface, Element, h, Host } from '@stencil/core';

import { getComponentIndex } from '../../../utils';

/**
 * 弹出框内容容器组件 (zane-popover-content)
 *
 * @component zane-popover-content
 * @shadow true
 *
 * @description
 * 弹出框系统的核心内容承载容器，提供以下核心功能：
 * 1. 结构化内容容器：为弹出内容提供标准化的布局结构
 * 2. 动态箭头指示器：根据父组件配置自动调整箭头样式和位置
 * 3. 无障碍支持：内置ARIA角色属性增强可访问性
 * 4. 主题适配：通过CSS变量支持深度主题定制
 *
 * @dependency
 * 必须作为`<zane-popover>`组件的直接子元素使用
 *
 * @slot - 默认插槽用于承载弹出内容（文本/图片/表单等任意HTML内容）
 *
 * @example
 * <!-- 基础用法 -->
 * <zane-popover-content>
 *   <h3>标题</h3>
 *   <p>详细说明内容...</p>
 *   <button>确认</button>
 * </zane-popover-content>
 *
 * <!-- 带样式定制 -->
 * <zane-popover-content style="--background: #2c3e50; --color: white">
 *   ...
 * </zane-popover-content>
 */
@Component({
  shadow: true,
  styleUrl: 'popover-content.scss',
  tag: 'zane-popover-content',
})
export class PopoverContent implements ComponentInterface {
  /**
   * 组件实例唯一标识符
   *
   * @designNote
   * - 通过工具函数生成全局唯一ID
   * - 用于DOM查询和调试跟踪
   */
  gid: string = getComponentIndex();

  @Element() host!: HTMLElement;

  render() {
    return (
      <Host>
        <div class="popover-content">
          <slot />

          <div class="arrow"></div>
        </div>
      </Host>
    );
  }
}
