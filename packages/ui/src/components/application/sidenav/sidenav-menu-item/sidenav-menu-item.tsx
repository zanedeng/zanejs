import {
  Component,
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

import { getComponentIndex } from '../../../../utils';

@Component({
  shadow: true,
  styleUrl: 'sidenav-menu-item.scss',
  tag: 'zane-sidenav-menu-item',
})
export class SidenavMenuItem {
  /**
   * If true, the user cannot interact with the button. Defaults to `false`.
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  @Element() elm!: HTMLElement;

  @State() endSlotHasContent = false;

  gid: string = getComponentIndex();

  @State() hasFocus = false;

  @State() isActive = false;

  /**
   * Menu item selection state.
   */
  @Prop({ reflect: true }) selected: boolean = false;

  @State() startSlotHasContent = false;
  /**
   * The menu item value.
   */
  @Prop({ mutable: true }) value?: null | number | string;

  /**
   * Emitted when the menu item is clicked.
   */
  @Event({ eventName: 'zane:sidenav-menu-item-click' })
  zaneMenuItemClick: EventEmitter;

  private nativeElement?: HTMLElement;

  private tabindex?: number | string = 1;

  componentWillLoad() {
    // If the ion-input has a tabindex attribute we get the value
    // and pass it down to the native input, then remove it from the
    // zane-input to avoid causing tabbing twice on the same element
    if (this.elm.hasAttribute('tabindex')) {
      const tabindex = this.elm.getAttribute('tabindex');
      this.tabindex = tabindex === null ? undefined : tabindex;
      this.elm.removeAttribute('tabindex');
    }
    this.startSlotHasContent = !!this.elm.querySelector('[slot="start"]');
    this.endSlotHasContent = !!this.elm.querySelector('[slot="end"]');
  }

  render = () => {
    return (
      <Host active={this.isActive} has-focus={this.hasFocus}>
        <div
          aria-disabled={this.disabled}
          class={{
            active: this.isActive,
            disabled: this.disabled,
            'end-slot-has-content': this.endSlotHasContent,
            'has-focus': this.hasFocus,
            selected: this.selected,
            'sidenav-menu-item': true,
            'start-slot-has-content': this.startSlotHasContent,
          }}
          onBlur={this.blurHandler}
          onClick={this.clickHandler}
          onFocus={this.focusHandler}
          onKeyDown={this.keyDownHandler}
          onMouseDown={this.mouseDownHandler}
          ref={(el) => (this.nativeElement = el as HTMLElement)}
          tabindex={this.tabindex}
        >
          <div class="item-section slot-start">
            <slot name="start" />
          </div>

          <div class="item-section slot-main">
            <slot />
          </div>

          <div class="item-section slot-end">
            <slot name="end" />
          </div>
        </div>
      </Host>
    );
  };
  /**
   * Sets blur on the native `input` in `zane-input`. Use this method instead of the global
   * `input.blur()`.
   */
  @Method()
  async setBlur() {
    if (this.nativeElement) {
      this.nativeElement.blur();
    }
  }
  /**
   * Sets focus on the native `input` in `zane-input`. Use this method instead of the global
   * `input.focus()`.
   */
  @Method()
  async setFocus() {
    if (this.nativeElement) {
      this.nativeElement.focus();
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

  private blurHandler = () => {
    this.hasFocus = false;
  };

  private clickHandler = (event) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.zaneMenuItemClick.emit({
        value: this.value || this.elm.innerText,
      });
    }
  };

  private focusHandler = () => {
    this.hasFocus = true;
  };

  private keyDownHandler = (evt) => {
    if (evt.key === ' ') {
      evt.preventDefault();
      this.isActive = true;
      this.clickHandler(evt);
    }
  };

  private mouseDownHandler = () => {
    this.isActive = true;
  };
}
