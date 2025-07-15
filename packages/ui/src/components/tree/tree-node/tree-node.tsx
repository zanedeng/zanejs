import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State,
} from '@stencil/core';

import { getComponentIndex } from '../../../utils';

/**
 * @name TreeNode
 * @description A tree node is a hierarchical structure that provides nested levels of navigation.
 * @category Navigation
 * @subcategory Tree View
 * @childComponent true
 * @img /assets/img/tree-view.webp
 * @imgDark /assets/img/tree-view-dark.webp
 */
@Component({
  shadow: true,
  styleUrl: 'tree-node.scss',
  tag: 'zane-tree-node',
})
export class TreeNode {
  /**
   * If true, the user cannot interact with the button. Defaults to `false`.
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  @Element() elm!: HTMLElement;

  @Prop({ mutable: true, reflect: true }) expanded: boolean = true;

  gid: string = getComponentIndex();

  @State() hasChildNodes = false;

  @State() hasFocus = false;

  /**
   * Hyperlink to navigate to on click.
   */
  @Prop({ reflect: true }) href: string;

  /**
   * Icon which will displayed on button.
   * Possible values are icon names.
   */
  @Prop() icon: string;

  @State() isActive = false;

  @Prop({ mutable: true }) label: string = '';

  @Prop({ reflect: true }) level: number = 0;

  /**
   * Menu item selection state.
   */
  @Prop({ mutable: true, reflect: true }) selectedNode: string;

  /**
   * Sets or retrieves the window or frame at which to target content.
   */
  @Prop() target: string = '_self';

  /**
   * The menu item value.
   */
  @Prop({ mutable: true }) value?: null | number | string;

  /**
   * Emitted when the menu item is clicked.
   */
  @Event({ eventName: 'zane-tree-node--click' })
  zaneTreeNodeClick: EventEmitter;

  private nativeElement?: HTMLElement;

  private tabindex?: number | string = 1;

  componentWillLoad() {
    // If the ion-input has a tabindex attribute we get the value
    // and pass it down to the native input, then remove it from the
    // zane-input to avoid causing tabbing twice on the same element
    if (this.elm.hasAttribute('tabindex')) {
      const tabindex = this.elm.getAttribute('tabindex');
      this.tabindex = tabindex === null ? undefined : tabindex;
      this.elm.removeAttribute('tabindex');
    }

    const treeView = this.elm.closest('zane-tree-view');

    (treeView as any).getSelectedNode().then((selectedNode: string) => {
      this.selectedNode = selectedNode;
    });

    (treeView as any).subscribeToSelect((selectedNode: string) => {
      this.selectedNode = selectedNode;
    });

    const childNodes = this.elm.querySelectorAll('zane-tree-node');
    this.hasChildNodes = childNodes.length > 0;
    childNodes.forEach((node: any) => {
      node.level = this.level + 1;
    });
  }

  handleClick = () => {
    this.zaneTreeNodeClick.emit({
      expand: this.expanded,
      id: this.gid,
      value: this.value || this.label,
    });
  };
  isSelected() {
    if (this.value === undefined && this.label === undefined) return false;
    else if (this.value === undefined) return this.selectedNode === this.label;
    else return this.selectedNode === this.value;
  }
  render = () => {
    const NativeElementTag = this.#getNativeElementTagName();
    const styles = {
      paddingInlineStart: `calc(${this.level + 1}rem - 0.125rem)`,
    };

    return (
      <Host active={this.isActive} has-focus={this.hasFocus}>
        <div class="tree-node">
          <NativeElementTag
            aria-disabled={this.disabled}
            class={{
              active: this.isActive,
              disabled: this.disabled,
              'has-focus': this.hasFocus,
              selected: this.isSelected(),
              'tree-node-content': true,
            }}
            href={this.href}
            onBlur={this.blurHandler}
            onClick={this.clickHandler}
            onFocus={this.focusHandler}
            onKeyDown={this.keyDownHandler}
            onMouseDown={this.mouseDownHandler}
            ref={(el) => (this.nativeElement = el as HTMLElement)}
            style={styles}
            tabindex={this.tabindex}
            target={this.target}
          >
            {this.hasChildNodes && (
              <zane-icon
                class={{ 'expand-icon': true, expanded: this.expanded }}
                name="caret--right"
                size="1rem"
              />
            )}

            {!this.hasChildNodes && <div class="icon-space" />}

            {this.icon && (
              <zane-icon class={'icon'} name={this.icon} size="1rem" />
            )}

            <span class="tree-node-label">{this.label}</span>
          </NativeElementTag>

          <div
            class={{
              expanded: this.expanded,
              'node-slot': true,
            }}
          >
            <slot></slot>
          </div>
        </div>
      </Host>
    );
  };

  /**
   * Sets blur on the native `input` in `zane-input`. Use this method instead of the global
   * `input.blur()`.
   */
  @Method()
  async setBlur() {
    if (this.nativeElement) {
      this.nativeElement.blur();
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
    }
  }

  @Listen('keyup', { target: 'window' })
  windowKeyUp(evt) {
    if (this.isActive && evt.key === ' ') this.isActive = false;
  }

  @Listen('mouseup', { target: 'window' })
  windowMouseUp() {
    if (this.isActive) this.isActive = false;
  }

  #getNativeElementTagName() {
    return this.href ? 'a' : 'div';
  }

  private blurHandler = () => {
    this.hasFocus = false;
  };

  private clickHandler = (event) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.expanded = !this.expanded;
      this.handleClick();
    }
  };

  private focusHandler = () => {
    this.hasFocus = true;
  };

  private keyDownHandler = (evt) => {
    switch (evt.key) {
      case ' ':
      case 'Enter': {
        if (this.hasChildNodes) {
          evt.preventDefault();
          this.clickHandler(evt);
        } else if (this.href) {
          evt.preventDefault();
          this.isActive = true;
          this.handleClick();
          window.open(this.href, this.target);
        } else {
          evt.preventDefault();
          this.isActive = true;
          this.handleClick();
        }

        break;
      }
      case 'ArrowLeft': {
        evt.preventDefault();
        this.expanded = false;

        break;
      }
      case 'ArrowRight': {
        evt.preventDefault();
        if (this.expanded && this.hasChildNodes) {
          const childNodes = this.elm.querySelectorAll('zane-tree-node');
          if (childNodes.length > 0) {
            const firstChild = childNodes[0] as any;
            firstChild.setFocus();
          }
        } else {
          this.expanded = true;
        }

        break;
      }
      // No default
    }
  };

  private mouseDownHandler = () => {
    this.isActive = true;
  };
}
