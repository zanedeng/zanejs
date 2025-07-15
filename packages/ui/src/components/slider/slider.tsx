import type { InputComponentInterface } from '../../interfaces';

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

import { DRAG_EVENT_TYPES, DRAG_STOP_EVENT_TYPES } from '../../constants';
import { debounceEvent, getComponentIndex, isInViewport } from '../../utils';

/**
 * @name Slider
 * @description Sliders allow users to make selections from a range of values.
 * @category Form Inputs
 * @tags input, form
 * @img /assets/img/slider.webp
 * @imgDark /assets/img/slider-dark.webp
 */
@Component({
  shadow: true,
  styleUrl: 'slider.scss',
  tag: 'zane-slider',
})
export class Slider implements ComponentInterface, InputComponentInterface {
  @Prop({ mutable: true, reflect: true }) configAria: any = {};

  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `zaneChange` event after each keystroke.
   */
  @Prop() debounce = 300;

  /**
   * If true, the user cannot interact with the button. Defaults to `false`.
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  @Element() elm!: HTMLElement;

  /**
   * function to format the value of the input
   */
  @Prop() formatter: (value: number | string) => string;

  gid: string = getComponentIndex();

  @State() hasFocus = false;

  @Prop() max: number = 100;

  @Prop() min: number = 0;

  /**
   * The input field name.
   */
  @Prop() name: string = `zane-input-${this.gid}`;

  @State() needsOnRelease = false;

  _onDrag = (event) => {
    // Do nothing if component is disabled
    if (this.disabled || this.readonly) {
      return;
    }

    this.openTooltip(this.thumbElement, true);

    const clientX: number =
      event.type === 'touchstart' || event.type === 'touchmove'
        ? event.touches[0].clientX
        : event.clientX;

    this.updateByPosition(clientX);
  };

  onDrag = throttle(this._onDrag, 1);

  /**
   * If true, the user cannot interact with the button. Defaults to `false`.
   */
  @Prop({ reflect: true }) readonly: boolean = false;

  /**
   * If true, required icon is show. Defaults to `false`.
   */
  @Prop({ reflect: true }) required: boolean = false;

  @Prop() showOnlySlider: boolean = false;

  @State()
  slideElementWidth: null | number = null;

  @Prop({ mutable: true }) step: number = 1;

  /**
   * The input field value.
   */
  @Prop({ mutable: true }) value?: number = 0;

  /**
   * Emitted when the value has changed.
   */
  @Event({ eventName: 'zane-slider--change' }) zaneChange: EventEmitter;

  /**
   * Emitted when a keyboard input occurred.
   */
  @Event({ eventName: 'zane-slider--input' }) zaneInput: EventEmitter;
  private displayElement?: HTMLElement;

  private inputValue: number;
  private nativeElement?: HTMLInputElement;
  private slideElement?: HTMLElement;
  private thumbElement?: HTMLElement;

  componentDidLoad() {
    this.#computeSliderWidth();

    const resizeObserver = new ResizeObserver(() => {
      this.#computeSliderWidth();
    });

    resizeObserver.observe(this.elm);
  }

  componentWillLoad() {
    this.elm.getAttributeNames().forEach((name: string) => {
      if (name.includes('aria-')) {
        this.configAria[name] = this.elm.getAttribute(name);
        this.elm.removeAttribute(name);
      }
    });

    this.inputValue = this.value;
  }

  connectedCallback() {
    this.debounceChanged();
  }

  @Method()
  async getComponentId() {
    return this.gid;
  }

  onDragStart = (event) => {
    // Do nothing if component is disabled
    if (this.disabled || this.readonly) {
      return;
    }

    // Register drag stop handlers
    DRAG_STOP_EVENT_TYPES.forEach((element) => {
      this.elm?.ownerDocument.addEventListener(element, this.onDragStop);
    });

    // Register drag handlers
    DRAG_EVENT_TYPES.forEach((element) => {
      this.elm?.ownerDocument.addEventListener(element, this.onDrag);
    });

    this.hasFocus = true;

    this.onDrag(event);
  };

  /**
   * Unregisters "drag" and "drag stop" event handlers and calls sets the flag
   * indicating that the `onRelease` callback should be called.
   */
  onDragStop = (event) => {
    // Do nothing if component is disabled
    if (this.disabled || this.readonly) {
      return;
    }

    // Remove drag stop handlers
    DRAG_STOP_EVENT_TYPES.forEach((element) => {
      this.elm?.ownerDocument.removeEventListener(element, this.onDragStop);
    });

    // Remove drag handlers
    DRAG_EVENT_TYPES.forEach((element) => {
      this.elm?.ownerDocument.removeEventListener(element, this.onDrag);
    });

    const clientX: number =
      event.type === 'touchend'
        ? event.changedTouches[0].clientX
        : event.clientX;

    this.updateByPosition(clientX);
  };

  onWheel = (event) => {
    // Do nothing if component is disabled
    if (this.disabled || this.readonly) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    let delta = 0;
    if (event.wheelDelta) {
      delta = event.wheelDelta / 120;
    } else if (event.detail) {
      delta = -event.detail / 3;
    }

    this.updateValue(Number.parseInt(String(this.value)) + delta * this.step);
  };

  openTooltip = (target, open) => {
    window.dispatchEvent(
      new CustomEvent('zane-tooltip-open', {
        detail: {
          open,
          target,
        },
      }),
    );
  };

  render() {
    return (
      <Host has-focus={this.hasFocus} has-value={this.hasValue()}>
        <div class="slider-container">
          <div class="slider-wrapper">
            {!this.showOnlySlider && (
              <div class="slider-range-label">
                <span>{this.getFormattedValue(this.min)}</span>
              </div>
            )}
            <div
              class={{ 'has-focus': this.hasFocus, slider: true }}
              onMouseDown={this.onDragStart}
              onWheel={this.onWheel}
              ref={(elm) => (this.slideElement = elm)}
            >
              <div
                class="slider__thumb"
                onBlur={this.blurHandler}
                onFocus={this.focusHandler}
                onMouseLeave={(_e) => {
                  if (!this.hasFocus)
                    this.openTooltip(this.thumbElement, false);
                }}
                onMouseOver={(_e) => {
                  this.openTooltip(this.thumbElement, true);
                }}
                onTouchStart={this.onDragStart}
                ref={(elm) => (this.thumbElement = elm)}
                style={{
                  left: `${
                    (this.value * Math.trunc(this.slideElementWidth)) /
                      (this.max - this.min) -
                    8
                  }px`,
                }}
                tabIndex={0}
                tooltip-target={`slider-tooltip-${this.gid}`}
              ></div>
              <div class="slider__track"></div>
              <div
                class="slider__track--filled"
                style={{
                  width: `${
                    (this.value * Math.trunc(this.slideElementWidth)) /
                    (this.max - this.min)
                  }px`,
                }}
              ></div>
            </div>
            {!this.showOnlySlider && (
              <div class="slider-range-label">
                <span>{this.getFormattedValue(this.max)}</span>
              </div>
            )}
          </div>
          {this.showOnlySlider ? null : (
            <div class="slide-input">
              <zane-number
                class="input"
                hide-actions={true}
                onGoat-input={(e) => {
                  e.stopPropagation();
                }}
                onGoat-number--input={(e) => {
                  e.stopPropagation();
                  this.updateValue(e.target.value);
                }}
                size="sm"
                value={this.inputValue}
              ></zane-number>
            </div>
          )}
        </div>
        <zane-tooltip
          id={`slider-tooltip-${this.gid}`}
          placements="top,bottom"
          trigger={'manual'}
        >
          {this.getFormattedValue(this.value)}
        </zane-tooltip>
      </Host>
    );
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
   * `input.focus()`.
   */
  @Method()
  async setFocus(): Promise<void> {
    this.displayElement.focus();
  }

  updateByPosition(current) {
    const start = this.slideElement.getBoundingClientRect().left;
    const total = this.slideElement.getBoundingClientRect().width;
    const value = Number.parseInt(
      String(((current - start) / total) * (this.max - this.min)),
    );
    this.updateValue(value);
    this.inputValue = this.value;
  }

  updateValue = (newValue) => {
    const oldValue = this.value;

    this.value = Math.round(newValue / this.step) * this.step;

    if (this.value === null || this.value < this.min) {
      this.value = this.min;
    } else if (this.value > this.max) {
      this.value = this.max;
    }

    this.zaneInput.emit({
      value: this.value,
    });

    if (oldValue !== this.value) {
      this.zaneChange.emit({
        value: this.value,
      });
    }
  };

  @Listen('click', { target: 'window' })
  windowClick(evt) {
    const path = evt.path || evt.composedPath();
    for (const elm of path) {
      if (elm === this.elm) return;
    }
  }
  @Watch('debounce')
  protected debounceChanged() {
    this.zaneChange = debounceEvent(this.zaneChange, this.debounce);
  }

  #computeSliderWidth() {
    if (this.slideElementWidth === null && !isInViewport(this.elm)) {
      setTimeout(() => this.#computeSliderWidth(), 100);
      return;
    }

    this.slideElementWidth = this.slideElement.getBoundingClientRect().width;
  }

  private blurHandler = () => {
    this.hasFocus = false;
    this.openTooltip(this.thumbElement, false);
  };

  private focusHandler = () => {
    this.hasFocus = true;
  };

  private getFormattedValue(value: number | string) {
    if (this.formatter) return this.formatter(value);
    return value;
  }

  private hasValue(): boolean {
    return (this.value || '').toString().length > 0;
  }
}
