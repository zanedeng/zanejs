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
import * as DOMPurify from 'dompurify';

import { getComponentIndex, isDarkMode, observeThemeChange } from '../../utils';

const getNotificationIndex = (() => {
  let counter = 1;
  return function () {
    return `${counter++}`;
  };
})();

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
 * @name Notification Manager
 * @description The Notification Manager handles the organization and display of notifications within the application.
 * @category Informational
 * @tags notification
 * @img /assets/img/notification-manager.webp
 * @imgDark /assets/img/notification-manager-dark.webp
 */
@Component({
  shadow: true,
  styleUrl: 'notification-manager.scss',
  tag: 'zane-notification-manager',
})
export class NotificationManager implements ComponentInterface {
  @Element() elm!: HTMLElement;

  gid: string = getComponentIndex();

  @State() isDarkMode: boolean = isDarkMode();
  @Prop({ reflect: true }) name: string = 'global';

  @State() notifications: any = [];
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

  @Listen('zane-notification-dismiss', { target: 'window' })
  listenNotificationDismiss(evt: CustomEvent) {
    const notifications = this.notifications.filter((n) =>
      evt.detail.notifications.includes(n.id),
    );
    notifications.forEach((n) => (n.hide = true));
    this.notifications = [...this.notifications];
  }

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
