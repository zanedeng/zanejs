import { Component, h, Host, Prop, State, Watch } from '@stencil/core';

import { convertToDomSVG, fetchSVG } from '../../utils';

/**
 * @name SVG
 * @description Render SVG content from an external source.
 * @category Data Display
 * @example <zane-svg src="https://icons.getbootstrap.com/assets/icons/bug.svg" size="2rem"></zane-svg>
 */
@Component({
  shadow: true,
  styleUrl: 'svg.scss',
  tag: 'zane-svg',
})
export class Svg {
  /**
   * The Icon size.
   */
  @Prop({ reflect: true }) size: string;

  @Prop() src: string = '';

  @State() svg: string = '';

  async componentWillLoad() {
    this.svg = await fetchSVG(this.src);
  }

  @Watch('src')
  async handleNameChange(newValue: string) {
    this.svg = await fetchSVG(newValue);
  }

  render() {
    const svg = convertToDomSVG(this.svg);
    let svgHtmlString = 'No icon found';
    if (svg.tagName === 'svg') {
      if (this.getSize()) {
        svg.setAttribute('width', this.getSize());
        svg.setAttribute('height', this.getSize());
      }
      svg.setAttribute('fill', 'currentColor');
      svgHtmlString = svg.outerHTML;
    }

    return (
      <Host>
        <div class={{ icon: true }} innerHTML={svgHtmlString} />
      </Host>
    );
  }

  private getSize() {
    let size;
    switch (this.size) {
      case 'lg': {
        size = '1.5rem';
        break;
      }
      case 'md': {
        size = '1rem';
        break;
      }
      case 'sm': {
        size = '0.75rem';
        break;
      }
      case 'xl': {
        size = '1.75rem';
        break;
      }
      case 'xs': {
        size = '0.5rem';
        break;
      }
      default: {
        size = this.size;
      }
    }
    return size;
  }
}
