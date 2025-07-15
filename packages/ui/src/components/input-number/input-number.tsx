import type { InputComponentInterface } from '../../interfaces';

import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import { debounceEvent, getComponentIndex } from '../../utils';

/**
 * @name Number
 * @description Number input lets users enter a numeric value and incrementally increase or decrease the value with a two-segment control.
 * @category Form Inputs
 * @tags input, form
 * @example <zane-number value="100"></zane-input>
 */
@Component({
  shadow: true,
  styleUrl: 'input-number.scss',
  tag: 'zane-number',
})
export class InputNumber
  implements ComponentInterface, InputComponentInterface
{
  /**
   * Indicates whether the value of the control can be automatically completed by the browser.
   */
  @Prop() autocomplete: 'off' | 'on' = 'off';

  @Prop({ mutable: true, reflect: true }) configAria: any = {};

  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `zaneChange` event after each keystroke.
   */
  @Prop() debounce = 300;

  /**
   * If true, the user cannot interact with the button. Defaults to `false`.
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  @Element() elm!: HTMLElement;

  @State() endSlotHasContent = false;

  gid: string = getComponentIndex();

  @State() hasFocus = false;

  @Prop() helperText: string;

  @Prop({ reflect: true }) hideActions: boolean = false;

  @Prop({ reflect: true }) inline: boolean = false;

  @Prop() invalid: boolean = false;

  @Prop() invalidText: string;

  @Prop() label: string;

  /**
   * The input field name.
   */
  @Prop() name: string = `zane-input-${this.gid}`;

  @State() passwordVisible = false;

  /**
   * The input field placeholder.
   */
  @Prop() placeholder: string;

  /**
   * If true, the user read the value cannot modify it. Defaults to `false`.
   */
  @Prop({ reflect: true }) readonly: boolean = false;

  /**
   * If true, required icon is show. Defaults to `false`.
   */
  @Prop({ reflect: true }) required: boolean = false;

  /**
   * The input field size.
   * Possible values are: `"sm"`, `"md"`, `"lg"`. Defaults to `"md"`.
   */
  @Prop({ reflect: true }) size: 'lg' | 'md' | 'sm' = 'md';

  @Prop() skeleton: boolean = false;

  @State() startSlotHasContent = false;

  /**
   * The input state.
   * Possible values are: `"success"`, `"error"`, `"warning"`, 'default'. Defaults to `"default"`.
   */
  @Prop({ reflect: true }) state: 'default' | 'error' | 'success' | 'warning' =
    'default';

  /**
   * The input field value.
   */
  @Prop({ mutable: true }) value?: null | number = null;

  @Prop() warn: boolean = false;

  @Prop() warnText: string;
  /**
   * Emitted when the input loses focus.
   */
  @Event({ eventName: 'zane-number--blur' }) zaneBlur: EventEmitter;
  /**
   * Emitted when the value has changed.
   */
  @Event({ eventName: 'zane-number--change' }) zaneChange: EventEmitter;

  /**
   * Emitted when the input has focus.
   */
  @Event({ eventName: 'zane-number--focus' }) zaneFocus: EventEmitter;
  /**
   * Emitted when a keyboard input occurred.
   */
  @Event({ eventName: 'zane-number--input' }) zaneInput: EventEmitter;
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
    this.startSlotHasContent = !!this.elm.querySelector('[slot="start"]');
    this.endSlotHasContent = !!this.elm.querySelector('[slot="end"]');
  }

  connectedCallback() {
    this.debounceChanged();
  }

  @Method()
  async getComponentId() {
    return this.gid;
  }

  getLabel() {
    return this.skeleton ? (
      <div class="label skeleton" />
    ) : (
      <label class="label">
        {this.required && <span class="required">*</span>}
        {this.label}
      </label>
    );
  }

  render() {
    return (
      <Host
        has-focus={this.hasFocus}
        has-value={this.hasValue()}
        invalid={this.invalid}
        warn={this.warn}
      >
        <div class={{ 'form-control': true, inline: this.inline }}>
          {this.label && this.getLabel()}
          <div class="field">
            {this.skeleton ? (
              <div class="input-container-skeleton" />
            ) : (
              this.renderInput()
            )}
          </div>
          {this.renderHelper()}
        </div>
      </Host>
    );
  }

  renderHelper() {
    if (this.invalid)
      return <div class="helper invalid">{this.invalidText}</div>;
    else if (this.warn) return <div class="helper warn">{this.warnText}</div>;
    else if (this.helperText || this.helperText === '')
      return <div class="helper text">{this.helperText}</div>;
  }

  renderInput() {
    return (
      <div
        class={{
          disabled: this.disabled,
          'end-slot-has-content': this.endSlotHasContent,
          'has-focus': this.hasFocus,
          'input-container': true,
          'start-slot-has-content': this.startSlotHasContent,
        }}
      >
        <div class="slot-container start">
          <slot name="start" />
        </div>

        <input
          autoComplete={this.autocomplete}
          class="input input-native"
          disabled={this.disabled}
          name={this.name}
          onBlur={this.blurHandler}
          onFocus={this.focusHandler}
          onInput={this.inputHandler}
          placeholder={this.placeholder}
          readOnly={this.readonly}
          ref={(input) => (this.nativeElement = input)}
          required={this.required}
          tabIndex={this.tabindex}
          type="number"
          value={this.value}
          {...this.configAria}
        />

        {!this.readonly && !this.disabled && !this.hideActions && (
          <zane-button
            aria-label="Decrease"
            class="input-action"
            color={'secondary'}
            icon="subtract"
            onGoat-button--click={(evt) => {
              this.decrease(evt);
            }}
            size={this.size}
            variant="ghost.simple"
          ></zane-button>
        )}

        {!this.readonly && !this.disabled && !this.hideActions && (
          <zane-button
            class="input-action"
            color={'secondary'}
            icon="add"
            onGoat-button--click={(evt) => {
              this.increment(evt);
            }}
            size={this.size}
            variant="ghost.simple"
          ></zane-button>
        )}

        <div class="slot-container end">
          <slot name="end" />
        </div>
      </div>
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

  @Watch('debounce')
  protected debounceChanged() {
    this.zaneChange = debounceEvent(this.zaneChange, this.debounce);
  }

  private blurHandler = (ev: FocusEvent) => {
    this.hasFocus = false;
    this.zaneBlur.emit(ev);
  };

  private decrease(ev) {
    if (this.value === undefined || this.value === null) this.value = 0;
    if (typeof this.value === 'number') {
      this.value = (this.value || 0) - 1;
      this.zaneChange.emit(ev);
    }
  }

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

  private increment(ev) {
    if (this.value === undefined || this.value === null) this.value = 0;
    if (typeof this.value === 'number') {
      this.value = (this.value || 0) + 1;
      this.zaneChange.emit(ev);
    }
  }
  private inputHandler = (ev: Event) => {
    const input = ev.target as HTMLInputElement | null;
    const oldValue = this.value;
    if (input) {
      this.value =
        input.value === '' || input.value === undefined
          ? null
          : JSON.parse(input.value);
    }
    this.zaneInput.emit(ev as KeyboardEvent);
    if (oldValue !== this.value) {
      this.zaneChange.emit(ev as KeyboardEvent);
    }
  };
}
