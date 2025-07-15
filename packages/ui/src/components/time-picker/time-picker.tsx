import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
} from '@stencil/core';

import { getComponentIndex } from '../../utils';

/**
 * @name Time Picker
 * @description Captures time input.
 * @category Form Inputs
 * @tags input, form
 * @example <zane-time-picker value='true'></zane-time-picker>
 */
@Component({
  shadow: true,
  styleUrl: 'time-picker.scss',
  tag: 'zane-time-picker',
})
export class TimePicker {
  @Prop({ mutable: true, reflect: true }) configAria: any = {};

  /**
   * If true, the user cannot interact with the button. Defaults to `false`.
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  @Element() elm!: HTMLElement;

  gid: string = getComponentIndex();

  @State() hasFocus = false;

  @Prop({ reflect: true }) inline: boolean = false;

  /**
   * The input field name.
   */
  @Prop() name: string = `zane-input-${this.gid}`;

  /**
   * The input field placeholder.
   */
  @Prop() placeholder: string;

  /**
   * If true, the user read the value cannot modify it. Defaults to `false`.
   */
  @Prop({ reflect: true }) readonly: boolean = false;

  /**
   * The input field size.
   * Possible values are: `"sm"`, `"md"`, `"lg"`. Defaults to `"md"`.
   */
  @Prop({ reflect: true }) size: 'lg' | 'md' | 'sm' = 'md';

  /**
   * The input field value.
   */
  @Prop({ mutable: true }) value?: null | number | string = '';

  /**
   * Emitted when the input loses focus.
   */
  @Event({ eventName: 'zane-time-picker--blur' }) zaneBlur: EventEmitter;

  /**
   * Emitted when the value has changed.
   */
  @Event({ eventName: 'zane-time-picker--change' }) zaneChange: EventEmitter;
  /**
   * Emitted when the input has focus.
   */
  @Event({ eventName: 'zane-time-picker--focus' }) zaneFocus: EventEmitter;
  /**
   * Emitted when a keyboard input occurred.
   */
  @Event({ eventName: 'zane-time-picker--input' }) zaneInput: EventEmitter;
  private nativeElement?: HTMLInputElement;

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
    this.elm.getAttributeNames().forEach((name: string) => {
      if (name.includes('aria-')) {
        this.configAria[name] = this.elm.getAttribute(name);
        this.elm.removeAttribute(name);
      }
    });
  }

  @Method()
  async getComponentId() {
    return this.gid;
  }

  render() {
    return (
      <Host has-focus={this.hasFocus} has-value={this.hasValue()}>
        <div
          class={{
            disabled: this.disabled,
            'has-focus': this.hasFocus,
            'input-container': true,
          }}
        >
          <input
            class="input input-native"
            disabled={this.disabled}
            onBlur={this.blurHandler}
            onFocus={this.focusHandler}
            onInput={this.inputHandler}
            onKeyDown={this.keyDownHandler}
            readOnly={this.readonly}
            ref={(input) => (this.nativeElement = input)}
            tabindex={this.tabindex}
            type="time"
          />

          <zane-button
            class="input-action"
            color={'secondary'}
            disabled={this.disabled}
            icon={'time'}
            onZane-button--click={() => {
              setTimeout(() => {
                this.nativeElement.showPicker();
              });
            }}
            size={this.size}
            variant="ghost.simple"
          ></zane-button>
        </div>
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
      this.hasFocus = false;
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
      this.hasFocus = true;
    }
  }

  private blurHandler = (ev: FocusEvent) => {
    this.hasFocus = false;
    this.zaneBlur.emit(ev);
  };

  private clearInput = (evt: Event) => {
    this.nativeElement.value = '';
    this.inputHandler(evt);
  };

  private focusHandler = (ev: FocusEvent) => {
    this.hasFocus = true;
    this.zaneFocus.emit(ev);
  };

  private getValue(): string {
    return (this.value || '').toString();
  }

  private hasValue(): boolean {
    return this.getValue().length > 0;
  }

  private inputHandler = (ev: Event) => {
    const input = ev.target as HTMLInputElement | null;
    const oldValue = this.value;
    if (input) {
      this.value = input.value;
    }
    this.zaneInput.emit(ev as KeyboardEvent);
    if (oldValue !== this.value) {
      this.zaneChange.emit(ev as KeyboardEvent);
    }
  };

  private keyDownHandler = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
      this.clearInput(ev);
    }
  };
}
