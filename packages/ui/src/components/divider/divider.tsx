import {
  Component,
  ComponentInterface,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core';

/**
 * 分割线组件
 * @Component 装饰器定义组件元数据
 * @shadow 启用Shadow DOM封装
 * @styleUrl 组件样式表路径
 * @tag 组件自定义标签名称
 */
@Component({
  shadow: true,
  styleUrl: 'divider.scss',
  tag: 'zane-divider',
})
export class Divider implements ComponentInterface {
  /**
   * 宿主元素引用
   * @Element 装饰器获取宿主元素
   */
  @Element() elm!: HTMLElement;

  /**
   * 插槽是否有内容
   * 用于判断是否显示中间内容区域
   * @State 装饰器表示这是组件内部状态
   */
  @State() slotHasContent = false;

  /**
   * 是否为垂直方向
   * @Prop 装饰器，reflect表示会反映到DOM属性上
   * 默认值为false(水平方向)
   */
  @Prop({ reflect: true }) vertical: boolean = false;

  /**
   * 组件即将加载生命周期钩子
   * 检查插槽是否有内容
   */
  componentWillLoad() {
    this.slotHasContent = this.elm.hasChildNodes();
  }

  /**
   * 渲染组件
   * @returns 组件虚拟DOM
   */
  render() {
    return (
      <Host>
        <div
          class={{
            divider: true,
            'has-content': this.slotHasContent,
            vertical: this.vertical,
          }}
        >
          <div class="line" />
          <div class="slot-container">
            <slot />
          </div>
          <div class="line" />
        </div>
      </Host>
    );
  }
}
