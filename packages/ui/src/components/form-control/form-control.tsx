import {
  Component,
  ComponentInterface,
  Element,
  h,
  Host,
  Prop,
} from '@stencil/core';

/**
 * @name Form Control
 * @description The Form Control component adds a label and caption for its child control.
 * @category Form Inputs
 * @tags form
 * @example <zane-form-control label='Full Name' required>
 *   <zane-input type='text'></zane-input>
 * </zane-form-control>
 */
@Component({
  shadow: true,
  styleUrl: 'form-control.scss',
  tag: 'zane-form-control',
})
export class FormControl implements ComponentInterface {
  @Element() elm!: HTMLElement;

  @Prop() helperText: string;

  @Prop({ reflect: true }) inline: boolean = false;

  @Prop() invalid: boolean = false;

  @Prop() invalidText: string;

  @Prop() label: string;

  /**
   * Whether the form control is required.
   */
  @Prop() required: boolean = false;

  @Prop() skeleton: boolean = false;

  @Prop() warn: boolean = false;

  @Prop() warnText: string;

  componentDidLoad() {
    this.elm.setAttribute('role', 'group');
    const controlElm = this.getInputElement();
    this.passRequiredToField(controlElm, this.required);
    this.passLabelToField(controlElm, this.label);
  }

  componentShouldUpdate(newVal: any, _oldVal, propName: string) {
    if (propName === 'required') {
      this.passRequiredToField(this.getInputElement(), newVal);
    } else if (propName === 'label') {
      this.passLabelToField(this.getInputElement(), newVal);
    }
  }

  getInputElement() {
    for (const compName of [
      'zane-input',
      'zane-textarea',
      'zane-select',
      'zane-checkbox',
      'zane-radio',
      'zane-code-editor',
    ]) {
      const controlElm = this.elm.querySelector(`${compName}`);
      if (controlElm) return controlElm;
    }
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

  passLabelToField(controlElm: Element, label: string) {
    if (controlElm) {
      const el = controlElm as any;
      const oldProps = el.configAria;
      el.configAria = {
        'aria-label': label,
        ...oldProps,
      };
    }
  }

  passRequiredToField(controlElm: Element, required: boolean) {
    if (controlElm) {
      const el = controlElm as any;
      el.required = required;
    }
  }

  render() {
    return (
      <Host invalid={this.invalid} warn={this.warn}>
        <div class={{ 'form-control': true, inline: this.inline }}>
          {this.label && this.getLabel()}
          <div class="field">
            <slot />
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
}
