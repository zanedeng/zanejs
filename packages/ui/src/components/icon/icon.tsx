import { Component, h, Host, Prop, State, Watch } from '@stencil/core';

import { fetchIcon, getSVGHTMLString } from '../../utils';

/**
 * @name Icon
 * @description Icons are visual symbols used to represent ideas, objects, or actions.
 * @overview Icons are visual symbols used to represent ideas, objects, or actions. They communicate messages at a glance, afford interactivity, and draw attention to important information.
 * @category General
 * @example <zane-icon name="home" size="2rem"></zane-icon>
 */
@Component({
  shadow: true,
  styleUrl: 'icon.scss',
  tag: 'zane-icon',
})
export class Icon {
  /**
   * The identifier for the icon.
   * This name corresponds to a specific SVG asset in the icon set.
   */
  @Prop({ reflect: true }) name: string;

  /**
   * The size of the icon.
   * This can be specified in pixels (px) or rem units to control the icon's dimensions.
   * If a number is provided, it will be treated as rem units. For example, '16px', '2rem', or 2 would be valid values.
   */
  @Prop() size: string;

  @State() svg: string;

  async componentWillLoad() {
    this.fetchSvg(this.name);
  }

  async fetchSvg(name: string) {
    if (this.name) {
      const svgXml = await fetchIcon(name);
      this.svg = getSVGHTMLString(svgXml);
    } else {
      this.svg = '';
    }
  }

  @Watch('name')
  async handleNameChange(newValue: string) {
    await this.fetchSvg(newValue);
  }

  render() {
    const style = {};
    if (this.size !== undefined) {
      switch (this.size) {
        case 'lg': {
          style['--zane-icon-size'] = '1.5rem';
          break;
        }
        case 'md': {
          style['--zane-icon-size'] = '1rem';
          break;
        }
        case 'sm': {
          style['--zane-icon-size'] = '0.75rem';
          break;
        }
        case 'xl': {
          style['--zane-icon-size'] = '1.75rem';
          break;
        }
        case 'xs': {
          style['--zane-icon-size'] = '0.5rem';
          break;
        }
        default: {
          if (this.size.endsWith('px') || this.size.endsWith('rem'))
            style['--zane-icon-size'] = this.size;
          else if (!Number.isNaN(Number(this.size))) {
            style['--zane-icon-size'] = `${this.size}rem`;
          }
        }
      }
    }

    return (
      <Host>
        <div class={{ icon: true }} innerHTML={this.svg} style={style}></div>
      </Host>
    );
  }
}
