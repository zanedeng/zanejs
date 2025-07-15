import {
  Component,
  ComponentInterface,
  Element,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State,
} from '@stencil/core';

import { getComponentIndex } from '../../utils';

/**
 * @name Link
 * @description Links allow users to click their way from page to page.
 * @category Navigation
 * @example <zane-link href="#">Link</zane-link>
 */
@Component({
  shadow: true,
  styleUrl: 'link.scss',
  tag: 'zane-link',
})
export class Link implements ComponentInterface {
  @Element() elm!: HTMLElement;

  gid: string = getComponentIndex();

  @State() hasFocus = false;

  /**
   * Hyperlink to navigate to on click.
   */
  @Prop({ reflect: true }) href: string;
  @State() isActive = false;

  /**
   * Sets or retrieves the window or frame at which to target content.
   */
  @Prop() target: string;
  private itemprop?: string;
  private nativeElement?: HTMLAnchorElement;
  private tabindex?: number | string;

  componentWillLoad() {
    // If the ion-input has a tabindex attribute we get the value
    // and pass it down to the native input, then remove it from the
    // zane-input to avoid causing tabbing twice on the same element
    if (this.elm.hasAttribute('tabindex')) {
      const tabindex = this.elm.getAttribute('tabindex');
      this.tabindex = tabindex === null ? undefined : tabindex;
      this.elm.removeAttribute('tabindex');
    }
    if (this.elm.hasAttribute('itemprop')) {
      const tabindex = this.elm.getAttribute('itemprop');
      this.itemprop = tabindex === null ? undefined : tabindex;
      this.elm.removeAttribute('itemprop');
    }
  }

  render() {
    return (
      <Host active={this.isActive} has-focus={this.hasFocus}>
        <a
          class={{
            active: this.isActive,
            'has-focus': this.hasFocus,
            link: true,
          }}
          href={this.href}
          itemprop={this.itemprop}
          onBlur={this.blurHandler}
          onFocus={this.focusHandler}
          onKeyDown={this.keyDownHandler}
          onMouseDown={this.mouseDownHandler}
          ref={(input) => (this.nativeElement = input)}
          tabindex={this.tabindex}
          target={this.target}
        >
          <slot />
        </a>
      </Host>
    );
  }

  @Method()
  async triggerClick() {
    if (this.nativeElement) {
      this.nativeElement.click();
    }
  }

  @Listen('keyup', { target: 'window' })
  windowKeyUp(evt) {
    if (this.isActive && (evt.key === 'Enter' || evt.key === ' '))
      this.isActive = false;
  }

  @Listen('mouseup', { target: 'window' })
  windowMouseUp() {
    if (this.isActive) this.isActive = false;
  }

  private blurHandler = () => {
    this.hasFocus = false;
  };

  private focusHandler = () => {
    this.hasFocus = true;
  };

  private keyDownHandler = (evt) => {
    if (evt.key === 'Enter' || evt.key === ' ') {
      this.isActive = true;
    }
  };

  private mouseDownHandler = () => {
    this.isActive = true;
  };
}
