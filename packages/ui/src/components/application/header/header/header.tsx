import { Component, Element, h, Host, Prop, State, Watch } from '@stencil/core';

import {
  hasSlot,
  isDarkMode,
  isLightOrDark,
  observeThemeChange,
} from '../../../../utils';

/**
 * 头部组件，提供可定制的页面顶部导航栏
 * @Component 装饰器定义组件元数据
 * @shadow 启用Shadow DOM封装
 * @styleUrl 指定组件样式文件
 * @tag 定义组件在HTML中的标签名
 */
@Component({
  shadow: true,
  styleUrl: 'header.scss',
  tag: 'zane-header',
})
export class Header {
  /**
   * 标记中心插槽是否有内容
   * @State 内部状态，当内容变化时会触发重新渲染
   */
  @State() centerSlotHasContent = false;

  /**
   * 头部组件的颜色主题
   * @Prop 可从外部设置的属性
   * @type {'black' | 'danger' | 'primary' | 'secondary' | 'success' | 'warning' | 'white' | string}
   * - 'black': 黑色主题
   * - 'danger': 危险/错误状态颜色
   * - 'primary': 主品牌色
   * - 'secondary': 次要颜色
   * - 'success': 成功状态颜色
   * - 'warning': 警告状态颜色
   * - 'white': 白色主题
   * - string: 自定义颜色值
   * @default 'black'
   */
  @Prop() color:
    | 'black'
    | 'danger'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'white'
    | string = 'black';

  /**
   * 计算后的实际使用颜色
   * @State 内部状态，根据主题模式自动计算
   */
  @State() computedColor: string;

  /**
   * 暗黑模式下的颜色主题
   * @Prop 可选属性，暗黑模式下的替代颜色
   * @type {'black' | 'danger' | 'primary' | 'secondary' | 'success' | 'warning' | 'white' | string}
   * 枚举值与color属性相同
   */
  @Prop() darkModeColor?:
    | 'black'
    | 'danger'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'white'
    | string;

  /**
   * 是否启用浮动模式
   * @Prop 控制头部是否浮动在内容上方
   * @default false
   */
  @Prop() float: boolean = false;

  /**
   * 宿主元素引用
   * @Element 获取组件宿主元素
   */
  @Element() host!: HTMLElement;

  /**
   * 当前主题模式
   * @State 内部状态，跟踪当前UI主题
   * @type {'dark' | 'light'}
   * - 'dark': 暗黑主题
   * - 'light': 明亮主题
   * @default 'light'
   */
  @State() themeMode: 'dark' | 'light' = 'light';

  /**
   * 颜色变化监听器
   * @Watch 监听color属性变化
   */
  @Watch('color')
  colorChanged() {
    this.#computedColor();
  }

  /**
   * 组件加载前生命周期钩子
   * 初始化颜色状态和插槽状态，并监听主题变化
   */
  componentWillLoad() {
    this.colorChanged();
    this.#computeCenterSlotHasContent();
    observeThemeChange(() => {
      this.themeMode = isDarkMode() ? 'dark' : 'light';
      this.colorChanged();
    });
  }

  /**
   * 渲染组件
   * @returns 返回JSX表示的组件结构
   */
  render() {
    return (
      <Host color-is={this.#computeColorLightOrDark()}>
        <header
          class={{
            [`color-${this.computedColor}`]: true,
            float: this.float,
            header: true,
            [this.#getColumnType()]: true,
          }}
        >
          <div class="header-container">
            <div class="left-section section">
              <slot name="left" />
            </div>
            {this.centerSlotHasContent && (
              <div class="center-section section">
                <slot
                  name="center"
                  onSlotchange={() => this.#computeCenterSlotHasContent()}
                />
              </div>
            )}
            <div class="right-section section">
              <slot name="right" />
            </div>
          </div>
        </header>
      </Host>
    );
  }

  /**
   * 计算中心插槽是否有内容
   * @private 私有方法
   */
  #computeCenterSlotHasContent() {
    this.centerSlotHasContent = hasSlot(this.host, 'center');
  }

  /**
   * 计算颜色是亮色还是暗色
   * @private 私有方法
   * @returns {'light' | 'dark'} 返回颜色亮度类型
   */
  #computeColorLightOrDark() {
    const color = getComputedStyle(document.documentElement).getPropertyValue(
      `--color-${this.computedColor}`,
    );
    return isLightOrDark(color);
  }

  /**
   * 计算最终使用的颜色
   * @private 私有方法
   * 根据当前主题模式选择适当颜色，并更新子组件颜色
   */
  #computedColor() {
    this.computedColor = this.color;
    if (isDarkMode() && this.darkModeColor) {
      this.computedColor = this.darkModeColor;
    }
    this.host.querySelectorAll('zane-header-action').forEach((el) => {
      (el as any).setColor(this.computedColor);
    });
    (this.host.querySelector('zane-header-brand') as any)?.setColor(
      this.computedColor,
    );
  }

  /**
   * 获取布局列类型
   * @private 私有方法
   * @returns {'two-column' | 'three-column'} 根据插槽内容返回布局类型
   */
  #getColumnType() {
    return this.centerSlotHasContent ? 'three-column' : 'two-column';
  }
}
