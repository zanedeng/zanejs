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

import { getComponentIndex } from '../../../utils';

/**
 * @name Menu Item
 * @description Menu items display a list of choices on temporary surfaces.
 * @category Navigation
 * @subcategory Menu
 * @childComponent true
 */
@Component({
  shadow: true,
  styleUrl: 'menu-item.scss',
  tag: 'zane-menu-item',
})
export class MenuItem {
  @Prop() color:
    | 'black'
    | 'danger'
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'white' = 'default';

  /**
   * If true, the user cannot interact with the button. Defaults to `false`.
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  @Element() elm!: HTMLElement;

  @State() endSlotHasContent = false;

  gid: string = getComponentIndex();

  @State() hasFocus = false;

  /**
   * Hyperlink to navigate to on click.
   */
  @Prop({ reflect: true }) href: string;

  @State() isActive = false;

  @Prop({ reflect: true }) layer?: '01' | '02' | 'background';

  @Prop({ reflect: true }) selectable: boolean = false;

  /**
   * Menu item selection state.
   */
  @Prop({ reflect: true }) selected: boolean = false;

  @State() startSlotHasContent = false;
  /**
   * Sets or retrieves the window or frame at which to target content.
   */
  @Prop() target: string = '_self';
  /**
   * The menu item value.
   */
  @Prop({ mutable: true }) value?: null | number | string;
  /**
   * Emitted when the menu item is clicked.
   */
  @Event({ eventName: 'zane-menu-item--click' })
  zaneMenuItemClick: EventEmitter;

  private nativeElement?: HTMLElement;
  private tabindex?: number | string = 1;

  async componentWillLoad() {
    // If the ion-input has a tabindex attribute we get the value
    // and pass it down to the native input, then remove it from the
    // zane-input to avoid causing tabbing twice on the same element
    if (this.elm.hasAttribute('tabindex')) {
      const tabindex = this.elm.getAttribute('tabindex');
      this.tabindex = tabindex === null ? undefined : tabindex;
      this.elm.removeAttribute('tabindex');
    }
    this.endSlotHasContent = !!this.elm.querySelector('[slot="end"]');
  }

  getNativeElementTagName() {
    return this.href ? 'a' : 'div';
  }

  render = () => {
    const NativeElementTag = this.getNativeElementTagName();

    return (
      <Host active={this.isActive} has-focus={this.hasFocus}>
        <NativeElementTag
          aria-disabled={this.disabled}
          class={{
            [`color-${this.color}`]: true,
            active: this.isActive,
            disabled: this.disabled,
            'end-slot-has-content': this.endSlotHasContent,
            'has-focus': this.hasFocus,
            'menu-item': true,
            selected: this.selected,
          }}
          href={this.href}
          onBlur={this.blurHandler}
          onClick={this.clickHandler}
          onFocus={this.focusHandler}
          onKeyDown={this.keyDownHandler}
          onMouseDown={this.mouseDownHandler}
          ref={(el) => (this.nativeElement = el as HTMLElement)}
          tabindex={this.tabindex}
          target={this.target}
        >
          {this.selectable && (
            <div class="item-section start">
              {this.selected && (
                <zane-icon class="checkmark" name="checkmark" />
              )}
            </div>
          )}

          <div class="item-section slot-main">
            <slot />
          </div>

          <div class="item-section slot-end">
            <slot name="end" />
          </div>
        </NativeElementTag>
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
      this.setFocus();
      this.zaneMenuItemClick.emit({
        value: this.value || this.elm.innerText,
      });
      if (this.href) window.open(this.href, this.target);
    }
  };

  private focusHandler = () => {
    this.hasFocus = true;
  };

  private keyDownHandler = (evt) => {
    if (evt.key === ' ' || evt.key === 'Enter') {
      evt.preventDefault();
      this.isActive = true;
      this.clickHandler(evt);
    }
  };

  private mouseDownHandler = () => {
    this.isActive = true;
  };
}
