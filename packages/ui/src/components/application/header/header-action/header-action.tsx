import { Component, Element, h, Method, Prop, State } from '@stencil/core';

@Component({
  shadow: true,
  styleUrl: 'header-action.scss',
  tag: 'zane-header-action',
})
export class HeaderAction {
  @Prop() badge: string = '_self';

  @State() color: any;

  @Prop({ mutable: true, reflect: true }) configAria: any = {};

  @Element() elm!: HTMLElement;

  /**
   * Hyperlink to navigate to on click.
   */
  @Prop({ reflect: true }) href: string;

  /**
   * Icon which will displayed on button.
   * Possible values are icon names.
   */
  @Prop() icon: string;

  /**
   * Button selection state.
   */
  @Prop() selected: boolean = false;

  /**
   * Button size.
   * Possible values are `"sm"`, `"md"`, `"lg"`, `"xl"`, `"xxl"`, `"none"`. Defaults to `"md"`.
   */
  @Prop() size: 'lg' | 'md' | 'none' | 'sm' | 'xl' | 'xxl' = 'md';

  @State() slotHasContent = false;

  /**
   * Sets or retrieves the window or frame at which to target content.
   */
  @Prop() target: string = '_self';

  componentWillLoad() {
    this.slotHasContent = this.elm.hasChildNodes();
    if (this.elm.getAttributeNames)
      this.elm.getAttributeNames().forEach((name: string) => {
        if (name.includes('aria-')) {
          this.configAria[name] = this.elm.getAttribute(name);
          this.elm.removeAttribute(name);
        }
      });
  }

  render() {
    return (
      <zane-button
        class="header-action"
        color={this.color}
        configAria={this.configAria}
        href={this.href}
        icon={this.icon}
        selected={this.selected}
        target={this.target}
        variant={'default.simple'}
      >
        {this.slotHasContent && <slot></slot>}
      </zane-button>
    );
  }

  /*
   * @internal
   */
  @Method()
  async setColor(color: string) {
    this.color = color;
  }
}
