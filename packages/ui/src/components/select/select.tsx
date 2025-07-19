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
 * 基于 Floating UI 的增强型下拉选择组件
 *
 * @component
 * @tag zane-select
 * @implements {ComponentInterface, InputComponentInterface}
 *
 * @example
 * <!-- 基础用法 -->
 * <zane-select
 *   items={[{label: '选项1', value: 1}]}
 *   placeholder="请选择"
 *   size="md"
 * />
 */
@Component({
  shadow: true,
  styleUrl: 'select.scss',
  tag: 'zane-select',
})
export class Select implements ComponentInterface, InputComponentInterface {
  @Element() elm!: HTMLElement;

  /**
   * 下拉菜单定位策略配置
   * @type {string}
   * @default 'bottom-start,top-start,bottom-end,top-end'
   * @example
   * placements="top,right-start" // 优先尝试顶部对齐，次选右侧对齐
   *
   * 格式说明：
   * - 使用逗号分隔的定位字符串
   * - 每个定位字符串格式为[方向]-[对齐方式]
   * - 方向选项：top | right | bottom | left
   * - 对齐方式：start | end
   */
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
   * 是否显示清除按钮
   * @type {boolean}
   * @default false
   */
  @Prop() clearable: boolean = false;

  /**
   * ARIA属性配置对象
   * @type {Object}
   * @mutable
   * @example
   * configAria={{ 'aria-labelledby': 'custom-label' }}
   *
   * 支持动态配置以下属性：
   * - aria-label：定义组件的语义标签
   * - aria-labelledby：关联可见标签元素
   * - aria-describedby：关联描述元素
   */
  @Prop({ mutable: true, reflect: true }) configAria: any = {};

  /**
   * 搜索输入防抖时间（毫秒）
   * @type {number}
   * @default 300
   */
  @Prop() debounce = 300;

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

  @Prop() items: {
    icon?: string;
    label: number | string;
    value: number | string;
  }[] = [];

  @Prop() label: string;

  /**
   * 视觉层级配置
   * @type {'01' | '02' | 'background'}
   * @example
   * layer="02" // 使用第二层级的阴影和背景
   *
   * 层级说明：
   * - 01：基础层级（默认），适用于常规布局
   * - 02：更高层级，适合悬浮卡片效果
   * - background：背景层级，适合非交互元素
   */
  @Prop({ reflect: true }) layer?: '01' | '02' | 'background';

  @Prop() multiple: boolean = false;

  @Prop() name: string = `zane-input-${this.gid}`;

  @Prop({ mutable: true, reflect: true }) open: boolean = false;

  @Prop() placeholder: string;

  @State() position: string;

  @Prop({ reflect: true }) readonly: boolean = false;

  @Prop({ reflect: true }) required: boolean = false;

  /**
   * 搜索模式配置
   * @type {'contains' | 'initial' | 'managed' | 'none'}
   * @default 'none'
   * @example
   * search="contains" // 实时子字符串匹配
   *
   * 模式说明：
   * - none：禁用搜索功能
   * - contains：根据输入内容进行子字符串匹配过滤
   * - initial：仅在打开菜单时执行初始过滤
   * - managed：由父组件完全控制搜索逻辑
   */
  @Prop() search: 'contains' | 'initial' | 'managed' | 'none' = 'none';

  @State() searchString: string = '';

  @Prop() showLoader: boolean = false;

  /**
   * 组件尺寸选项
   * @type {'lg' | 'md' | 'sm'}
   * @default 'md'
   * @example
   * size="sm" // 小尺寸样式
   *
   * 具体尺寸对应关系：
   * - sm：高度32px，适合紧凑布局
   * - md：高度40px，标准尺寸
   * - lg：高度48px，强调视觉重点
   */
  @Prop({ reflect: true }) size: 'lg' | 'md' | 'sm' = 'md';

  @State() startSlotHasContent = false;

  /**
   * 组件状态标识
   * @type {'default' | 'error' | 'success' | 'warning'}
   * @default 'default'
   * @example
   * state="error" // 显示错误状态样式
   *
   * 状态说明：
   * - default：常规状态
   * - error：输入验证失败
   * - success：输入验证通过
   * - warning：存在潜在问题
   */
  @Prop({ reflect: true }) state: 'default' | 'error' | 'success' | 'warning' =
    'default';

  @Prop({ mutable: true }) value?: number | string = '';

  @Prop() warn: boolean = false;

  @Prop() warnText: string;

  /**
   * 值变更事件
   * @event zane-select--change
   * @type {EventEmitter<{ newItem?: object, removedItem?: object, value: string }>}
   * @example
   * <zane-select onZaneSelectChange={e => console.log(e.detail)}>
   *
   * 事件参数说明：
   * - newItem：新增项的对象数据（当为添加操作时存在）
   * - removedItem：移除项的对象数据（当为删除操作时存在）
   * - value：当前选中值的逗号分隔字符串
   */
  @Event({ eventName: 'zane-select--change' }) zaneChange: EventEmitter;

  /**
   * 搜索输入事件（带防抖）
   * @event zane-select--search
   * @type {EventEmitter<{ value: string }>}
   * @example
   * <zane-search onZaneSearch={e => handleSearch(e.detail.value)}>
   *
   * 触发条件：
   * - 当search不为'none'时
   * - 输入内容发生变更且经过防抖处理
   */
  @Event({ eventName: 'zane-select--search' }) zaneSearch: EventEmitter;

  /**
   * 搜索回车确认事件
   * @event zane-select--enter
   * @type {EventEmitter<{ currentItems: array, value: string }>}
   * @example
   * <zane-search onZaneSearchEnter={e => loadMore(e.detail.value)}>
   *
   * 事件参数说明：
   * - currentItems：当前过滤后的菜单项数组
   * - value：当前的搜索关键词
   */
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

  @Method()
  async setBlur() {
    if (this.nativeElement) {
      this.nativeElement.blur();
    }
  }

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
