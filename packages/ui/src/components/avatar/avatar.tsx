import { Component, Element, h, Host, Prop } from '@stencil/core';

/**
 * @name Avatar
 * @description The Avatar component is used to represent user, and displays the profile picture, initials or fallback icon.
 * @category Data Display
 * @tags display
 * @example <zane-avatar size="5rem" name="Shivaji Varma" src="/assets/img/avatar.webp"></zane-avatar>
 */
@Component({
  shadow: true,
  styleUrl: 'avatar.scss',
  tag: 'zane-avatar',
})
export class Avatar {
  @Element() elm!: HTMLElement;

  @Prop() name: string = '';

  /**
   * Avatar size.
   */
  @Prop() size: string = '2rem';

  @Prop() src: string = '';

  render() {
    const cssCls = ['avatar'];
    if (this.src) {
      cssCls.push('avatar-image');
    } else {
      cssCls.push('avatar-initials');
    }
    return (
      <Host title={this.name}>
        <div class="avatar-container">
          <div
            class={cssCls.join(' ')}
            style={{
              fontSize: this.getFontSize(),
              height: this.size,
              width: this.size,
            }}
          >
            {(() => {
              return this.src ? (
                <img alt={this.name} class="image" src={this.src} />
              ) : (
                <div class="initials">{this.getInitials()}</div>
              );
            })()}
          </div>
        </div>
      </Host>
    );
  }

  private getFontSize() {
    const size = this.size;
    const fontSize = this.size.match(/^\d+(\.\d{1,2})?/)[0];
    return (+fontSize * 4) / 10 + size.replace(/^\d+(\.\d{1,2})?/, '');
  }

  private getInitials() {
    const name = this.name.split(' ');
    const firstName = name[0] ? name[0].charAt(0).toUpperCase() : '';
    const lastName = name[1] ? name[1].charAt(0).toUpperCase() : '';
    return `${firstName}${lastName}`;
  }
}
