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
 * 基于 Tiptap 的富文本编辑器组件，支持：
 * - HTML 源码编辑
 * - Mention（@提及）自动补全功能
 * - 内置工具条（加粗、斜体、列表等）
 * - 主题切换（vs-dark / vs-light）
 * - 可视化编辑与 HTML 源码切换
 * - 与表单集成（name、required、readonly 等属性）
 *
 */
@Component({
  shadow: true,
  styleUrl: 'html-editor.scss',
  tag: 'zane-html-editor',
})
export class HtmlEditor implements ComponentInterface, InputComponentInterface {
  copiedContent: any = '';

  /**
   * 设置事件触发的防抖时间（毫秒），用于优化 `zaneChange` 事件的触发频率。
   * 默认值：250。
   */
  @Prop() debounce = 250;

  /**
   * 控制编辑器是否禁用。
   * - `true`：编辑器不可编辑。
   * - `false`：编辑器可编辑（默认）。
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  dropdownContent: HTMLZaneMenuElement;

  /**
   * 编辑器实例对象，用于调用 Tiptap 提供的 API 方法。
   */
  @State()
  editorInstance: any;

  /**
   * 当前 Mention 下拉菜单中过滤后的提及值列表。
   */
  @State()
  filteredMentionValues: string[] = [];

  gid: string = getComponentIndex();

  /**
   * 编辑器是否获得焦点。
   * - `true`：有焦点
   * - `false`：无焦点
   */
  @State() hasFocus = false;

  /**
   * 设置组件的层级样式类，用于区分不同视觉层级的组件。
   * 可选值：
   * - '01'：主层级，视觉权重最高（如模态框）
   * - '02'：次级层级，用于普通组件
   * - 'background'：背景层级，通常用于遮罩、背景等
   */
  @Prop({ reflect: true }) layer?: '01' | '02' | 'background';

  /**
   * 设置是否在代码编辑器中显示行号。
   * - 'on'：显示行号（默认）
   * - 'off'：不显示行号
   */
  @Prop() lineNumbers: 'off' | 'on' = 'on';

  mentionProps: any;

  @Prop({ mutable: true }) mentions: { label: string; value: string }[] = [];

  /**
   * 配置 Mention 提及功能的搜索方式。
   * - 'contains'：使用本地数组进行模糊匹配（适合静态数据）
   * - 'managed'：通过事件 `zane-html-editor--search` 获取动态数据（适合异步搜索）
   */
  @Prop() mentionsSearch: 'contains' | 'managed' = 'contains';

  /**
   * 表单字段名称，用于提交或获取数据。
   * 默认值：`zane-input-<index>`，其中 `<index>` 为组件唯一标识符。
   */
  @Prop() name: string = `zane-input-${this.gid}`;

  /**
   * 编辑器的占位文本（未输入内容时显示的提示文本）。
   */
  @Prop() placeholder: string;

  queryRange: any;

  /**
   * 设置编辑器是否为只读模式。
   * - `true`：用户不能修改内容
   * - `false`：用户可编辑（默认）
   */
  @Prop({ reflect: true }) readonly: boolean = false;

  /**
   * 设置是否为必填字段，通常用于表单验证。
   * - `true`：必须输入
   * - `false`：非必填（默认）
   */
  @Prop({ reflect: true }) required: boolean = false;

  /**
   * 控制 Mention 下拉菜单是否显示。
   * - `true`：显示下拉菜单
   * - `false`：隐藏下拉菜单
   */
  @State()
  showDropdown: boolean = false;

  /**
   * 控制是否显示 HTML 源码编辑器。
   * - `true`：显示源码编辑器
   * - `false`：显示富文本编辑器
   */
  @State()
  showHtml: boolean = false;

  @Prop({ reflect: true }) showSuggestionCharacter: boolean = true;

  @Prop() showToolbar: boolean = true;

  @Prop({ reflect: true }) suggestionCharacter = '@';

  /**
   * 设置编辑器的外观主题。
   * - 'vs-dark'：深色主题
   * - 'vs-light'：浅色主题（默认）
   */
  @Prop() theme: 'vs-dark' | 'vs-light' = 'vs-light';

  /**
   * 设置或获取富文本编辑器的当前内容值（HTML 字符串）。
   */
  @Prop({ mutable: true }) value: string;

  /**
   * 当编辑器内容发生变化时触发该事件。
   * 事件参数格式：`{ value: string }`，其中 `value` 为当前 HTML 内容。
   */
  @Event({ eventName: 'zane-html-editor--change' }) zaneChange: EventEmitter;

  /**
   * 当 Mention 提及功能需要异步搜索时触发该事件。
   * 事件参数格式：`{ query: string, callback: (mentions: { label: string; value: string }[]) => void }`。
   * 开发者需通过 `callback` 返回匹配的 Mention 数据。
   */
  @Event({ eventName: 'zane-html-editor--search' }) zaneSearch: EventEmitter;

  private editorElement?: HTMLElement;

  componentDidLoad() {
    setTimeout(() => this.initializeEditor(), 1000);
  }

  async componentWillLoad() {
    this.debounceChanged();
  }

  /**
   * 监听 `disabled` 属性变化，同步更新编辑器的可编辑状态。
   */
  @Watch('disabled')
  disabledWatcher(newValue: boolean) {
    this.editorInstance.setEditable(!newValue && !this.readonly);
  }

  /**
   * 获取组件的唯一标识符（GID）。
   * 用于生成唯一 name 属性或用于调试。
   */
  @Method()
  async getComponentId() {
    return this.gid;
  }

  getMentionItem(value: string) {
    return this.mentions.find((item) => item.value === value);
  }

  /**
   * 监听 `readonly` 属性变化，同步更新编辑器的可编辑状态。
   */
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
      </div>
    );
  }

  /**
   * 手动设置编辑器失去焦点。
   */
  @Method()
  async setBlur() {
    if (this.editorInstance) {
      this.editorInstance.blur();
    }
  }

  /**
   * 手动设置编辑器获得焦点。
   */
  @Method()
  async setFocus() {
    if (this.editorInstance) {
      this.editorInstance.chain().focus().run();
    }
  }

  /**
   * 监听 `theme` 属性变化，同步更新 Monaco 编辑器的主题。
   */
  @Watch('theme')
  themeWatcher(newValue: string) {
    win.monaco.editor.setTheme(newValue);
  }

  /**
   * 监听 `value` 属性变化，同步更新编辑器的内容。
   */
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

  /**
   * 监听 `debounce` 属性变化，更新 `zaneChange` 事件的防抖机制。
   */
  @Watch('debounce')
  protected debounceChanged() {
    this.zaneChange = debounceEvent(this.zaneChange, this.debounce);
  }
  private initializeEditor() {
    const that = this;

    this.editorElement.innerHTML = '';

    this.editorInstance = new Editor({
      content: this.value,
      element: this.editorElement,
      extensions: [
        StarterKit,
        Underline,
        TextStyle,
        FontFamily,
        Placeholder.configure({
          placeholder: that.placeholder,
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
      if (this.editorElement === e.target)
        this.editorInstance.commands.focus('end');
    });
  }
}
