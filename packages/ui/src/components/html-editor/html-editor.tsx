import type { InputComponentInterface } from '../../interfaces';

import { computePosition, offset } from '@floating-ui/dom';
import {
  Component,
  ComponentInterface,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';
import { Editor, mergeAttributes } from '@tiptap/core';
import FontFamily from '@tiptap/extension-font-family';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import * as beautify from 'js-beautify/js';

import { debounceEvent, getComponentIndex } from '../../utils';

const win = window as any;
/**
 * @name HTML Editor
 * @description HTML Editor component is a WYSIWYG editor that allows users to edit HTML content.
 * @category Up coming
 * @tags input, form
 * @img /assets/img/html-editor.webp
 * @imgDark /assets/img/html-editor-dark.webp
 */
@Component({
  shadow: true,
  styleUrl: 'html-editor.scss',
  tag: 'zane-html-editor',
})
export class HtmlEditor implements ComponentInterface, InputComponentInterface {
  copiedContent: any = '';

  /**
   * Set the amount of time, in milliseconds, to wait to trigger the `onChange` event after each keystroke.
   */
  @Prop() debounce = 250;

  /**
   * If true, the user cannot interact with the button. Defaults to `false`.
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  dropdownContent: HTMLZaneMenuElement;

  @State()
  editorInstance: any;

  @State()
  filteredMentionValues: string[] = [];

  gid: string = getComponentIndex();

  @State() hasFocus = false;

  @Prop({ reflect: true }) layer?: '01' | '02' | 'background';

  @Prop() lineNumbers: 'off' | 'on' = 'on';

  mentionProps: any;

  @Prop({ mutable: true }) mentions: { label: string; value: string }[] = [];

  @Prop() mentionsSearch: 'contains' | 'managed' = 'contains';

  /**
   * The input field name.
   */
  @Prop() name: string = `zane-input-${this.gid}`;

  /**
   * The input field placeholder.
   */
  @Prop() placeholder: string;

  queryRange: any;

  @Prop({ reflect: true }) readonly: boolean = false;

  /**
   * If true, required icon is show. Defaults to `false`.
   */
  @Prop({ reflect: true }) required: boolean = false;

  @State()
  showDropdown: boolean = false;

  @State()
  showHtml: boolean = false;

  @Prop({ reflect: true }) showSuggestionCharacter: boolean = true;

  @Prop() showToolbar: boolean = true;

  @Prop({ reflect: true }) suggestionCharacter = '@';

  @Prop() theme: 'vs-dark' | 'vs-light' = 'vs-light';

  /**
   * The input field value.
   */
  @Prop({ mutable: true }) value: string;

  /**
   * Emitted when the value has changed..
   */
  @Event({ eventName: 'zane-html-editor--change' }) zaneChange: EventEmitter;

  /**
   * Emitted when a keyboard input occurred.
   */
  @Event({ eventName: 'zane-html-editor--search' }) zaneSearch: EventEmitter;

  private editorElement?: HTMLElement;

  componentDidLoad() {
    setTimeout(() => this.initializeEditor(), 1000);
  }

  async componentWillLoad() {
    this.debounceChanged();
  }

  @Watch('disabled')
  disabledWatcher(newValue: boolean) {
    this.editorInstance.setEditable(!newValue && !this.readonly);
  }

  @Method()
  async getComponentId() {
    return this.gid;
  }

  getMentionItem(value: string) {
    return this.mentions.find((item) => item.value === value);
  }

  @Watch('readonly')
  readonlyWatcher(newValue: string) {
    this.editorInstance.setEditable(!newValue && !this.disabled);
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
            [this.theme]: true,
          }}
        >
          <div class={{ hidden: this.showHtml, 'wysiwyg-container': true }}>
            {!this.readonly &&
              !this.disabled &&
              this.showToolbar &&
              this.renderToolbar()}
            <div class="editor" ref={(el) => (this.editorElement = el)}></div>
          </div>

          {!this.showHtml && !this.editorInstance && (
            <div class="editor-loader">
              <zane-spinner />
              Loading editor...
            </div>
          )}

          <zane-code-editor
            class={{ hidden: !this.showHtml, 'html-code-editor': true }}
            disabled={this.disabled}
            language="html"
            onZane-code-editor--change={(evt) => {
              this.value = evt.detail.value;
            }}
            readonly={this.readonly}
            value={this.value}
          ></zane-code-editor>

          {this.showToolbar && (
            <div class={'html-editor-footer'}>
              <div class={'footer-left'}>
                <zane-toggle
                  zane-toggle--change={(evt) => {
                    this.showHtml = evt.target.value;
                  }}
                >
                  HTML
                </zane-toggle>
              </div>

              <div class={'footer-right'}>
                {this.editorInstance && this.editorInstance.getHTML()?.length}
              </div>
            </div>
          )}
        </div>

        <zane-menu
          class={{ 'mention-menu': true, show: this.showDropdown }}
          onZane-menu-item--click={(evt) => {
            this.editorInstance.commands.deleteRange(this.queryRange);
            this.mentionProps.command({ id: evt.detail.value });
          }}
          ref={(elm) => (this.dropdownContent = elm)}
        >
          {this.filteredMentionValues.map((value) => {
            const item = this.getMentionItem(value);

            return (
              <zane-menu-item value={item.value}>{item.label}</zane-menu-item>
            );
          })}
        </zane-menu>
      </Host>
    );
  }

  renderToolbar() {
    const actionGroups = [
      {
        actions: [
          {
            action: () => {
              this.editorInstance.commands.undo();
            },
            icon: 'undo',
          },
          {
            action: () => {
              this.editorInstance.commands.redo();
            },
            icon: 'redo',
          },
        ],
      },
      {
        actions: [
          {
            action: () => {
              this.editorInstance.chain().focus().toggleBold().run();
            },
            icon: 'text--bold',
          },
          {
            action: () => {
              this.editorInstance.chain().focus().toggleItalic().run();
            },
            icon: 'text--italic',
          },
          {
            action: () => {
              this.editorInstance.chain().focus().toggleUnderline().run();
            },
            icon: 'text--underline',
          },
        ],
      },
      {
        actions: [
          {
            action: () => {
              this.editorInstance.chain().focus().toggleBulletList().run();
            },
            icon: 'list--bulleted',
          },
          {
            action: () => {
              this.editorInstance.chain().focus().toggleOrderedList().run();
            },
            icon: 'list--numbered',
          },
        ],
      },
    ];
    return (
      <div class="toolbar">
        {actionGroups.map((actionGroup) => {
          return (
            <div class={'action-group'}>
              {actionGroup.actions.map((action) => {
                return (
                  <zane-button
                    class={'action'}
                    color="white"
                    darkModeColor="secondary"
                    icon={action.icon}
                    onZane-button--click={action.action}
                  ></zane-button>
                );
              })}
            </div>
          );
        })}

        {/* <div class={'action-group'}>
              <zane-button
                icon="cut"
                variant="light"
                color="secondary"
                onZane:click={() => {
                  const from = this.editorInstance.state.selection.from;
                  const to = this.editorInstance.state.selection.to;
                  this.copiedContent =
                    this.editorInstance.state.doc.textBetween(from, to);
                  document.execCommand('cut');
                }}
              ></zane-button>

              <zane-button
                icon="copy"
                variant="light"
                color="secondary"
                onZane:click={() => {
                  const from = this.editorInstance.state.selection.from;
                  const to = this.editorInstance.state.selection.to;
                  this.copiedContent =
                    this.editorInstance.state.doc.textBetween(from, to);
                  document.execCommand('copy');
                }}
              ></zane-button>

              <zane-button
                icon="paste"
                variant="light"
                color="secondary"
                onZane:click={() => {
                  this.editorInstance.chain().focus().run();
                  this.editorInstance.commands.insertContent(
                    this.copiedContent,
                  );
                }}
              ></zane-button>
            </div>*/}

        {/* <zane-button
                icon="text--align--left"
                variant="outline"
                color="secondary"
                size={'sm'}
                onZane:click={() => {
                  // this.editorInstance.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
                }}
              ></zane-button>

              <zane-button
                icon="text--align--center"
                variant="outline"
                color="secondary"
                size={'sm'}
                onZane:click={() => {
                  // this.editorInstance.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
                }}
              ></zane-button>

              <zane-button
                icon="text--align--right"
                variant="outline"
                color="secondary"
                size={'sm'}
                onZane:click={() => {
                  //.editorInstance.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
                }}
              ></zane-button> */}
      </div>
    );
  }

  /**
   * Sets blur on the native `input` in `zane-input`. Use this method instead of the global
   * `input.blur()`.
   */
  @Method()
  async setBlur() {
    if (this.editorInstance) {
      this.editorInstance.blur();
    }
  }

  /**
   * Sets focus on the native `input` in `zane-input`. Use this method instead of the global
   * `input.focus()`.
   */
  @Method()
  async setFocus() {
    if (this.editorInstance) {
      this.editorInstance.chain().focus().run();
    }
  }

  @Watch('theme')
  themeWatcher(newValue: string) {
    win.monaco.editor.setTheme(newValue);
  }

  @Watch('value')
  valueWatcher(newValue: string) {
    if (
      beautify.html(this.editorInstance.getHTML(), {
        wrap_line_length: 120,
      }) !== this.value
    ) {
      this.editorInstance.commands.setContent(newValue);
    }
  }
  @Watch('debounce')
  protected debounceChanged() {
    this.zaneChange = debounceEvent(this.zaneChange, this.debounce);
  }
  private initializeEditor() {
    // eslint-disable-next-line unicorn/no-this-assignment, @typescript-eslint/no-this-alias
    const that = this;

    this.editorElement.innerHTML = '';

    // This sample still does not showcase all CKEditor 5 features (!)
    // Visit https://ckeditor.com/docs/ckeditor5/latest/features/index.html to browse all the features.
    this.editorInstance = new Editor({
      content: this.value,
      element: this.editorElement,
      extensions: [
        StarterKit,
        Underline,
        TextStyle,
        FontFamily,
        Placeholder.configure({
          // Use a placeholder:
          placeholder: that.placeholder,
          // Use different placeholders depending on the node type:
          // placeholder: ({ node }) => {
          //   if (node.type.name === 'heading') {
          //     return 'What’s the title?'
          //   }

          //   return 'Can you add some further context?'
          // },
        }),
        Mention.configure({
          HTMLAttributes: {
            class: 'mention',
          },
          renderHTML({ node, options }) {
            const item = that.getMentionItem(node.attrs.id);
            return [
              'a',
              mergeAttributes(
                { contenteditable: false },
                options.HTMLAttributes,
              ),
              `${that.showSuggestionCharacter ? options.suggestion.char : ''}${item ? item.label : node.attrs.id}`,
            ];
          },
          suggestion: {
            allowSpaces: true,
            char: that.suggestionCharacter,
            render() {
              return {
                onExit: () => {
                  that.showDropdown = false;
                  that.filteredMentionValues = [];
                },
                onKeyDown(props) {
                  if (props.event.key === 'ArrowDown') {
                    that.dropdownContent.setFocus();
                  } else if (props.event.key === 'Escape') {
                    that.showDropdown = false;
                    that.filteredMentionValues = [];
                    return true;
                  }
                },

                onStart: (props) => {
                  that.mentionProps = props;
                  that.queryRange = props.range;
                  that.showDropdown = true;
                  that.filteredMentionValues = props.items;
                  computePosition(props.decorationNode, that.dropdownContent, {
                    // Try removing the middleware. The dropdown will
                    // overflow the boundary's edge and get clipped!
                    middleware: [offset(10)],
                    placement: 'bottom-start',
                  }).then(({ x, y }) => {
                    Object.assign(that.dropdownContent.style, {
                      left: `${x}px`,
                      top: `${y}px`,
                    });
                  });
                },
                onUpdate: (props) => {
                  that.filteredMentionValues = props.items;
                  that.queryRange = props.range;
                  computePosition(props.decorationNode, that.dropdownContent, {
                    // Try removing the middleware. The dropdown will
                    // overflow the boundary's edge and get clipped!
                    middleware: [offset(10)],
                    placement: 'bottom-start',
                  }).then(({ x, y }) => {
                    Object.assign(that.dropdownContent.style, {
                      left: `${x}px`,
                      top: `${y}px`,
                    });
                  });
                },
              };
            },
            async items(props) {
              if (that.mentionsSearch === 'managed') {
                return new Promise((resolve) => {
                  that.zaneSearch.emit({
                    callback(mentions) {
                      that.mentions = mentions;
                      resolve(that.mentions.map((item) => item.value));
                    },
                    query: props.query,
                  });
                });
              }

              return that.mentions
                .filter((item) =>
                  item.label
                    .toLowerCase()
                    .startsWith(props.query.toLowerCase()),
                )
                .map((item) => item.value)
                .slice(0, 5);
            },
          },
        }),
      ],
    });

    this.editorInstance.on('update', () => {
      this.value = beautify.html(this.editorInstance.getHTML(), {
        wrap_line_length: 120,
      });

      this.zaneChange.emit({ value: this.value });
    });

    this.editorElement.addEventListener('click', (e) => {
      // Focus the editor when the user clicks anywhere on the editor
      if (this.editorElement === e.target)
        this.editorInstance.commands.focus('end');
    });
  }
}
