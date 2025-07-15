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
 * @name Input URL
 * @description A specialized input field for URL validation.
 * @category Up coming
 * @tags input, form, url
 * @example <zane-input-url value="https://shivajivarma.com"></zane-input-url>
 */
@Component({
  shadow: true,
  styleUrl: 'input-url.scss',
  tag: 'zane-input-url',
})
export class InputUrl implements ComponentInterface, InputComponentInterface {
  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `valueChange` event after each keystroke.
   */
  @Prop() debounce = 300;

  /**
   * If true, the user cannot interact with the input. Defaults to `false`.
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  @Prop({ mutable: true, reflect: true }) editing: boolean = false;

  @Element() elm!: HTMLElement;

  @State() endSlotHasContent = false;

  gid: string = getComponentIndex();

  @State() hasFocus = false;

  /**
   * Emitted when the URL input is invalid.
   */
  @Event() inputInvalid: EventEmitter<boolean>;

  @State() isValid = true;

  /**
   * The input field name.
   */
  @Prop() name: string = `zane-input-url-${this.gid}`;

  /**
   * The input field placeholder.
   */
  @Prop() placeholder: string;
  /**
   * The input field size.
   * Possible values are: `"sm"`, `"md"`, `"lg"`. Defaults to `"md"`.
   */
  @Prop({ reflect: true }) size: 'lg' | 'md' | 'sm' = 'md';

  @State() startSlotHasContent = false;
  /**
   * The input field value.
   */
  @Prop({ mutable: true }) value: string;
  /**
   * Emitted when a keyboard input occurred.
   */
  @Event() valueChange: EventEmitter<string>;
  private nativeElement?: HTMLInputElement;

  componentDidLoad() {
    this.startSlotHasContent =
      this.elm.querySelector('[slot="start"]') !== null;
    this.endSlotHasContent = this.elm.querySelector('[slot="end"]') !== null;
  }

  componentWillLoad() {
    this.debounceChanged();
  }

  /**
   * Get the component's unique ID
   */
  @Method()
  async getComponentId() {
    return this.gid;
  }

  render() {
    return (
      <Host has-focus={this.hasFocus} invalid={!this.isValid}>
        <div class="form-control">
          <div class="field">{this.renderInput()}</div>
          {this.renderHelper()}
        </div>
      </Host>
    );
  }

  renderHelper() {
    if (!this.isValid) {
      return <div class="helper invalid">Please enter a valid URL</div>;
    }
    return null;
  }

  renderInput() {
    return (
      <div class={{ editing: this.editing, 'url-input': true }}>
        <div class={{ 'url-container': true }}>
          <zane-link href={this.value} target="_blank">
            {this.value}
          </zane-link>
          <zane-button
            icon="edit"
            onZane-button--click={() => {
              this.#startEditing();
            }}
            size="sm"
            variant="ghost"
          ></zane-button>
        </div>

        <div
          class={{
            disabled: this.disabled,
            'end-slot-has-content': this.endSlotHasContent,
            'has-focus': this.hasFocus,
            'input-container': true,
            invalid: !this.isValid,
            'start-slot-has-content': this.startSlotHasContent,
          }}
        >
          <input
            class="input input-native"
            disabled={this.disabled}
            name={this.name}
            onBlur={this.blurHandler}
            onFocus={this.focusHandler}
            onInput={(evt) => this.inputHandler(evt)}
            placeholder={this.placeholder}
            ref={(input) => (this.nativeElement = input)}
            type="url"
            value={this.value}
          />
        </div>
      </div>
    );
  }

  /**
   * Sets blur on the native `input`. Use this method instead of the global
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
   * Sets focus on the native `input`. Use this method instead of the global
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
    this.valueChange = debounceEvent(this.valueChange, this.debounce);
  }

  #closeEditing() {
    this.isValid = this.validateUrl(this.value);
    this.inputInvalid.emit(!this.isValid);

    if (this.isValid) this.editing = false;
  }

  #startEditing() {
    this.editing = true;
    setTimeout(() => this.setFocus(), 80);
  }

  private blurHandler = () => {
    this.hasFocus = false;

    // Validate on blur for better user experience
    this.#closeEditing();
  };

  private focusHandler = () => {
    this.hasFocus = true;
  };

  private inputHandler = (ev: Event) => {
    const input = ev.target as HTMLInputElement | null;
    const oldValue = this.value;

    if (input) {
      this.value = input.value;
    }

    if (oldValue !== this.value) {
      this.valueChange.emit(this.value);
    }
  };

  /**
   * Validate if the given string is a valid URL
   */
  private validateUrl(url: string): boolean {
    if (!url) return true; // Empty value is considered valid (not invalid)

    try {
      // Use built-in URL constructor for validation
      // eslint-disable-next-line no-new
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
