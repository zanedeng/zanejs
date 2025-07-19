import { Component, h, Host, Prop } from '@stencil/core';

/**
 * 模态框内容容器组件 (zane-modal-content)
 *
 * @component zane-modal-content
 * @shadow true
 *
 * @description
 * 专为 zane-modal 设计的结构化内容容器，提供三种预设内容样式方案，
 * 支持动态切换内容展示模式。作为模态框生态系统的核心子组件，实现：
 * - 内容区域样式规范化
 * - 自适应内容布局
 * - 多场景内容样式预设
 * - 无缝衔接父级模态框的交互状态
 *
 * @see {@link zane-modal} 关联的父级模态框组件
 *
 * @example
 * <!-- 默认带边框样式 -->
 * <zane-modal-content>
 *   <p>标准内容区块</p>
 * </zane-modal-content>
 *
 * <!-- 无边框模式 -->
 * <zane-modal-content type="borderless">
 *   <img src="data-chart.png"  alt="数据图表"/>
 * </zane-modal-content>
 *
 * <!-- 文本优化模式 -->
 * <zane-modal-content type="text">
 *   <h3>服务条款</h3>
 *   <p>这里是详细的协议文本内容...</p>
 * </zane-modal-content>
 */
@Component({
  shadow: true,
  styleUrl: 'modal-content.scss',
  tag: 'zane-modal-content',
})
export class ModalContent {
  @Prop({ reflect: true }) type: 'borderless' | 'default' | 'text' = 'default';

  render() {
    return (
      <Host>
        <div class="modal-content">
          <slot />
        </div>
      </Host>
    );
  }
}
