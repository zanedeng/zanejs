import {
  Component,
  ComponentInterface,
  Element,
  h,
  Host,
  Prop,
} from '@stencil/core';

/**
 * @name Text
 * @description Typography are used for rendering headlines, paragraphs and captions.
 * @category General
 * @example <zane-text type="heading" level="1">Heading</zane-typography>
 */
@Component({
  shadow: true,
  styleUrl: 'text.scss',
  tag: 'zane-text',
})
export class Text implements ComponentInterface {
  @Prop({ reflect: true }) color:
    | 'error'
    | 'helper'
    | 'inverse'
    | 'on-color'
    | 'primary'
    | 'secondary'
    | 'tertiary' = 'primary';

  @Prop({ mutable: true, reflect: true }) configAria: any = {};

  @Element() elm!: HTMLElement;

  @Prop({ reflect: true }) expressive: boolean = false;

  @Prop({ reflect: true }) headingLevel: 1 | 2 | 3 | 4 | 5 | 6;

  @Prop({ reflect: true }) headingSize: 1 | 2 | 3 | 4 | 5 | 6 | 7;

  @Prop({ reflect: true }) inline: boolean = false;

  @Prop({ reflect: true }) type:
    | 'body'
    | 'body-compact'
    | 'code'
    | 'fluid-heading'
    | 'heading'
    | 'heading-compact'
    | 'helper-text'
    | 'label'
    | 'legal' = 'body';

  componentWillLoad() {
    // If the zane-text has a tabindex attribute we get the value
    // and pass it down to the native input, then remove it from the
    // zane-text to avoid causing tabbing twice on the same element
    this.elm.getAttributeNames().forEach((name: string) => {
      if (name.includes('aria-')) {
        this.configAria[name] = this.elm.getAttribute(name);
        this.elm.removeAttribute(name);
      }
    });
  }

  render() {
    return (
      <Host>
        <div
          class={{
            [`heading-size-${this.#getHeadingSize()}`]: true,
            expressive: this.expressive,
            inline: this.inline,
            text: true,
          }}
        >
          {this.renderText()}
        </div>
      </Host>
    );
  }

  renderHeading() {
    let headingLevel = this.headingLevel;
    if (!headingLevel) {
      switch (this.#getHeadingSize()) {
        case 2: {
          headingLevel = 5;
          break;
        }
        case 3: {
          headingLevel = 4;
          break;
        }
        case 4: {
          headingLevel = 3;
          break;
        }
        case 5: {
          headingLevel = 2;
          break;
        }
        case 6:
        case 7: {
          headingLevel = 1;
          break;
        }
        default: {
          headingLevel = 6;
        }
      }
    }

    const Heading = `h${headingLevel}`;
    return (
      <Heading class="native-element" {...this.configAria}>
        <slot />
      </Heading>
    );
  }

  renderSimpleText() {
    return this.inline ? (
      <span class="native-element" {...this.configAria}>
        <slot />
      </span>
    ) : (
      <p class="native-element" {...this.configAria}>
        <slot />
      </p>
    );
  }

  renderText() {
    return this.type === 'heading'
      ? this.renderHeading()
      : this.renderSimpleText();
  }

  #getHeadingSize() {
    let headingSize = this.headingSize;
    if (!headingSize) {
      headingSize = this.type === 'fluid-heading' ? 6 : 7;
    }
    return headingSize;
  }
}
