import { Component, Element, h, Host, Prop, State, Watch } from '@stencil/core';

import {
  hasSlot,
  isDarkMode,
  isLightOrDark,
  observeThemeChange,
} from '../../../../utils';

/**
 * @name Header
 * @description Header component is used to display a header with a brand, navigation, and actions.
 * @category Navigation
 * @img /assets/img/header.webp
 * @imgDark /assets/img/header-dark.webp
 */
@Component({
  shadow: true,
  styleUrl: 'header.scss',
  tag: 'zane-header',
})
export class Header {
  @State() centerSlotHasContent = false;

  /**
   * Defines the primary color of the header. This can be set to predefined color names to apply specific color themes.
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
   * States
   */
  @State() computedColor: string;

  /**
   * Color variant for dark mode, applicable when [data-theme="dark"] is set.
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

  @Prop() float: boolean = false;

  @Element() host!: HTMLElement;
  @State() themeMode: 'dark' | 'light' = 'light';
  @Watch('color')
  colorChanged() {
    this.#computedColor();
  }

  componentWillLoad() {
    this.colorChanged();
    this.#computeCenterSlotHasContent();
    observeThemeChange(() => {
      this.themeMode = isDarkMode() ? 'dark' : 'light';
      this.colorChanged();
    });
  }

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

  #computeCenterSlotHasContent() {
    this.centerSlotHasContent = hasSlot(this.host, 'center');
  }

  #computeColorLightOrDark() {
    const color = getComputedStyle(document.documentElement).getPropertyValue(
      `--color-${this.computedColor}`,
    );
    return isLightOrDark(color);
  }

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

  #getColumnType() {
    return this.centerSlotHasContent ? 'three-column' : 'two-column';
  }
}
