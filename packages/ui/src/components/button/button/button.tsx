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
  Watch,
} from '@stencil/core';
import { throttle } from 'lodash';

import {
  getComponentIndex,
  hasSlot,
  isDarkMode,
  isLightOrDark,
  observeThemeChange,
} from '../../../utils';

const PREDEFINED_BUTTON_COLORS = new Set([
  'black',
  'danger',
  'error',
  'info',
  'primary',
  'secondary',
  'success',
  'warning',
  'white',
]);

/**
 * @name Button
 * @description Buttons are used to initialize an action. Button labels express what action will occur when the user interacts with it.
 * @overview
 *  <p>Buttons are clickable elements that are used to trigger actions. They communicate calls to action to the user and allow users to interact with pages in a variety of ways. Button labels express what action will occur when the user interacts with it.</p>
 * @category General
 * @tags controls
 * @example <zane-button>
 *   Button CTA
 *   </zane-button>
 */
@Component({
  shadow: true,
  styleUrl: 'button.scss',
  tag: 'zane-button',
})
export class Button implements ComponentInterface {
  /**
   * The `appendData` property allows you to attach additional data to the button component. This data can be of any type, making it versatile for various use cases. It's particularly useful for passing extra context or information that can be accessed in event handlers or other component logic.
   */
  @Prop() appendData: any;

  /**
   * Triggered when the button is clicked.
   */
  @Event({ eventName: 'zane-button--click' }) clickEvent: EventEmitter<{
    appendData: any;
  }>;
  /**
   * Defines the primary color of the button. This can be set to predefined color names to apply specific color themes.
   */
  @Prop({ reflect: true }) color:
    | 'black'
    | 'danger'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'white' = 'primary';
  @State() computedColor: string;
  @Prop({ mutable: true, reflect: true }) configAria: any = {};
  /**
   * Color variant for dark mode, applicable when [data-theme="dark"] is set.
   */
  @Prop({ reflect: true }) darkModeColor?:
    | 'black'
    | 'danger'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'white';

  /**
   * If true, the user cannot interact with the button. Defaults to `false`.
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  /**
   * If button is disabled, the reason why it is disabled.
   */
  @Prop() disabledReason: string = '';

  /**
   * States
   */
  @State() hasFocus = false;

  @State() hasHover = false;

  @Element() host!: HTMLElement;

  /**
   * Hyperlink to navigate to on click.
   */
  @Prop({ reflect: true }) href: string;

  /**
   * Icon which will displayed on button.
   * Possible values are icon names.
   */
  @Prop() icon?: string;

  /**
   * Icon alignment.
   * Possible values are `"start"`, `"end"`. Defaults to `"end"`.
   */
  @Prop() iconAlign: 'end' | 'start' = 'end';

  @State() isActive = false;

  /**
   * Button selection state.
   */
  @Prop({ reflect: true }) selected: boolean = false;

  /**
   * If true, a loader will be displayed on button.
   */
  @Prop() showLoader: boolean = false;

  /**
   * Button size.
   * Possible values are `"sm"`, `"md"`, `"lg"`, `"xl"`, `"2xl"`, `"full"`. Defaults to `"md"`.
   */
  @Prop({ reflect: true }) size: '2xl' | 'lg' | 'md' | 'sm' | 'xl' | 'xs' =
    'md';

  @State() slotHasContent = false;

  /**
   * Sets or retrieves the window or frame at which to target content.
   */
  @Prop() target: string = '_self';

  /**
   * Sets the delay for throttle in milliseconds. Defaults to 200 milliseconds.
   */
  @Prop() throttleDelay = 200;

  /**
   * If true, the button will be in a toggled state.
   */
  @Prop() toggle: boolean = false;

  /**
   *  Button type based on which actions are performed when the button is clicked.
   */
  @Prop() type: 'button' | 'reset' | 'submit' = 'button';

  /**
   * The visual style of the button.
   *
   *  Possible variant values:
   * `"default"` is a filled button.
   * `"outline"` is an outlined button.
   * `"ghost"` is a transparent button.
   * `"light"` is a light color button.
   *
   * Possible sub-variant values:
   * `"simple"` is a simple button without default padding at end.
   * `"block"` is a full-width button that spans the full width of its container.
   *
   *
   *  Mix and match the `variant` and `sub-variant` to create a variety of buttons.
   *  `"default.simple"`, `"outline.block"` etc.
   */
  @Prop({ reflect: true }) variant:
    | 'default'
    | 'default.simple'
    | 'ghost'
    | 'ghost.simple'
    | 'light'
    | 'light.simple'
    | 'link'
    | 'link.simple'
    | 'neo'
    | 'neo.simple'
    | 'outline'
    | 'outline.simple' = 'default';

  private buttonElm?: HTMLDivElement;

  private gid: string = getComponentIndex();

  private handleClickWithThrottle: () => void;

  private nativeElement: HTMLButtonElement;
  private tabindex?: number | string;
  @Watch('color')
  @Watch('darkModeColor')
  colorChanged() {
    this.#computedColor();
  }
  componentDidRender() {
    if (this.#computeColorLightOrDark() === 'dark') {
      this.buttonElm.style.setProperty(
        '--internal-button-support-contrast-color',
        `var(--zane-button-support-contrast-color, white)`,
      );
    } else {
      this.buttonElm.style.setProperty(
        '--internal-button-support-contrast-color',
        `var(--zane-button-support-contrast-color, black)`,
      );
    }
  }
  componentWillLoad() {
    // If the zane-button has a tabindex attribute we get the value
    // and pass it down to the native input, then remove it from the
    // zane-button to avoid causing tabbing twice on the same element
    if (this.host.hasAttribute('tabindex')) {
      const tabindex = this.host.getAttribute('tabindex');
      this.tabindex = tabindex === null ? undefined : tabindex;
      this.host.removeAttribute('tabindex');
    }
    if (this.host.getAttributeNames)
      this.host.getAttributeNames().forEach((name: string) => {
        if (name.includes('aria-')) {
          this.configAria[name] = this.host.getAttribute(name);
          this.host.removeAttribute(name);
        }
      });
    this.#computeSlotHasContent();
    this.#computedColor();
    observeThemeChange(() => {
      this.#computedColor();
    });
  }

  connectedCallback() {
    this.handleClickWithThrottle = throttle(
      this.handleClick,
      this.throttleDelay,
    );
  }

  handleClick = () => {
    this.clickEvent.emit({
      appendData: this.appendData,
    });
  };

  render() {
    const NativeElementTag = this.#getNativeElementTagName();

    const variants = this.variant?.split('.');
    if (
      ['default', 'ghost', 'light', 'link', 'neo', 'outline'].includes(
        variants[0],
      ) === false
    ) {
      variants.unshift('default');
    }

    const [variant, subVariant] = variants as [string, string?];

    const hostStyle: any = {};
    if (subVariant === 'block') {
      hostStyle.display = `block`;
      hostStyle.width = `100%`;
    }

    const style = {};
    if (!PREDEFINED_BUTTON_COLORS.has(this.computedColor)) {
      style['--internal-button-color'] = `var(--color-${this.computedColor})`;
      style['--internal-button-color-light'] =
        `var(--color-${this.computedColor}-10)`;
      style['--internal-button-color-neo'] =
        `var(--color-${this.computedColor}-50)`;
      style['--internal-button-color-hover'] =
        `var(--color-${this.computedColor}-70, var(--color-${this.computedColor}-hover-60))`;
      style['--internal-button-color-active'] =
        `var(--color-${this.computedColor}-80)`;
    }

    return (
      <Host active={this.isActive} style={hostStyle}>
        <div
          class={{
            [`color-${this.computedColor}`]: true,
            [`color-is-${this.#computeColorLightOrDark()}`]: true,
            [`size-${this.size}`]: true,
            [`variant-${subVariant}`]: !!subVariant,
            [`variant-${variant}`]: true,
            active: this.isActive,
            button: true,
            disabled: this.disabled,
            'has-content': this.slotHasContent,
            'has-focus': this.hasFocus,
            'has-icon': !!this.icon,
            hover: this.hasHover,
            selected: this.selected,
            'show-loader': this.showLoader,
          }}
          ref={(elm: HTMLDivElement) => (this.buttonElm = elm)}
          style={style}
        >
          <div class="button-neo-background" />
          <div class="button-background" />
          <NativeElementTag
            aria-describedby={
              this.disabled && this.disabledReason
                ? `disabled-reason-${this.gid}`
                : null
            }
            aria-disabled={`${this.disabled || this.showLoader}`}
            class="native-button"
            href={this.href}
            onBlur={() => this.#onBlur()}
            onClick={(evt) => this.#onClick(evt)}
            onFocus={() => this.#onFocus()}
            onKeyDown={(evt) => this.#onKeyDown(evt)}
            onKeyUp={(evt) => this.#onKeyUp(evt)}
            onMouseDown={() => this.#onMouseDown()}
            onMouseOut={() => this.#onMouseOut()}
            onMouseOver={() => this.#onMouseOver()}
            ref={(elm: HTMLButtonElement) => (this.nativeElement = elm)}
            role="button"
            tabindex={this.tabindex}
            target={this.target}
            type={this.type}
            {...this.configAria}
          >
            <div class="button-content">
              {!this.showLoader &&
                this.icon &&
                this.iconAlign === 'start' &&
                this.#renderIcon(this.icon)}

              <div class="slot-container">
                <slot onSlotchange={() => this.#computeSlotHasContent()} />
              </div>

              {this.showLoader && (
                <zane-spinner
                  class="spinner loader inherit"
                  hideBackground={true}
                />
              )}

              {!this.showLoader &&
                this.icon &&
                this.iconAlign === 'end' &&
                this.#renderIcon(this.icon)}
            </div>
          </NativeElementTag>
          {this.#renderDisabledReason()}
        </div>
      </Host>
    );
  }

  /**
   * Sets blur on the native `button` in `zane-button`. Use this method instead of the global
   * `button.blur()`.
   */
  @Method()
  async setBlur() {
    this.nativeElement.blur();
    this.hasFocus = false;
  }

  /**
   * Sets focus on the native `button` in `zane-button`. Use this method instead of the global
   * `button.focus()`.
   */
  @Method()
  async setFocus() {
    this.nativeElement.focus();
    this.hasFocus = true;
  }

  /**
   * Triggers a click event on the native `button` in `zane-button`. Use this method instead of the global
   * `button.click()`.
   */
  @Method()
  async triggerClick() {
    this.nativeElement.click();
  }

  @Listen('keyup', { target: 'window' })
  windowKeyUp(evt: { key: string }) {
    if (this.isActive && !this.toggle && evt.key === ' ') this.isActive = false;
  }

  @Listen('mouseup', { target: 'window' })
  windowMouseUp() {
    if (this.isActive && !this.toggle) this.isActive = false;
  }

  #computeColorLightOrDark() {
    if (this.buttonElm === null) return;
    let color = getComputedStyle(this.buttonElm).getPropertyValue(
      `--internal-button-color`,
    );
    if (this.variant !== 'link') {
      if (this.hasHover)
        color = getComputedStyle(this.buttonElm).getPropertyValue(
          `--internal-button-color-hover`,
        );
      if (this.isActive || this.selected)
        color = getComputedStyle(this.buttonElm).getPropertyValue(
          `--internal-button-color-active`,
        );
    }
    return isLightOrDark(color);
  }

  #computedColor() {
    this.computedColor = this.color;
    if (isDarkMode() && this.darkModeColor) {
      this.computedColor = this.darkModeColor;
    }
  }

  #computeSlotHasContent() {
    this.slotHasContent = hasSlot(this.host);
  }

  #getNativeElementTagName() {
    return this.href ? 'a' : 'button';
  }

  #onBlur = () => {
    this.hasFocus = false;
  };

  #onClick(evt: MouseEvent) {
    if (!this.disabled && !this.showLoader) {
      this.handleClickWithThrottle();
    } else {
      evt.preventDefault();
      evt.stopPropagation();
      evt.stopImmediatePropagation();
    }
  }

  #onFocus = () => {
    this.hasFocus = true;
  };

  #onKeyDown = (evt: KeyboardEvent) => {
    if (
      !this.disabled &&
      !this.showLoader &&
      (evt.key === 'Enter' || evt.key === ' ')
    ) {
      if (this.href) {
        evt.preventDefault();
        this.isActive = true;
        this.handleClickWithThrottle();
        window.open(this.href, this.target);
      } else {
        evt.preventDefault();
        this.isActive = this.toggle ? !this.isActive : true;
        this.handleClickWithThrottle();
      }
    }
  };

  #onKeyUp = (evt: KeyboardEvent) => {
    if (
      !this.disabled &&
      !this.showLoader &&
      !this.toggle &&
      (evt.key === 'Enter' || evt.key === ' ')
    ) {
      this.isActive = false;
    }
  };

  #onMouseDown = () => {
    this.isActive = this.toggle ? !this.isActive : true;
  };

  #onMouseOut = () => {
    this.hasHover = false;
  };

  #onMouseOver = () => {
    this.hasHover = true;
  };

  #renderDisabledReason() {
    if (this.disabled && this.disabledReason)
      return (
        <div class="sr-only" id={`disabled-reason-${this.gid}`} role="tooltip">
          {this.disabledReason}
        </div>
      );
  }

  #renderIcon(iconName: string) {
    return <zane-icon class="icon inherit" name={iconName} />;
  }
}
