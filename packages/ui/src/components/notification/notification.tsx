import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core';

import { isDarkMode, observeThemeChange } from '../../utils';

/**
 * @name Notification
 * @description Notifications are messages that communicate information to the user.
 * @category Informational
 * @tags notification
 * @example <zane-notification state="success">
 *               <div slot='title'>Successful saved the record</div>
 *             </zane-notification>
 */
@Component({
  shadow: true,
  styleUrl: 'notification.scss',
  tag: 'zane-notification',
})
export class Notification implements ComponentInterface {
  /**
   * Action to be displayed on the notification
   */
  @Prop() action: string;

  /**
   * Whether the notification is dismissible
   */
  @Prop() dismissible: boolean = false;

  @Element() elm!: HTMLElement;

  @State() hidden: boolean = false;

  /**
   * Whether to use high contrast mode
   */
  @Prop() highContrast: boolean = false;

  /**
   * Whether the notification should be displayed inline
   */
  @Prop({ reflect: true }) inline: boolean = false;

  @State() isDarkMode: boolean = isDarkMode();

  /**
   * Whether the notification is managed by the notification manager
   */
  @Prop() managed: boolean = false;

  /**
   * The state of the notification.
   * Possible values are: 'success', 'error', 'info', 'warning'
   */
  @Prop({ reflect: true }) state: 'error' | 'info' | 'success' | 'warning' =
    'info';

  @Event({ eventName: 'zane-notification--action-click' })
  zaneActionClick: EventEmitter;
  /**
   * Emitted when the notification is dismissed
   */
  @Event({ eventName: 'zane-notification--dismiss' }) zaneDismiss: EventEmitter;

  componentWillLoad() {
    observeThemeChange(() => {
      this.isDarkMode = isDarkMode();
    });
  }

  render() {
    return (
      <Host hidden={this.hidden}>
        <div
          class={{
            [`state-${this.state}`]: true,
            'high-contrast': this.highContrast,
            inline: this.inline,
            notification: true,
          }}
          role="alert"
        >
          <div class="state-icon">{this.renderStateIcon()}</div>
          <div class="content">
            <div class="content-text">
              <div class="title">
                <slot name="title" />
                <slot />
              </div>
              <div class="subtitle">
                <slot name="subtitle" />
              </div>
            </div>
            {this.#renderActions()}
          </div>

          {this.#renderCloseButtons()}
        </div>
      </Host>
    );
  }

  renderStateIcon() {
    switch (this.state) {
      case 'error': {
        return (
          <zane-icon class="inherit" name="error--filled" size={'1.25rem'} />
        );
      }
      case 'info': {
        return (
          <zane-icon
            class="inherit"
            name="information--filled"
            size={'1.25rem'}
          />
        );
      }
      case 'success': {
        return (
          <zane-icon
            class="inherit"
            name="checkmark--filled"
            size={'1.25rem'}
          />
        );
      }
      case 'warning': {
        return (
          <zane-icon class="inherit" name="warning--filled" size={'1.25rem'} />
        );
      }
      // No default
    }
  }

  #renderActions() {
    if (this.action) {
      return (
        <div class="actions">
          <zane-button
            class="action"
            color={!this.highContrast || this.isDarkMode ? 'primary' : 'white'}
            onZane-button--click={() => {
              this.zaneActionClick.emit();
            }}
            size="sm"
            variant={this.inline ? 'ghost.simple' : 'outline.simple'}
          >
            {this.action}
          </zane-button>
        </div>
      );
    }
  }

  #renderCloseButtons() {
    if (this.dismissible) {
      return (
        <div class="close-button-container">
          <zane-button
            aria-label="Close alert"
            class="close-button"
            color="black"
            onZane-button--click={(evt) => {
              evt.preventDefault();
              evt.stopPropagation();
              if (!this.managed) {
                this.hidden = true;
              }
              this.zaneDismiss.emit(evt);
            }}
            variant="ghost.simple"
          >
            <zane-icon class="icon" name="close" size="1.25rem" />
          </zane-button>
        </div>
      );
    }
  }
}
