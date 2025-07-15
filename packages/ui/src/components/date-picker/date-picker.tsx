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
 * @name Date Picker
 * @category Form Inputs
 * @description Captures date input.
 * @example <zane-date-picker value='true'></zane-date-picker>
 */
@Component({
  shadow: true,
  styleUrl: 'date-picker.scss',
  tag: 'zane-date-picker',
})
export class DatePicker implements ComponentInterface {
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
  @Prop({ reflect: true }) required: boolean = false;

  /**
   * The input field size.
   * Possible values are: `"sm"`, `"md"`, `"lg"`. Defaults to `"md"`.
   */
  @Prop({ reflect: true }) size: 'lg' | 'md' | 'sm' = 'md';

  /**
   * The input field value.
   */
  @Prop({ mutable: true }) value?: null | number | string = '';

  @Prop() warn: boolean = false;

  @Prop() warnText: string;

  /**
   * Emitted when the input loses focus.
   */
  @Event({ eventName: 'zane-date-picker--blur' }) zaneBlur: EventEmitter;

  /**
   * Emitted when the value has changed.
   */
  @Event({ eventName: 'zane-date-picker--change' }) zaneChange: EventEmitter;

  /**
   * Emitted when the input has focus.
   */
  @Event({ eventName: 'zane-date-picker--focus' }) zaneFocus: EventEmitter;
  /**
   * Emitted when a keyboard input occurred.
   */
  @Event({ eventName: 'zane-date-picker--input' }) zaneInput: EventEmitter;
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

  connectedCallback() {
    this.debounceChanged();
  }

  @Method()
  async getComponentId() {
    return this.gid;
  }

  render() {
    return (
      <Host has-focus={this.hasFocus} has-value={this.hasValue()}>
        <div class={{ 'form-control': true, inline: this.inline }}>
          {this.label && (
            <label class="label">
              {this.required && <span class="required">*</span>}
              {this.label}
            </label>
          )}

          <div class="field">
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
                readonly={this.readonly}
                ref={(input) => (this.nativeElement = input)}
                required={this.required}
                tabindex={this.tabindex}
                type="date"
              />

              <zane-button
                class="input-action"
                color={'secondary'}
                disabled={this.disabled}
                icon={'calendar'}
                onZane-button--click={() => {
                  setTimeout(() => {
                    this.nativeElement.showPicker();
                  });
                }}
                size={this.size}
                variant="ghost.simple"
              ></zane-button>
            </div>
            {this.renderHelper()}
          </div>
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
