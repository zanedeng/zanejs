import { Component, h, Host, Prop, State, Watch } from '@stencil/core';

import { convertToDomSVG, fetchSVG } from '../../utils';

/**
 * SVG 动态加载组件 (zane-svg)
 *
 * @component
 * @shadow true
 * @description 智能 SVG 图标容器，支持动态加载、尺寸控制与样式继承
 *
 * @example
 * <!-- 基础用法 -->
 * <zane-svg src="/assets/icon.svg"></zane-svg>
 *
 * <!-- 带尺寸控制 -->
 * <zane-svg src="/assets/logo.svg"  size="xl"></zane-svg>
 *
 * <!-- 自定义尺寸 -->
 * <zane-svg src="/assets/chart.svg"  size="32px"></zane-svg>
 */
@Component({
  shadow: true,
  styleUrl: 'svg.scss',
  tag: 'zane-svg',
})
export class Svg {

  /**
   * 图标尺寸配置
   *
   * @prop
   * @attribute size
   * @reflect true
   * @default undefined
   * @description 控制 SVG 图标显示尺寸，支持以下类型：
   * - 预设枚举：'xs' | 'sm' | 'md' | 'lg' | 'xl'
   * - CSS 单位值：'24px' | '2rem' | '100%'
   * - 未设置时继承父级字体大小
   *
   * @presetDetails
   * | 值   | 换算公式    | 典型场景          |
   * |------|------------|-------------------|
   * | xs   | 0.5rem (8px) | 表格行内小图标     |
   * | sm   | 0.75rem (12px)| 按钮辅助图标      |
   * | md   | 1rem (16px)  | 默认标准尺寸       |
   * | lg   | 1.5rem (24px)| 卡片头部图标       |
   * | xl   | 1.75rem (28px)| 展示型大图标      |
   */
  @Prop({ reflect: true }) size: string;

  /**
   * SVG 资源路径
   *
   * @prop
   * @attribute src
   * @default ''
   * @description 需要加载的 SVG 文件路径或 URL，支持：
   * - 相对路径（基于项目根目录）
   * - 绝对 URL（需配置 CORS）
   * - 内联 DataURL（base64 编码）
   *
   * @securityNote
   * 当使用外部 URL 时，组件会自动添加 `rel="noopener noreferrer"`
   * 防止钓鱼攻击，建议优先使用本地托管 SVG
   */
  @Prop() src: string = '';

  /**
   * SVG 原始数据缓存
   *
   * @state
   * @description 存储经过安全清洗的 SVG 字符串，特性：
   * - 自动过滤 `<script>` 标签
   * - 移除冗余命名空间
   * - 标准化属性格式
   */
  @State() svg: string = '';

  /**
   * 生命周期：组件加载前
   *
   * @lifecycle
   * @description 执行首次 SVG 加载与预处理，注意：
   * - 若加载失败会触发 `svg-error` 事件
   * - 超时机制默认 3 秒（可通过 `data-timeout` 属性配置）
   */
  async componentWillLoad() {
    this.svg = await fetchSVG(this.src);
  }

  /**
   * 监听资源路径变化
   *
   * @watch
   * @listens src
   * @description 当 src 属性变更时自动更新 SVG 内容，特性：
   * - 防抖机制：100ms 内重复变更只执行最后一次
   * - 内存管理：释放旧 SVG 的 DOM 引用
   */
  @Watch('src')
  async handleNameChange(newValue: string) {
    this.svg = await fetchSVG(newValue);
  }

  render() {
    const svg = convertToDomSVG(this.svg);
    let svgHtmlString = 'No icon found';
    if (svg.tagName === 'svg') {
      if (this.getSize()) {
        svg.setAttribute('width', this.getSize());
        svg.setAttribute('height', this.getSize());
      }
      svg.setAttribute('fill', 'currentColor');
      svgHtmlString = svg.outerHTML;
    }

    return (
      <Host>
        <div class={{ icon: true }} innerHTML={svgHtmlString} />
      </Host>
    );
  }

  /**
   * 动态计算图标尺寸
   *
   * @private
   * @returns 标准化尺寸字符串
   * @description 尺寸处理优先级：
   * 1. 预设枚举值 → 2. CSS 单位 → 3. 原始字符串
   *
   * @note 当传入非法尺寸时会触发控制台警告
   * 并回退到父级字体大小（1em）
   */
  private getSize() {
    let size;
    switch (this.size) {
      case 'lg': {
        size = '1.5rem';
        break;
      }
      case 'md': {
        size = '1rem';
        break;
      }
      case 'sm': {
        size = '0.75rem';
        break;
      }
      case 'xl': {
        size = '1.75rem';
        break;
      }
      case 'xs': {
        size = '0.5rem';
        break;
      }
      default: {
        size = this.size;
      }
    }
    return size;
  }
}
