import { Component, ComponentInterface, h, Host, Prop } from '@stencil/core';

/**
 * 标签页内容面板容器
 *
 * 该组件与 zane-tab 标签页组件配合使用，形成完整的标签页系统。当标签页被激活时，
 * 关联的面板内容将显示在界面中，支持层级深度控制以实现复杂的视觉层次效果。
 *
 * @example
 * <zane-tab-panel value="profile" active>
 *   用户资料详情内容
 * </zane-tab-panel>
 */
@Component({
  shadow: true,
  styleUrl: 'tab-panel.scss',
  tag: 'zane-tab-panel',
})
export class TabPanel implements ComponentInterface {
  /**
   * 面板激活状态（与关联标签页同步）
   *
   * 当设置为 true 时，面板将显示在界面中。该属性通常由父级 zane-tabs 组件自动管理，
   * 开发者也支持手动控制以实现特殊交互场景。
   *
   * @type {boolean}
   * @prop active
   * @default false
   * @reflect
   */
  @Prop({ reflect: true }) active: boolean = false;

  /**
   * 视觉层级深度控制
   *
   * 提供三层深度选项，用于构建层次化界面效果：
   * - '01': 顶层面板（默认最高层级）
   * - '02': 中间层级面板
   * - 'background': 背景层级面板（最低层级）
   *
   * @type {'01' | '02' | 'background'}
   * @prop layer
   * @reflect
   */
  @Prop({ reflect: true }) layer?: '01' | '02' | 'background';

  /**
   * 面板唯一标识值
   *
   * 必须与对应 zane-tab 组件的 target 属性匹配，建立标签页与内容面板的关联关系。
   * 该值应确保在同一个 zane-tabs 容器中保持唯一。
   *
   * @type {string}
   * @prop value
   * @reflect
   */
  @Prop({ reflect: true }) value: string;

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
