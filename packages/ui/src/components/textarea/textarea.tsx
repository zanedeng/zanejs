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
 * @name Textarea
 * @description Enables native inputs to be used within a Form field.
 * @category Form Inputs
 * @tags input, form
 * @example <zane-textarea placeholder="Enter some description over here"></zane-textarea>
 */
@Component({
  shadow: true,
  styleUrl: './textarea.scss',
  tag: 'zane-textarea',
})
export class Textarea implements ComponentInterface, InputComponentInterface {
  /**
   * If `true`, a clear icon will appear in the input when there is a value. Clicking it clears the input.
   */
  @Prop() clearable = false;

  @Prop({ mutable: true, reflect: true }) configAria: any = {};

  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `zane:change` event after each keystroke.
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
  @Prop() required: boolean = false;

  /**
   * The input field size.
   * Possible values are: `"sm"`, `"md"`, `"lg"`. Defaults to `"md"`.
   */
  @Prop({ reflect: true }) size: 'lg' | 'md' | 'sm' = 'md';

  @Prop() skeleton: boolean = false;

  /**
   * The input state.
   * Possible values are: `"success"`, `"error"`, `"warning"`, 'default'. Defaults to `"default"`.
   */
  @Prop({ reflect: true }) state: 'default' | 'error' | 'success' | 'warning' =
    'default';

  /**
   * The input field value.
   */
  @Prop({ mutable: true }) value: string;

  @Prop() warn: boolean = false;

  @Prop() warnText: string;

  /**
   * Emitted when the action button is clicked.
   */
  @Event({ eventName: 'zane-textarea--action-click' })
  zaneActionClick: EventEmitter;

  /**
   * Emitted when the input loses focus.
   */
  @Event({ eventName: 'zane-textarea--blur' }) zaneBlur: EventEmitter;

  /**
   * Emitted when the value has changed..
   */
  @Event({ eventName: 'zane-textarea--change' }) zaneChange: EventEmitter;

  /**
   * Emitted when the input has focus.
   */
  @Event({ eventName: 'zane-textarea--focus' }) zaneFocus: EventEmitter;

  /**
   * Emitted when a keyboard input occurred.
   */
  @Event({ eventName: 'zane-textarea--input' }) zaneInput: EventEmitter;

  private nativeElement?: HTMLTextAreaElement;

  private tabindex?: number | string;
  componentWillLoad() {
    // If the ion-input has a tabindex attribute we get the value
    // and pass it down to the native input, then remove it from the
    // ion-input to avoid causing tabbing twice on the same element
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
          readonly: this.readonly,
          textarea: true,
        }}
      >
        <textarea
          class="input input-native"
          disabled={this.disabled}
          name={this.name}
          onBlur={this.blurHandler}
          onFocus={this.focusHandler}
          onInput={this.inputHandler}
          onKeyDown={this.keyDownHandler}
          placeholder={this.placeholder}
          readonly={this.readonly}
          ref={(input) => (this.nativeElement = input)}
          required={this.required}
          rows={4}
          tabindex={this.tabindex}
          value={this.value}
          {...this.configAria}
        />

        <div class={'actions-container'}>
          {this.clearable && this.hasValue() && (
            <zane-button
              class="clear clear-action"
              color={'secondary'}
              icon="close"
              onClick={this.clearInput}
              size={this.size}
              variant="ghost"
            />
          )}
        </div>

        <div class="slot-container end">
          <slot name="end" />
        </div>
      </div>
    );
  }

  /**
   * Sets blur on the native `textarea` in `zane-textarea`. Use this method instead of the global
   * `textarea.blur()`.
   */
  @Method()
  async setBlur() {
    if (this.nativeElement) {
      this.nativeElement.blur();
      this.hasFocus = false;
    }
  }

  /**
   * Sets focus on the native `textarea` in `zane-textarea`. Use this method instead of the global
   * `textarea.focus()`.
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
    if (input) {
      this.value = input.value || '';
    }
    this.zaneInput.emit(ev as KeyboardEvent);
    this.zaneChange.emit(ev as KeyboardEvent);
  };

  private keyDownHandler = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape' && this.clearable) {
      this.clearInput(ev);
    }
  };
}
