import {
  Component,
  ComponentInterface,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core';

/**
 * 当前时间显示组件
 * @Component 装饰器定义组件元数据
 * @shadow 启用Shadow DOM封装
 * @styleUrl 组件样式表路径
 * @tag 组件自定义标签名称
 */
@Component({
  shadow: true,
  styleUrl: 'current-time.scss',
  tag: 'zane-current-time',
})
export class CurrentTime implements ComponentInterface {
  /**
   * 当前时间戳
   * 使用Date.now() 获取的毫秒级时间戳
   * @State 装饰器表示这是组件内部状态，变化会触发重新渲染
   * 默认值为组件初始化时的时间戳
   */
  @State() currentTime: number = Date.now();

  /**
   * 定时器ID
   * 用于存储setInterval返回的计时器引用
   * 在组件卸载时需要清除
   */
  timer: number;

  /**
   * 时区设置
   * 遵循IANA时区数据库的时区字符串格式
   * 例如: "Asia/Shanghai", "America/New_York"
   * @Prop 装饰器表示这是组件的公开属性
   * 未指定时使用运行环境的默认时区
   */
  @Prop() timezone: string;

  /**
   * 组件连接到DOM时的生命周期回调
   * 在此处启动定时器，每秒更新一次时间
   */
  connectedCallback() {
    this.timer = window.setInterval(() => {
      // 每秒更新currentTime状态，触发重新渲染
      this.currentTime = Date.now();
    }, 1000);
  }

  /**
   * 组件从DOM断开连接时的生命周期回调
   * 在此处清除定时器，避免内存泄漏
   */
  disconnectedCallback() {
    window.clearInterval(this.timer);
  }

  /**
   * 渲染组件
   * 将时间戳格式化为本地时间字符串
   * @returns 组件虚拟DOM
   */
  render() {
    // 将时间戳转换为指定时区的时间字符串
    const time = new Date(this.currentTime).toLocaleTimeString('en-US', {
      timeZone: this.timezone, // 使用时区属性
    });

    return (
      <Host>
        <div class="current-time">{time}</div>
      </Host>
    );
  }
}
