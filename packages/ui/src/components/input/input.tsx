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
 * @name Input
 * @description Enables native inputs to be used within a Form field.
 * @category Form Inputs
 * @tags input, form
 * @example <zane-input placeholder="Enter your name"></zane-input>
 */
@Component({
  shadow: true,
  styleUrl: './input.scss',
  tag: 'zane-input',
})
export class Input implements ComponentInterface, InputComponentInterface {
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
   * The type of control to display.
   * Possible values are: `"text"`, `"password"`, `"email"`, `"tel"`. Defaults to `"text"`.
   */
  @Prop() type: 'email' | 'password' | 'tel' | 'text' = 'text';

  /**
   * The input field value.
   */
  @Prop({ mutable: true }) value: string;

  @Prop() warn: boolean = false;

  @Prop() warnText: string;
  /**
   * Emitted when the input loses focus.
   */
  @Event({ eventName: 'zane-input--blur' }) zaneBlur: EventEmitter;
  /**
   * Emitted when the value has changed.
   */
  @Event({ eventName: 'zane-input--change' }) zaneChange: EventEmitter;

  /**
   * Emitted when the input has focus.
   */
  @Event({ eventName: 'zane-input--focus' }) zaneFocus: EventEmitter;
  /**
   * Emitted when a keyboard input occurred.
   */
  @Event({ eventName: 'zane-input--input' }) zaneInput: EventEmitter;
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
              <div class="input-container-skeleton skeleton" />
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
    const type =
      this.type === 'password' && this.passwordVisible ? 'text' : this.type;

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
          onInput={(evt) => this.inputHandler(evt)}
          placeholder={this.placeholder}
          readOnly={this.readonly}
          ref={(input) => (this.nativeElement = input)}
          required={this.required}
          tabIndex={this.tabindex}
          type={type}
          value={this.value}
          {...this.configAria}
        />

        {this.type === 'password' && (
          <zane-tooltip
            content={this.passwordVisible ? 'Show password' : 'Hide password'}
          >
            <zane-button
              color={'secondary'}
              icon={this.passwordVisible ? 'view--off' : 'view'}
              onGoat-button--click={() => {
                this.passwordVisible = !this.passwordVisible;
              }}
              size={this.size}
              variant="ghost.simple"
            ></zane-button>
          </zane-tooltip>
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
}
