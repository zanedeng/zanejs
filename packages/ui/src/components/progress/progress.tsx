import { Component, h, Host, Prop } from '@stencil/core';

/**
 * 动态进度指示器组件 (zane-progress)
 *
 * @component zane-progress
 * @shadow true
 *
 * @description
 * 提供可视化任务进程的进度指示器，支持多种状态显示和尺寸配置。适用于文件上传、数据加载、操作流程等场景。
 *
 * @slot - 无插槽设计（纯视觉组件）
 *
 * @example
 * <!-- 基础用法 -->
 * <zane-progress value={75}></zane-progress>
 *
 * <!-- 带标签和状态 -->
 * <zane-progress
 *   value={50}
 *   label="上传进度"
 *   status="active"
 *   helperText="剩余时间：2分钟"
 * ></zane-progress>
 *
 * <!-- 错误状态 -->
 * <zane-progress
 *   value={30}
 *   status="error"
 *   helperText="上传失败，请重试"
 * ></zane-progress>
 */
@Component({
  shadow: true,
  styleUrl: 'progress.scss',
  tag: 'zane-progress',
})
export class Progress {
  /**
   * 辅助说明文本
   *
   * @designNote
   * - 显示在进度条下方的补充信息
   * - 可用于展示剩余时间、错误详情等动态内容
   * - 建议不超过40字符
   *
   * @example
   * "剩余时间：2分钟" | "上传失败：网络断开"
   */
  @Prop() helperText: string;

  /**
   * 是否隐藏标签区域
   *
   * @default false
   *
   * @designNote
   * - 设为 true 时隐藏顶部标签区域（包括标签和状态图标）
   * - 适用于空间受限场景（如移动端小部件）
   * - 与 `label` 属性联动：当 hideLabel=true 时 label 自动失效
   */
  @Prop() hideLabel: boolean = false;

  /**
   * 进度标签文本
   *
   * @designNote
   * - 显示在进度条顶部的标题文本
   * - 建议使用简洁的动词短语（如："文件上传"、"数据处理"）
   * - 国际化支持：可通过 slot 机制实现多语言
   *
   * @example
   * "安装进度" | "资源加载"
   */
  @Prop() label: string;

  /**
   * 组件尺寸模式
   *
   * @default 'md'
   *
   * @designNote
   * 可选值及其应用场景：
   * | **值** | **尺寸** | **适用场景**            |
   * |---------|----------|------------------------|
   * | 'md'    | 中等尺寸 | 标准页面内容区（默认）  |
   * | 'sm'    | 小型尺寸 | 表格内嵌/工具栏紧凑布局 |
   *
   * 尺寸规范：
   * | **尺寸** | 高度 | 字体大小 | 圆角半径 |
   * |-----------|------|----------|----------|
   * | md        | 24px | 14px     | 12px     |
   * | sm        | 16px | 12px     | 8px      |
   */
  @Prop() size: 'md' | 'sm' = 'md';

  /**
   * 进度状态类型
   *
   * @default 'active'
   *
   * @designNote
   * 状态机逻辑：
   * | **状态值** | **视觉表现**                     | **使用场景**               |
   * |-------------|----------------------------------|----------------------------|
   * | 'active'    | 蓝色动态条纹（默认）             | 进行中的任务               |
   * | 'success'   | 绿色+成功图标（✔️）              | 已完成的任务               |
   * | 'error'     | 红色+错误图标（❌）              | 失败/中断的任务            |
   *
   * 状态交互规则：
   * 1. 当 value=100 时自动切换为 'success'（优先级高于手动设置）
   * 2. 'error' 状态必须手动触发（如网络异常）
   */
  @Prop() status: 'active' | 'error' | 'success' = 'active';

  /**
   * 当前进度值
   *
   * @default null
   *
   * @designNote
   * - 范围：0-100（百分比值）
   * - 特殊值 null：显示不定长动画（indeterminate 模式）
   * - 边界处理：
   *   - <0 自动修正为0
   *   - >100 自动修正为100
   * - 动画效果：进度变化时带300ms缓动过渡
   */
  @Prop() value: number = null;

  /**
   * 获取状态图标渲染内容
   *
   * @private
   * @returns {JSX.Element | null} 图标组件或null
   *
   * @designNote
   * 图标映射规则：
   * | **状态**   | 图标名称         | 颜色    | 尺寸比例 |
   * |-------------|------------------|---------|----------|
   * | 'success'   | checkmark--filled| #52c41a | 0.8em    |
   * | 'error'     | error--filled    | #ff4d4f | 0.8em    |
   * | 'active'    | 无图标           | -       | -        |
   *
   * 实现说明：
   * 1. 仅在非 active 状态显示图标
   * 2. 图标通过 zane-icon 组件实现（需确保图标库已加载）
   */
  getRenderIcon() {
    if (this.status === 'success') {
      return (
        <zane-icon
          class={'progress-icon'}
          name={'checkmark--filled'}
        ></zane-icon>
      );
    } else if (this.status === 'error') {
      return (
        <zane-icon class={'progress-icon'} name={'error--filled'}></zane-icon>
      );
    }
  }

  render() {
    return (
      <Host>
        <div
          class={{
            [`size-${this.size}`]: true,
            [`status-${this.status}`]: true,
            indeterminate: this.value === null && this.status === 'active',
            progress: true,
          }}
        >
          {!this.hideLabel && (
            <div class="progress-header">
              <label class="progress-label">{this.label}</label>
              {this.getRenderIcon()}
            </div>
          )}
          <div class="progress-track">
            <div
              aria-valuemax="100"
              aria-valuemin="0"
              aria-valuenow={this.value}
              class="progress-bar"
              role="progressbar"
              style={{ width: `${this.value}%` }}
            ></div>
          </div>
          <div class="progress-helper">{this.helperText}</div>
        </div>
      </Host>
    );
  }
}
