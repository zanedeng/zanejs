import type { InputComponentInterface } from '../../interfaces';

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

import { getComponentIndex } from '../../utils';

/**
 * @name Checkbox
 * @description Captures boolean input with an optional indeterminate mode.
 * @category Form Inputs
 * @tags input, form
 * @example <zane-checkbox value='true'>Want ice cream?</zane-checkbox>
 */
@Component({
  shadow: true,
  styleUrl: 'checkbox.scss',
  tag: 'zane-checkbox',
})
export class Checkbox implements ComponentInterface, InputComponentInterface {
  @Prop({ mutable: true, reflect: true }) configAria: any = {};

  /**
   * If true, the user cannot interact with the button. Defaults to `false`.
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  @Element() elm!: HTMLElement;

  gid: string = getComponentIndex();

  @State() hasFocus = false;

  @Prop({ mutable: true }) intermediate: boolean = false;

  @State() isActive = false;

  /**
   * The checkbox label.
   */
  @Prop() label: string;

  @Prop({ reflect: true }) layer?: '01' | '02' | 'background';

  /**
   * The input field name.
   */
  @Prop() name: string = `zane-input-${this.gid}`;

  @Prop({ reflect: true }) readonly: boolean = false;

  /**
   * If true, required icon is show. Defaults to `false`.
   */
  @Prop({ reflect: true }) required: boolean = false;

  @Prop() rounded: boolean = false;

  /**
   * The button size.
   * Possible values are: `"sm"`, `"md"`, `"lg"`. Defaults to `"md"`.
   */
  @Prop() size: 'lg' | 'md' | 'sm' = 'md';

  @State() slotHasContent = false;

  /**
   * The input field value.
   */
  @Prop({ mutable: true }) value: boolean = false;

  /**
   * Emitted when the input loses focus.
   */
  @Event({ eventName: 'zane-checkbox--blur' }) zaneBlur: EventEmitter;

  /**
   * On change of input a CustomEvent 'zane-checkbox--change' will be triggered. Event details contains parent event, oldValue, newValue of input.
   */
  @Event({ eventName: 'zane-checkbox--change' }) zaneChange: EventEmitter;

  /**
   * Emitted when the input has focus.
   */
  @Event({ eventName: 'zane-checkbox--focus' }) zaneFocus: EventEmitter;

  private iconContainer?: HTMLElement;

  private nativeElement?: HTMLInputElement;

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
    this.elm.getAttributeNames().forEach((name: string) => {
      if (name.includes('aria-')) {
        this.configAria[name] = this.elm.getAttribute(name);
        this.elm.removeAttribute(name);
      }
    });
    this.slotHasContent = this.elm.hasChildNodes();
  }
  @Method()
  async getComponentId() {
    return this.gid;
  }
  render() {
    return (
      <Host active={this.isActive} has-focus={this.hasFocus}>
        <label
          class={{
            [`size-${this.size}`]: true,
            active: this.isActive,
            checkbox: true,
            disabled: this.disabled,
            'has-content': this.slotHasContent,
            'has-focus': this.hasFocus,
            readonly: this.readonly,
            required: this.required,
            rounded: this.rounded,
            'state-checked': this.value,
            'state-intermediate': !this.value && this.intermediate,
          }}
        >
          <div
            aria-checked={`${this.value}`}
            aria-disabled={`${this.disabled}`}
            aria-required={`${this.required}`}
            class="box"
            onBlur={this.blurHandler}
            onFocus={this.focusHandler}
            onKeyDown={this.keyDownHandler}
            onKeyUp={(evt) => {
              if (evt.keyCode === 13) {
                this.clickHandler(evt);
              }
            }}
            onMouseDown={this.mouseDownHandler}
            ref={(elm) => (this.iconContainer = elm)}
            role="checkbox"
            tabindex={this.tabindex}
            {...this.configAria}
          >
            <div class="tick" />
          </div>

          <input
            aria-hidden="true"
            checked={this.value}
            class="input-native"
            name={this.name}
            onClick={this.clickHandler}
            ref={(elm) => (this.nativeElement = elm)}
            required={this.required}
            tabindex="-1"
            type="checkbox"
            value={`${this.value}`}
          />

          {(() => {
            return this.label ? (
              <div class="label">{this.label}</div>
            ) : (
              <div class="label slot-container">
                <slot />
              </div>
            );
          })()}
        </label>
      </Host>
    );
  }
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

  private blurHandler = (ev: FocusEvent) => {
    this.hasFocus = false;
    this.zaneBlur.emit(ev);
  };

  private clickHandler = (ev: KeyboardEvent | MouseEvent) => {
    if (!this.disabled && !this.readonly) {
      this.value = !JSON.parse(this.nativeElement.value);
      this.intermediate = false;
      this.zaneChange.emit(ev);
      this.iconContainer.focus();
    }
  };

  private focusHandler = (ev: FocusEvent) => {
    this.hasFocus = true;
    this.zaneFocus.emit(ev);
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
