/**
 * 元素尺寸枚举
 * 定义标准化的组件尺寸等级
 *
 * @remarks
 * 采用类似Bootstrap/Tailwind的尺寸命名约定
 * 适用于按钮、输入框、卡片等组件的尺寸控制
 */
export enum ElementSize {
  /**
   * 超大尺寸 (xxxl)
   * @default 'xxxl'
   */
  EXTRA_EXTRA_EXTRA_LARGE = 'xxxl',

  /**
   * 特大尺寸 (xxl)
   * @default 'xxl'
   */
  EXTRA_EXTRA_LARGE = 'xxl',

  /**
   * 加大尺寸 (xl)
   * @default 'xl'
   */
  EXTRA_LARGE = 'xl',

  /**
   * 大尺寸 (lg)
   * @default 'lg'
   */
  LARGE = 'lg',

  /**
   * 中等尺寸 (md)
   * @default 'md'
   */
  MEDIUM = 'md',

  /**
   * 超小尺寸 (sm)
   * @default 'sm'
   */
  SMALL = 'sm',
}
