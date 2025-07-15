import type { InputComponentInterface } from '../../interfaces';

import { computePosition, flip, offset, size } from '@floating-ui/dom';
import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';
import { throttle } from 'lodash';

import { debounceEvent, getComponentIndex, remToPx } from '../../utils';

/**
 * @name Select
 * @description Allows the user to select one or more options using a dropdown.
 * @category Form Inputs
 * @tags input, form
 * @img /assets/img/select.webp
 * @imgDark /assets/img/select-dark.webp
 */
@Component({
  shadow: true,
  styleUrl: 'select.scss',
  tag: 'zane-select',
})
export class Select implements ComponentInterface, InputComponentInterface {
  @Element() elm!: HTMLElement;

  @Prop() placements: string = 'bottom-start,top-start,bottom-end,top-end';

  _fixPosition = throttle(
    (callBack) => {
      const positions = this.placements.split(',');
      const placement: any = positions[0];
      const fallbackPlacements: any = positions.splice(1);
      const dropdownContent: any =
        this.elm.shadowRoot.querySelector('.dropdown-content');
      const menuElm: any = this.getMenuElement();

      computePosition(
        this.elm.shadowRoot.querySelector('.input-container'),
        dropdownContent,
        {
          // Try removing the middleware. The dropdown will
          // overflow the boundary's edge and get clipped!
          middleware: [
            offset(10),
            size({
              apply({ availableHeight }) {
                if (availableHeight < remToPx(10)) return;
                menuElm?.style.setProperty(
                  '--zane-menu-max-height',
                  `${availableHeight}px`,
                );
              },
              padding: 5,
            }),
            flip({
              fallbackPlacements,
            }),
          ],
          placement,
        },
      ).then(({ x, y }) => {
        Object.assign(dropdownContent.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
        if (callBack) callBack();
      });
    },
    80,
    {
      leading: true,
      trailing: false,
    },
  );

  /**
   * If `true`, a clear icon will appear in the input when there is a value. Clicking it clears the input.
   */
  @Prop() clearable: boolean = false;

  @Prop({ mutable: true, reflect: true }) configAria: any = {};

  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `zaneChange` event after each keystroke.
   */
  @Prop() debounce = 300;

  /**
   * If true, the user cannot interact with the button. Defaults to `false`.
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  @State() endSlotHasContent = false;

  gid: string = getComponentIndex();

  @State() hasFocus = false;

  @Prop() helperText: string;

  @Prop() hideDropdownIcon: boolean = false;

  index = 0;

  @Prop({ reflect: true }) inline: boolean = false;

  @Prop() invalid: boolean = false;

  @Prop() invalidText: string;

  /**
   *  [{
   *    label: 'Zane Deng',
   *    value: 'zane-deng',
   *    icon: 'person'
   *  }]
   */
  @Prop() items: {
    icon?: string;
    label: number | string;
    value: number | string;
  }[] = [];

  @Prop() label: string;

  @Prop({ reflect: true }) layer?: '01' | '02' | 'background';

  @Prop() multiple: boolean = false;

  /**
   * The input field name.
   */
  @Prop() name: string = `zane-input-${this.gid}`;

  @Prop({ mutable: true, reflect: true }) open: boolean = false;

  /**
   * The input field placeholder.
   */
  @Prop() placeholder: string;

  @State() position: string;

  /**
   * If true, the user cannot interact with the button. Defaults to `false`.
   */
  @Prop({ reflect: true }) readonly: boolean = false;

  /**
   * If true, required icon is show. Defaults to `false`.
   */
  @Prop({ reflect: true }) required: boolean = false;

  /**
   * Search type
   * Possible values are `"none"`, `"initial"`, `"contains"`, `"managed"`. Defaults to `"none"`.
   */
  @Prop() search: 'contains' | 'initial' | 'managed' | 'none' = 'none';

  @State() searchString: string = '';

  @Prop() showLoader: boolean = false;

  /**
   * The select input size.
   * Possible values are: `"sm"`, `"md"`, `"lg"`. Defaults to `"md"`.
   */
  @Prop({ reflect: true }) size: 'lg' | 'md' | 'sm' = 'md';

  @State() startSlotHasContent = false;

  /**
   * The input state.
   * Possible values are: `"success"`, `"error"`, `"warning"`, 'default'. Defaults to `"default"`.
   */
  @Prop({ reflect: true }) state: 'default' | 'error' | 'success' | 'warning' =
    'default';

  /**
   * The input field value.
   */
  @Prop({ mutable: true }) value?: number | string = '';

  @Prop() warn: boolean = false;

  @Prop() warnText: string;

  /**
   * Emitted when the value has changed.
   */
  @Event({ eventName: 'zane-select--change' }) zaneChange: EventEmitter;

  /**
   * Emitted when a keyboard input occurred.
   */
  @Event({ eventName: 'zane-select--search' }) zaneSearch: EventEmitter;

  @Event({ eventName: 'zane-select--enter' })
  zaneSearchEnter: EventEmitter;
  private displayElement?: HTMLElement;
  private menuElm?: HTMLZaneMenuElement;
  private nativeElement?: HTMLInputElement;

  componentDidUpdate() {
    if (this.open) this._fixPosition();
  }

  componentWillLoad() {
    if (this.elm.getAttributeNames)
      this.elm.getAttributeNames().forEach((name: string) => {
        if (name.includes('aria-')) {
          this.configAria[name] = this.elm.getAttribute(name);
          this.elm.removeAttribute(name);
        }
      });
    this.startSlotHasContent = !!this.elm.querySelector('[slot="start"]');
    this.endSlotHasContent = !!this.elm.querySelector('[slot="end"]');
  }
  connectedCallback() {
    this.debounceChanged();
  }
  @Listen('scroll', { target: 'window' })
  fixPosition() {
    if (this.open) {
      this._fixPosition();
    }
  }
  @Method()
  async getComponentId() {
    return this.gid;
  }

  @Listen('zane-menu-item--click')
  menuItemClick(evt: CustomEvent<any>) {
    this.selectHandler(evt.detail.value);
  }

  @Method()
  async openSelectList(): Promise<void> {
    this.openList();
  }

  render() {
    return (
      <Host
        has-focus={this.hasFocus}
        has-value={this.hasValue()}
        position={this.position}
      >
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
                [`search-${this.search}`]: true,
                dropdown: true,
                multiple: this.multiple,
                open: this.open,
                select: true,
                [this.position]: true,
              }}
            >
              <div
                class={{
                  disabled: this.disabled,
                  'end-slot-has-content': this.endSlotHasContent,
                  'has-focus': this.hasFocus,
                  'has-value': this.hasValue(),
                  'input-container': true,
                  readonly: this.readonly,
                  'start-slot-has-content': this.startSlotHasContent,
                }}
              >
                <div class="slot-container start">
                  <slot name="start" />
                </div>

                <div
                  class="value-container"
                  on-click={(evt) => {
                    if (evt.target.classList.contains('multi-select-values')) {
                      this.toggleList();
                    }
                  }}
                >
                  {this.renderMultiSelectValues()}

                  {(() => {
                    return this.search !== 'none' && this.open ? (
                      <input
                        class="input input-native"
                        name={this.name}
                        onBlur={this.blurHandler}
                        onFocus={this.focusHandler}
                        onInput={this.onInput}
                        onKeyDown={this.keyDownHandler}
                        placeholder={this.placeholder}
                        ref={(input) => (this.nativeElement = input)}
                        type="text"
                        value={this.searchString}
                        {...this.configAria}
                      />
                    ) : (
                      <div
                        aria-disabled={this.disabled ? 'true' : null}
                        class="input display-value"
                        onBlur={this.blurHandler}
                        onClick={this.toggleList}
                        onFocus={this.focusHandler}
                        onKeyDown={this.keyDownHandler}
                        ref={(input) => (this.displayElement = input)}
                        tabindex="0"
                        {...this.configAria}
                      >
                        {this.getDisplayValue()}
                      </div>
                    );
                  })()}
                </div>

                {this.clearable && !this.multiple && this.hasValue() && (
                  <zane-button
                    class="clear clear-action"
                    color={'secondary'}
                    icon="close"
                    onClick={this.clearInput}
                    size={'xs'}
                    variant="ghost.simple"
                  />
                )}

                <div class="slot-container end">
                  <slot name="end" />
                </div>

                {this.getModeIcon()}
              </div>
              <div class="dropdown-content">
                {this.open && this.renderDropdownList()}
              </div>
            </div>
          </div>
        </div>
      </Host>
    );
  }

  renderMultiSelectValues() {
    const values = this.getValues();
    if (this.multiple && values.length > 0) {
      // eslint-disable-next-line array-callback-return
      return values.map((value) => {
        const item = this.getItemByValue(value);
        if (item) {
          return (
            <zane-tag
              class="multi-select-value"
              dismissible={!this.disabled && !this.readonly}
              size="sm"
              value={item.value?.toString()}
            >
              {item.label}
            </zane-tag>
          );
        }
      });
    }
  }

  @Listen('resize', { target: 'window' })
  resizeHandler() {
    this.fixPosition();
  }

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
   * Sets focus on the native `input` in `ion-input`. Use this method instead of the global
   * `input.focus()`.t
   */
  @Method()
  async setFocus(): Promise<void> {
    if (!this.open && this.displayElement) {
      this.displayElement.focus();
    } else if (this.open && this.nativeElement) {
      this.nativeElement.focus();
    }
  }

  @Listen('zane-tag--dismiss')
  tagDismissClick(evt: CustomEvent<any>) {
    this.removeItem(evt.detail.value);
  }

  @Listen('click', { target: 'window' })
  windowClick(evt) {
    if (this.open === false) return;
    const path = evt.path || evt.composedPath();
    for (const elm of path) {
      if (elm === this.elm) return;
    }
    this.open = false;
  }

  @Watch('debounce')
  protected debounceChanged() {
    this.zaneSearch = debounceEvent(this.zaneSearch, this.debounce);
  }

  private addItem(selectItemValue) {
    let value = this.getValues();
    if (!value.includes(selectItemValue)) {
      if (!this.multiple) value = [];
      value.push(selectItemValue);
      this.value = value.join(',');
      this.zaneChange.emit({
        newItem: this.getItemByValue(selectItemValue),
        value: this.value,
      });
    }
  }

  private blurHandler = () => {
    this.hasFocus = false;
  };

  private clearInput = () => {
    if (!this.disabled && !this.readonly) {
      this.removeItem(this.value);
    }
  };

  private closeList = () => {
    if (!this.disabled && !this.readonly && this.open) {
      this.open = false;
      setTimeout(() => this.setFocus(), 80);
    }
  };

  private containsValue(value: number | string) {
    const values = this.getValues();
    return values.includes(value?.toString());
  }

  private filterItems() {
    if (this.search === 'managed') return this.items;
    return this.items.filter((item) => {
      return (
        !this.searchString ||
        item.label
          .toString()
          .toLocaleLowerCase()
          .includes(this.searchString.toLocaleLowerCase())
      );
    });
  }

  private focusHandler = () => {
    this.hasFocus = true;
  };

  private getDisplayValue() {
    if (this.multiple) {
      return !this.disabled && !this.readonly ? (
        this.placeholder
      ) : (
        <span>&nbsp;</span>
      );
    } else {
      if (this.items) {
        const item = this.getItemByValue(this.value);
        if (item) {
          return (
            <div class="display-value-container">
              {item.icon && <zane-icon name={item.icon} size="sm" />}
              <span class="item-label">{item.label}</span>
            </div>
          );
        }
      }
      return !this.disabled && !this.readonly ? (
        this.placeholder
      ) : (
        <span>&nbsp;</span>
      );
    }
  }

  private getItemByValue(value) {
    if (this.items) {
      return this.items.find((item) => {
        return item.value === value;
      });
    }
  }

  private getMenuElement() {
    return this.elm.querySelector('zane-menu');
  }

  private getModeIcon() {
    if (this.showLoader) {
      return <zane-spinner class="loader" />;
    }
    if (!this.disabled && !this.readonly && !this.hideDropdownIcon)
      return (
        <zane-icon
          class="toggle-icon chevron-down color-secondary"
          name="chevron--down"
          onClick={this.toggleList}
          size={this.size}
          tabindex={-1}
        ></zane-icon>
      );
  }

  private getValues() {
    return this.value ? this.value.toString().split(',') : [];
  }

  private hasValue(): boolean {
    return (this.value || '').toString().length > 0;
  }

  private keyDownHandler = (evt) => {
    switch (evt.key) {
      case 'ArrowDown': {
        if (this.open) {
          evt.preventDefault();
          this.menuElm.setFocus();
        }

        break;
      }
      case 'ArrowUp': {
        if (this.open) {
          evt.preventDefault();
          this.menuElm.setFocus(); // focus on previous item
        }

        break;
      }
      case 'Enter': {
        evt.preventDefault();
        this.toggleList();
        this.zaneSearchEnter.emit({
          currentItems: this.filterItems(),
          value: this.searchString,
        });

        break;
      }
      // No default
    }
  };

  private onInput = (ev: Event) => {
    const input = ev.target as HTMLInputElement;
    this.searchString = input.value || '';
    this.zaneSearch.emit({
      value: this.searchString,
    });
  };

  private openList = () => {
    if (!this.disabled && !this.readonly && !this.open) {
      this.open = true;
      this.hasFocus = false;
      if (this.search !== 'none') {
        this.searchString = '';
      }

      setTimeout(() => {
        if (this.search !== 'none' && this.open) {
          this.nativeElement.focus();
        }
      }, 300);
    }
  };

  private removeItem(selectItemValue) {
    let value = this.getValues();
    if (value.includes(selectItemValue)) {
      value = value.filter((item) => item !== selectItemValue);
      this.value = value.join(',');
      this.zaneChange.emit({
        removedItem: this.getItemByValue(selectItemValue),
        value: this.value,
      });
    }
  }

  private renderDropdownList() {
    if (this.search === 'managed' && this.items.length === 0) {
      return (
        <zane-menu
          class="menu"
          layer={this.layer}
          ref={(el) => (this.menuElm = el)}
          size={this.size}
        >
          <div class="start-search">
            <zane-icon name="search" size={this.size} />
            <zane-text class="text-secondary">
              Start typing to perform search
            </zane-text>
          </div>
        </zane-menu>
      );
    }

    if (this.items) {
      const filteredItems = this.filterItems();
      return (
        <zane-menu
          class="menu"
          empty={filteredItems.length === 0}
          layer={this.layer}
          ref={(el) => (this.menuElm = el)}
          size={this.size}
        >
          {(() => {
            return filteredItems.map((item) => {
              return (
                <zane-menu-item layer={this.layer} value={item.value}>
                  <div class={'slot-container-start'} slot="start">
                    {item.icon && (
                      <zane-icon name={item.icon} size={this.size} />
                    )}
                  </div>
                  {item.label || item.value}

                  <div slot="end">
                    {((this.multiple && this.containsValue(item.value)) ||
                      this.value === item.value) && (
                      <zane-icon name="checkmark" size={this.size} />
                    )}
                  </div>
                </zane-menu-item>
              );
            });
          })()}
        </zane-menu>
      );
    }
  }

  private selectHandler = (selectItemValue) => {
    if (!this.disabled && !this.readonly) {
      this.searchString = '';

      if (this.multiple) this.toggleItem(selectItemValue);
      else this.addItem(selectItemValue);
    }
    if (!this.multiple) this.closeList();
  };

  private toggleItem(selectItemValue) {
    const value = this.getValues();
    if (value.includes(selectItemValue)) {
      this.removeItem(selectItemValue);
    } else {
      this.addItem(selectItemValue);
    }
  }

  private toggleList = () => {
    if (this.open) this.closeList();
    else this.openList();
  };
}
