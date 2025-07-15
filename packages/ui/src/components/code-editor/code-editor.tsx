import type { InputComponentInterface } from '../../interfaces';

import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import loadMonaco from '../../3d-party/monaco';
import {
  debounceEvent,
  getComponentIndex,
  isDarkMode,
  isInViewport,
  observeThemeChange,
} from '../../utils';

const win = window as any;
/**
 * @name Code Editor
 * @description A browser based code editor.
 * @category Form Inputs
 * @tags input, form
 * @img /assets/img/code-editor.webp
 * @imgDark /assets/img/code-editor-dark.webp
 */
@Component({
  shadow: true,
  styleUrl: 'code-editor.scss',
  tag: 'zane-code-editor',
})
export class CodeEditor implements ComponentInterface, InputComponentInterface {
  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `onChange` event after each keystroke.
   */
  @Prop() debounce = 250;

  /**
   * If true, the user cannot interact with the button. Defaults to `false`.
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  @State() editorMonacoInstance: any;

  @Element() elm!: HTMLElement;

  gid: string = getComponentIndex();

  @State() hasFocus = false;

  @State() isDarkMode: boolean = isDarkMode();

  @Prop() language: 'html' | 'javascript' | 'json' = 'javascript';

  @Prop() libSource: any;

  @Prop() lineNumbers: 'off' | 'on' = 'on';

  @Prop() minimap: boolean = false;

  /**
   * The input field name.
   */
  @Prop() name: string = `zane-input-${this.gid}`;

  @Prop({ reflect: true }) readonly: boolean = false;

  /**
   * If true, required icon is show. Defaults to `false`.
   */
  @Prop({ reflect: true }) required: boolean = false;

  /**
   * The input field value.
   */
  @Prop({ mutable: true }) value: string;

  /**
   * Emitted when the value has changed.
   */
  @Event({ eventName: 'zane-code-editor--change' }) zaneChange: EventEmitter;

  private editorElement?: HTMLElement;

  componentDidLoad() {
    this.initializeMonaco();
  }

  componentWillLoad() {
    this.debounceChanged();
    observeThemeChange(() => {
      this.isDarkMode = isDarkMode();
      this.themeWatcher();
    });
  }

  @Watch('disabled')
  disabledWatcher(newValue: boolean) {
    this.editorMonacoInstance.updateOptions({
      readOnly: newValue || this.readonly,
    });
  }

  @Method()
  async getComponentId() {
    return this.gid;
  }

  getTheme() {
    return this.isDarkMode ? 'vs-dark' : 'vs';
  }

  async initializeMonaco() {
    if (!win.monaco) {
      await loadMonaco();
    }
    // monaco.languages.typescript.javascriptDefaults.addExtraLib(this.extraLibs);
    if (!isInViewport(this.elm)) {
      setTimeout(() => this.initializeMonaco(), 300);
      return;
    }
    this.editorElement.innerHTML = '';

    this.editorMonacoInstance = win.monaco.editor.create(this.editorElement, {
      language: this.language,
      lineNumbers: this.lineNumbers,
      minimap: {
        enabled: this.minimap,
      },
      readOnly: this.disabled || this.readonly,
      theme: this.getTheme(),
      value: this.value,
    });

    if (this.libSource) {
      win.monaco.editor.createModel(
        this.libSource,
        this.language,
        'java://zaneui.com/lib.java',
      );
    }

    this.editorMonacoInstance.onDidChangeModelContent((e) => {
      if (!e.isFlush) {
        this.value = this.editorMonacoInstance.getValue();
        this.zaneChange.emit({ value: this.value });
      }
    });

    this.editorMonacoInstance.onDidFocusEditorText(() => {
      this.hasFocus = true;
    });

    this.editorMonacoInstance.onDidBlurEditorText(() => {
      this.hasFocus = false;
    });
  }

  @Watch('language')
  languageWatcher(newValue: string) {
    win.monaco.editor.setModelLanguage(
      this.editorMonacoInstance.getModel(),
      newValue,
    );
  }

  @Watch('readonly')
  readonlyWatcher(newValue: string) {
    this.editorMonacoInstance.updateOptions({
      readOnly: newValue || this.disabled,
    });
  }
  render() {
    return (
      <Host>
        <div
          class={{
            'code-editor-component': true,
            component: true,
            disabled: this.disabled,
            'has-focus': this.hasFocus,
            readonly: this.readonly,
            [this.getTheme()]: true,
          }}
        >
          {this.disabled || this.readonly ? (
            <zane-tag class="read-only-tag" color="red">
              Read Only
            </zane-tag>
          ) : null}

          <div class="editor" ref={(el) => (this.editorElement = el)} />
          {!this.editorMonacoInstance && (
            <div class="code-editor-loader">
              <zane-spinner />
              Loading editor...
            </div>
          )}
        </div>
      </Host>
    );
  }
  /**
   * Sets blur on the native `input` in `zane-input`. Use this method instead of the global
   * `input.blur()`.
   */
  @Method()
  async setBlur() {
    if (this.editorMonacoInstance) {
      this.editorMonacoInstance.blur();
    }
  }

  /**
   * Sets focus on the native `input` in `zane-input`. Use this method instead of the global
   * `input.focus()`.
   */
  @Method()
  async setFocus() {
    if (this.editorMonacoInstance) {
      this.editorMonacoInstance.focus();
    }
  }

  themeWatcher() {
    win.monaco.editor.setTheme(this.getTheme());
  }

  @Watch('value')
  valueWatcher(newValue: string) {
    if (
      this.editorMonacoInstance &&
      this.editorMonacoInstance.getValue() !== this.value
    ) {
      this.editorMonacoInstance.setValue(newValue);
    }
  }

  @Watch('debounce')
  protected debounceChanged() {
    this.zaneChange = debounceEvent(this.zaneChange, this.debounce);
  }

  @Watch('libSource')
  protected libSourceChanged() {
    if (win.monaco) {
      const libModel = win.monaco.editor.getModel('java://zaneui.com/lib.java');
      if (libModel) {
        libModel.dispose();
      }
      win.monaco.editor.createModel(
        this.libSource,
        this.language,
        'java://zaneui.com/lib.java',
      );
    }
  }
}
