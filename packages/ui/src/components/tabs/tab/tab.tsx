import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State,
} from '@stencil/core';

import { getComponentIndex } from '../../../utils';

@Component({
  shadow: true,
  styleUrl: 'tab.scss',
  tag: 'zane-tab',
})
export class Tab implements ComponentInterface {
  /**
   * If true, the user cannot interact with the button. Defaults to `false`.
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  @Prop() disabledReason: string = '';
  gid: string = getComponentIndex();
  @State() hasFocus = false;

  @Element() host!: HTMLElement;

  /**
   * Hyperlink to navigate to on click.
   */
  @Prop({ reflect: true }) href: string;

  /**
   * Icon which will displayed on button.
   * Possible values are bootstrap icon names.
   */
  @Prop() icon: string;

  @State() isActive = false;

  @Prop() label: string;

  /**
   * Button selection state.
   */
  @Prop({ reflect: true }) selected: boolean = false;

  /**
   * Show loader.
   */
  @Prop() showLoader: boolean = false;

  @State() slotHasContent = false;

  @Prop() target: string;

  @Prop({ reflect: true }) type: 'contained' | 'contained-bottom' | 'default' =
    'default';

  @Prop() value: string;

  /**
   * On click of tab, a CustomEvent 'zane-tab-click' will be triggered.
   */
  @Event({ eventName: 'zane-tab--click' }) zaneTabClick: EventEmitter;
  private nativeElement?: HTMLButtonElement;
  private tabindex?: number | string;

  componentWillLoad() {
    // If the ion-input has a tabindex attribute we get the value
    // and pass it down to the native input, then remove it from the
    // zane-input to avoid causing tabbing twice on the same element
    if (this.host.hasAttribute('tabindex')) {
      const tabindex = this.host.getAttribute('tabindex');
      this.tabindex = tabindex === null ? undefined : tabindex;
      this.host.removeAttribute('tabindex');
    }
    this.slotHasContent = this.host.hasChildNodes();
  }

  render() {
    const NativeElementTag = this.#getNativeElementTagName();

    return (
      <Host active={this.isActive} has-focus={this.hasFocus}>
        <div
          class={{
            [`type-${this.type}`]: true,
            active: this.isActive,
            disabled: this.disabled,
            'has-content': this.slotHasContent,
            'has-focus': this.hasFocus,
            selected: this.selected,
            'show-loader': this.showLoader,
            tab: true,
          }}
        >
          <div class="tab-background" />
          <NativeElementTag
            aria-describedby={
              this.disabled && this.disabledReason
                ? `disabled-reason-${this.gid}`
                : null
            }
            aria-disabled={`${this.disabled || this.showLoader}`}
            class="native-button"
            disabled={this.disabled}
            href={this.href}
            onBlur={this.blurHandler}
            onClick={this.#clickHandler}
            onFocus={this.focusHandler}
            onKeyDown={this.#keyDownHandler}
            onMouseDown={this.mouseDownHandler}
            ref={(elm) => (this.nativeElement = elm)}
            tabindex={this.tabindex}
            target={'_blank'}
          >
            <div class="tab-content">
              {this.showLoader && (
                <zane-spinner class="spinner inherit" size="1rem" />
              )}

              {!this.showLoader && this.icon && (
                <zane-icon class="icon inherit" name={this.icon} size="1rem" />
              )}

              {!this.showLoader && (
                <div class="slot-container">
                  <slot />
                </div>
              )}

              {!this.showLoader && this.href && (
                <zane-icon class="icon inherit" name={'launch'} size="1rem" />
              )}
            </div>
          </NativeElementTag>
          {this.renderDisabledReason()}
        </div>
      </Host>
    );
  }

  @Method()
  async setFocus() {
    if (this.nativeElement) {
      this.nativeElement.focus();
    }
  }

  @Method()
  async triggerClick() {
    if (this.nativeElement) {
      this.nativeElement.click();
    }
  }

  @Listen('keyup', { target: 'window' })
  windowKeyUp(evt) {
    if (this.isActive && evt.key === ' ') this.isActive = false;
  }
  @Listen('mouseup', { target: 'window' })
  windowMouseUp() {
    if (this.isActive) this.isActive = false;
  }

  #clickHandler = () => {
    if (!this.disabled && !this.showLoader && !this.href) {
      this.zaneTabClick.emit({
        element: this.host,
        target: this.target,
        value: this.value,
      });
    }
  };

  #getNativeElementTagName() {
    return this.href ? 'a' : 'button';
  }

  #keyDownHandler(evt: KeyboardEvent) {
    if (!this.disabled && !this.showLoader) {
      if (!this.href && evt.key === 'Enter') {
        evt.preventDefault();
        this.isActive = true;
        this.#clickHandler();
      } else if (this.href && (evt.key === 'Enter' || evt.key === ' ')) {
        evt.preventDefault();
        this.isActive = true;
        this.#clickHandler();
        window.open(this.href, '_blank');
      }
    }
  }

  private blurHandler = () => {
    this.hasFocus = false;
  };

  private focusHandler = () => {
    this.hasFocus = true;
  };

  private mouseDownHandler = () => {
    this.isActive = true;
  };

  private renderDisabledReason() {
    if (this.disabled && this.disabledReason)
      return (
        <div class="sr-only" id={`disabled-reason-${this.gid}`} role="tooltip">
          {this.disabledReason}
        </div>
      );
  }
}
