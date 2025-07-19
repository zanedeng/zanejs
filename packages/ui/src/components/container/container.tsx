import {
  Component,
  ComponentInterface,
  Element,
  h,
  Host,
  Prop,
} from '@stencil/core';

/**
 * 容器布局组件
 * @Component 装饰器定义组件元数据
 * @shadow 启用Shadow DOM封装
 * @styleUrl 组件样式表路径
 * @tag 组件自定义标签名称
 */
@Component({
  shadow: true,
  styleUrl: 'container.scss',
  tag: 'zane-container',
})
export class Container implements ComponentInterface {
  /**
   * 宿主元素引用
   * @Element 装饰器获取宿主元素
   */
  @Element() host!: HTMLElement;

  /**
   * 容器尺寸选项
   * - 'full': 全宽容器
   * - 'lg': 大号容器
   * - 'max': 最大宽度容器
   * - 'md': 中等容器 (默认值)
   * - 'sm': 小号容器
   * - 'xl': 超大容器
   * @Prop 装饰器表示这是组件的公开属性
   * @reflect 表示属性值会反映到DOM属性上
   * 默认值为 'full'
   */
  @Prop({ reflect: true })
  size: 'full' | 'lg' | 'max' | 'md' | 'sm' | 'xl' = 'full';

  /**
   * 渲染组件
   * @returns 组件虚拟DOM
   */
  render() {
    return (
      <Host>
        <div
          class={{
            [`size-${this.size}`]: true,
            'container-wrapper': true,
          }}
        >
          <div class="container">
            <div class="content">
              <slot />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
