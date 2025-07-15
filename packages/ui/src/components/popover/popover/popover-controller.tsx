import {
  arrow,
  autoPlacement,
  computePosition,
  flip,
  offset as floatingUIOffset,
} from '@floating-ui/dom';
import { throttle } from 'lodash';

export default class PopoverController {
  arrowRef?: HTMLElement;
  computePosition = (/* context: string */) => {
    if (!this.triggerRef || !this.contentRef) {
      console.warn('Popover: triggerRef or contentRef is not found');
      return;
    }

    if (!this.open) return;
    // console.log('Popover: computePositionThrottle', context, this.triggerRef);

    const middleware = [];

    /**
     * Maintain the order of the middleware.
     * The `offset` middleware must be the first middleware
     * The `arrow` middleware must be the last middleware
     */

    /**
     * Offset the popover by the arrow's hypotenuse length
     */
    let floatingOffset = this.offset;
    if (this.arrowRef) {
      const arrowLen = this.arrowRef.offsetWidth;
      // Get half the arrow box's hypotenuse length
      floatingOffset += Math.sqrt(2 * arrowLen ** 2) / 2;
    }

    middleware.push(
      floatingUIOffset({
        alignmentAxis: -this.contentPadding,
        crossAxis: -this.contentPadding,
        mainAxis: floatingOffset + this.contentPadding,
      }),
    );

    /**
     * Handle content overflow size
     */
    /* middleware.push(size({
      apply({ availableHeight }) {
        if (availableHeight < 10 * 16) return;
        menuElm.style.setProperty(
          '--zane-menu-max-height',
          `${availableHeight}px`,
        );
      },
      padding: 5,
    }))*/

    /**
     * Add the flip and autoPlacement middleware and possible placements
     */
    const placements = this.placements ? this.placements.split(',') : [];
    const placement: any = placements[0];

    if (placements.length === 0) {
      middleware.push(autoPlacement());
    } else {
      const fallbackPlacements: any = placements.splice(1);
      middleware.push(flip({ fallbackPlacements }));
    }

    if (this.arrowRef) middleware.push(arrow({ element: this.arrowRef }));

    computePosition(this.triggerRef, this.contentRef, {
      middleware,
      placement,
    }).then(({ middlewareData, placement, strategy, x, y }) => {
      const [side, leaning] = placement.split('-');

      const style: any = {};
      style.left = `${x}px`;
      style.top = `${y}px`;
      style.position = strategy === 'fixed' ? 'fixed' : 'absolute';

      let topShadowSize = 0;
      let leftShadowSize = 0;

      if (side === 'top' || side === 'bottom') {
        if (side === 'top') {
          topShadowSize = -2;
        } else if (side === 'bottom') {
          topShadowSize = 2;
        }
        if (leaning === 'start') {
          leftShadowSize = 2;
        } else if (leaning === 'end') {
          leftShadowSize = -2;
        }
      } else if (side === 'left' || side === 'right') {
        if (side === 'left') {
          leftShadowSize = -2;
        } else if (side === 'right') {
          leftShadowSize = 2;
        }
        if (leaning === 'start') {
          topShadowSize = -2;
        } else if (leaning === 'end') {
          topShadowSize = 2;
        }
      }

      this.contentRef.style.setProperty(
        '--popover-content-shadow',
        `drop-shadow(${leftShadowSize}px ${topShadowSize}px 2px rgba(0, 0, 0, 0.2))`,
      );

      Object.assign(this.contentRef.style, style);

      if (middlewareData.arrow) {
        const { x, y } = middlewareData.arrow;

        const staticSide = {
          bottom: 'top',
          left: 'right',
          right: 'left',
          top: 'bottom',
        }[side];

        Object.assign(this.arrowRef.style, {
          bottom: '',
          left: x === null ? '' : `${x}px`,
          // Ensure the static side gets unset when
          // flipping to other placements' axes.
          right: '',
          [staticSide]: `${-this.arrowRef.offsetWidth / 2}px`,
          top: y === null ? '' : `${y}px`,
        });
      }
      // if (callBack) callBack();
    });
  };
  computePositionThrottle = throttle(this.computePosition, 80, {
    leading: true,
    trailing: true,
  });
  contentPadding: number;
  contentRef: HTMLElement;
  dismissTimeout: number;
  hideCallback: () => void;
  host: HTMLElement;
  observer: IntersectionObserver;
  offset: number;
  open: boolean;
  openTimeout: number;

  placements?: string;
  showCallback: () => void;

  trigger: 'click' | 'hover' | 'manual';

  triggerRef: HTMLElement;

  triggers: HTMLElement[];

  constructor(
    host: HTMLElement,
    trigger: 'click' | 'hover' | 'manual' = 'hover',
    open: boolean,
    contentRef: HTMLElement,
    offset: number = 0,
    contentPadding: number = 0,
    show: () => void,
    hide: () => void,
    placements?: string,
    openTimeout: number = 200,
    dismissTimeout: number = 300,
    arrowRef?: HTMLElement,
  ) {
    this.host = host;
    this.open = open;
    this.trigger = trigger;
    this.contentRef = contentRef;
    this.offset = offset;
    this.arrowRef = arrowRef;
    this.placements = placements;
    this.openTimeout = openTimeout;
    this.dismissTimeout = dismissTimeout;
    this.triggers = [];
    this.showCallback = show;
    this.hideCallback = hide;
    this.contentPadding = contentPadding;
    this.observer = new IntersectionObserver(
      () => this.intersectingCallback(),
      {
        threshold: [0, 1],
      },
    );
    this.observer.observe(this.contentRef);
  }

  destroy() {
    this.observer.disconnect();
    this.observer = null;
  }

  hidePopover = () => {
    if (this.open) {
      this.open = false;
      this.hideCallback();
    }
  };

  intersectingCallback() {
    this.open && this.computePositionThrottle('onTriggerIntersection');
  }

  mouseleaveHandler = (event: any) => {
    const eventPath = event.path ?? event.composedPath();
    const popoverHost = eventPath.find((node) => node === this.host);
    if (popoverHost) {
      const mouseLeaveHandler = () => {
        const hoverElements = document.querySelectorAll(':hover');
        const index = Array.prototype.indexOf.call(hoverElements, popoverHost);
        if (index < 0) {
          this.hidePopover();
        }
      };
      setTimeout(mouseLeaveHandler, this.dismissTimeout);
    } else {
      this.hidePopover();
    }
  };

  registerTarget(triggerRef: HTMLElement) {
    if (!triggerRef)
      throw new Error('The trigger element for the popover is not found.');

    if (this.triggers.includes(triggerRef)) return;

    this.observer.observe(triggerRef);

    if (this.trigger === 'hover') {
      triggerRef.addEventListener('focus', () => {
        this.triggerRef = triggerRef;
        this.showPopover();
      });
      triggerRef.addEventListener('blur', () => this.hidePopover());
      triggerRef.addEventListener('mouseenter', () => {
        this.triggerRef = triggerRef;
        this.showPopover();
      });
      triggerRef.addEventListener('mouseleave', this.mouseleaveHandler);
    } else if (this.trigger === 'click') {
      if (triggerRef.nodeName === 'ZANE-BUTTON') {
        triggerRef.addEventListener('zane-button--click', () => {
          this.open ? this.hidePopover() : this.showPopover();
        });
      } else {
        triggerRef.addEventListener('click', () => {
          this.open ? this.hidePopover() : this.showPopover();
        });
      }
    }

    this.triggers.push(triggerRef);
  }

  setOpen(open: boolean) {
    this.open = open;
  }

  setTriggerRef(triggerRef: HTMLElement) {
    this.triggerRef = triggerRef;
  }

  showPopover = () => {
    if (!this.open) {
      if (this.trigger === 'hover') {
        setTimeout(() => {
          if (this.triggerRef.matches(':hover')) {
            this.showCallback();
          }
        }, this.openTimeout);
      } else {
        this.showCallback();
      }
    }
  };

  windowClickHandler = (evt: any) => {
    if ((this.trigger === 'click' || this.trigger === 'hover') && this.open) {
      const path = evt.path || evt.composedPath();
      for (const elm of path) {
        if (elm === this.host || this.triggers.includes(elm)) return;
      }
      this.hidePopover();
    }
  };
}
