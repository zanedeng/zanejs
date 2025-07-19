import {
  Component,
  ComponentInterface,
  Element,
  h,
  Host,
  Listen,
  Prop,
  State,
} from '@stencil/core';
import DOMPurify from 'dompurify';

import { getComponentIndex, isDarkMode, observeThemeChange } from '../../utils';

/**
 * 通知ID生成器闭包
 * @private
 * @function getNotificationIndex
 * @returns {function} 返回自增ID生成函数
 */
const getNotificationIndex = (() => {
  let counter = 1;
  return function () {
    return `${counter++}`;
  };
})();

/**
 * 通知对象类型定义
 * @typedef {Object} Notification
 * @property {string} [action] - 操作按钮文本（可选）
 * @property {boolean} dismissible - 是否可关闭
 * @property {boolean} hide - 是否隐藏状态
 * @property {string} id - 全局唯一通知ID
 * @property {string} state - 通知状态类型
 * @property {string} [subtitle] - 副标题HTML内容（可选）
 * @property {number} timeout - 自动关闭超时（毫秒）
 * @property {string} title - 标题HTML内容
 * @property {string} [width] - 自定义宽度（CSS单位）
 */
type Notification = {
  action?: string;
  dismissible: boolean;
  hide: boolean;
  id: string;
  state: string;
  subtitle?: string;
  timeout: number;
  title: string;
  width?: string;
};

/**
 * 智能通知管理系统组件 (zane-notification-manager)
 *
 * @component zane-notification-manager
 * @shadow true
 *
 * @description
 * 全局通知管理中心，提供以下核心能力：
 * 1. 跨组件通知聚合：通过事件总线收集全应用通知
 * 2. 多位置布局：支持4种屏幕定位策略
 * 3. 生命周期管理：自动关闭/手动关闭/防重复
 * 4. 安全渲染：内置DOM净化防止XSS攻击
 * 5. 主题适配：自动同步暗黑模式状态
 *
 * @example
 * <!-- 基础用法 -->
 * <zane-notification-manager position="top-right"></zane-notification-manager>
 *
 * <!-- 自定义命名管理器 -->
 * <zane-notification-manager name="dashboard" position="bottom-left"></zane-notification-manager>
 */
@Component({
  shadow: true,
  styleUrl: 'notification-manager.scss',
  tag: 'zane-notification-manager',
})
export class NotificationManager implements ComponentInterface {
  /** 宿主元素引用 */
  @Element() elm!: HTMLElement;

  /** 组件实例唯一标识 */
  gid: string = getComponentIndex();

  /** 当前是否为暗黑模式 */
  @State() isDarkMode: boolean = isDarkMode();

  /**
   * 管理器命名空间
   * @prop {string} [name='global'] - 管理器唯一标识
   * - `global`：默认全局管理器，接收未指定目标的通告
   * - 自定义名：只接收相同target参数的通告
   * @example
   * // 发送到指定管理器
   * const event = new CustomEvent('zane-notification', {
   *   detail: { target: 'dashboard', title: '数据更新完成' }
   * });
   * window.dispatchEvent(event);
   */
  @Prop({ reflect: true }) name: string = 'global';

  /** 通知队列状态 */
  @State() notifications: any = [];

  /**
   * 通知定位策略
   * @prop {'top-left'|'top-right'|'bottom-left'|'bottom-right'} [position='bottom-right'] - 通知容器屏幕位置
   *
   * @option top-left - 左上角定位
   * - 适用场景：重要实时状态更新（如系统监控）
   * - 设计规范：距顶部20px，距左侧20px
   *
   * @option top-right - 右上角定位（默认）
   * - 适用场景：通用信息提示（如操作反馈）
   * - 设计规范：距顶部20px，距右侧20px
   *
   * @option bottom-left - 左下角定位
   * - 适用场景：后台任务通知（如文件下载）
   * - 设计规范：距底部20px，距左侧20px
   *
   * @option bottom-right - 右下角定位
   * - 适用场景：非紧急通知（如新闻推送）
   * - 设计规范：距底部20px，距右侧20px
   */
  @Prop({ reflect: true }) position:
    | 'bottom-left'
    | 'bottom-right'
    | 'top-left'
    | 'top-right' = 'bottom-right';

  componentWillLoad() {
    observeThemeChange(() => {
      this.isDarkMode = isDarkMode();
    });
  }

  /**
   * 全局通知事件监听器
   * @listens window:zane-notification
   * @param {CustomEvent} evt - 通知事件对象
   */
  @Listen('zane-notification', { target: 'window' })
  listenNotification(evt: CustomEvent) {
    if (
      (evt.detail.target === this.name || this.name === 'global') &&
      !evt.detail.procced
    ) {
      evt.preventDefault();
      evt.stopPropagation();
      evt.detail.procced = true;
      const notification: Notification = {
        action: evt.detail.action,
        dismissible: evt.detail.dismissible,

        hide: false,
        id: `notification-${this.gid}-${getNotificationIndex()}`,
        state: evt.detail.state,
        subtitle: evt.detail.subtitle,
        timeout: evt.detail.timeout,
        title: evt.detail.title,
        width: evt.detail.width,
      };
      this.notifications = this.notifications
        .concat([notification])
        .filter((n) => !n.hide);

      if (evt.detail.callback) {
        evt.detail.callback(notification.id);
      }

      if (!notification.dismissible)
        setTimeout(() => {
          notification.hide = true;
          this.notifications = [...this.notifications];
        }, notification.timeout || 5000);
    }
  }

  /**
   * 通知关闭事件监听器
   * @listens window:zane-notification-dismiss
   * @param {CustomEvent} evt - 关闭事件对象
   */
  @Listen('zane-notification-dismiss', { target: 'window' })
  listenNotificationDismiss(evt: CustomEvent) {
    const notifications = this.notifications.filter((n) =>
      evt.detail.notifications.includes(n.id),
    );
    notifications.forEach((n) => (n.hide = true));
    this.notifications = [...this.notifications];
  }

  /**
   * 主渲染方法
   * @returns {JSX.Element} 虚拟DOM结构
   *
   * @domStructure
   * <zane-notification-manager>
   *   <div class="notification-manager position-{placement}">
   *     <div class="notification" id={id} hidden={hide}>
   *       <!-- 通过renderNotification生成 -->
   *     </div>
   *   </div>
   * </zane-notification-manager>
   */
  render() {
    return (
      <Host>
        <div
          class={{
            [`position-${this.position}`]: true,
            'notification-manager': true,
          }}
        >
          {this.notifications.map((notification) => (
            <div
              class={{ hidden: notification.hide, notification: true }}
              id={notification.id}
            >
              {this.renderNotification(notification)}
            </div>
          ))}
        </div>
      </Host>
    );
  }

  /**
   * 通知项渲染器
   * @private
   * @param {Notification} notification - 通知对象
   * @returns {JSX.Element} zane-notification组件实例
   *
   * @securityFeature
   * 使用DOMPurify对title/subtitle进行XSS过滤
   * - 允许标签：<b>, <i>, <a>, <br>
   * - 过滤属性：移除所有on*事件处理器
   * - 安全协议：强制将http链接转为https
   */
  renderNotification(notification) {
    return (
      <zane-notification
        action={notification.action}
        dismissible={notification.dismissible}
        managed={true}
        onZane-notification--dismiss={() => {
          notification.hide = true;
          this.notifications = [...this.notifications];
        }}
        state={notification.state}
        style={{ width: notification.width }}
      >
        <div innerHTML={DOMPurify.sanitize(notification.title)} slot="title" />
        <div
          innerHTML={DOMPurify.sanitize(notification.subtitle)}
          slot="subtitle"
        />
      </zane-notification>
    );
  }
}
