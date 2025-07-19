import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core';
import { throttle } from 'lodash';

import { getNextLayer } from '../../utils';

/**
 * 默认单元格宽度（单位：rem）
 * @constant {number} DEFAULT_CELL_WIDTH
 */
const DEFAULT_CELL_WIDTH = 16;

/**
 * 支持的分页尺寸配置
 * @constant {Array<{label: number, value: number}>} SUPPORTED_PAGE_SIZES
 */
const SUPPORTED_PAGE_SIZES = [
  {
    label: 10,
    value: 10,
  },
  {
    label: 25,
    value: 25,
  },
  {
    label: 50,
    value: 50,
  },
  {
    label: 100,
    value: 100,
  },
];

@Component({
  shadow: true,
  styleUrl: 'table.scss',
  tag: 'zane-table',
})
export class Table {
  /**
   * 表格列配置数组
   * @prop {Array<Object>} columns
   * @example
   * [
   *   {
   *     name: "name",         // 数据字段名
   *     label: "Name",        // 列标题显示文本
   *     width: 300,           // 列宽度（像素或rem）
   *     fixed: true,          // 是否固定列（左侧固定）
   *     template: (row, column) => `<b>${row[column.name]}</b>` // 自定义渲染模板
   *   },
   *   {
   *     name: "age",
   *     label: "Age"
   *   }
   * ]
   */
  @Prop() columns: any[] = [];

  /**
   * 表格数据源
   * @prop {Array<Object>} data
   * @example
   * [{
   *   id: '5e7118ddce4b3d577956457f',
   *   age: 21,
   *   name: 'John'
   * }]
   */
  @Prop() data: any[] = [];

  @Element() elm!: HTMLElement;

  /**
   * 空状态描述文本
   * @prop {string} emptyStateDescription
   * @default 'There are no items to display'
   */
  @Prop({ mutable: true }) emptyStateDescription: string =
    'There are no items to display';

  /**
   * 空状态标题文本
   * @prop {string} emptyStateHeadline
   * @default 'No items'
   */
  @Prop({ mutable: true }) emptyStateHeadline: string = 'No items';

  /**
   * 行数据唯一标识字段名
   * @prop {string} keyField
   * @default 'id'
   */
  @Prop() keyField: string = 'id';

  /**
   * 组件视觉层级（影响阴影和z-index）
   * @prop {'01' | '02' | 'background'} [layer]
   * - '01': 基础层级（默认）
   * - '02': 中层（用于悬浮元素）
   * - 'background': 底层（无阴影）
   */
  @Prop({ reflect: true }) layer?: '01' | '02' | 'background';

  /**
   * 是否为托管模式（外部控制分页/排序）
   * @prop {boolean} managed
   * @default false
   * @desc
   * true: 外部控制数据（需监听事件处理分页/排序）
   * false: 组件内部处理分页/排序
   */
  @Prop() managed: boolean = false;

  @State() private hoveredCell: any = {};

  // 节流处理的单元格悬停事件
  onCellMouseOver = throttle((row: any, column: any) => {
    this.hoveredCell = { column, row };
  }, 30);

  /**
   * 当前页码
   * @prop {number} page
   * @default 1
   */
  @Prop() page: number = 1;

  /**
   * 每页显示条数
   * @prop {number} pageSize
   * @default 10
   */
  @Prop() pageSize: number = 10;

  /**
   * 是否启用分页
   * @prop {boolean} paginate
   * @default true
   */
  @Prop() paginate: boolean = true;

  /**
   * 已选中的行key数组
   * @prop {string[]} selectedRowKeys
   */
  @Prop({ mutable: true }) selectedRowKeys: string[] = [];

  /**
   * 行选择类型
   * @prop {'checkbox' | undefined} [selectionType]
   * - 'checkbox': 显示多选框列
   * - undefined: 无选择功能
   */
  @Prop() selectionType: 'checkbox' | undefined;

  /**
   * 是否启用排序
   * @prop {boolean} sortable
   * @default true
   */
  @Prop() sortable: boolean = true;

  /**
   * 当前排序字段
   * @prop {string} [sortBy]
   */
  @Prop({ mutable: true }) sortBy: string;

  /**
   * 排序方向
   * @prop {'asc' | 'desc'} [sortOrder]
   * - 'asc': 升序（A-Z/0-9）
   * - 'desc': 降序（Z-A/9-0）
   * @default 'asc'
   */
  @Prop({ mutable: true }) sortOrder: 'asc' | 'desc' = 'asc';

  /**
   * 数据总条数（托管模式下必传）
   * @prop {number} [totalItems]
   */
  @Prop({ mutable: true }) totalItems;

  /**
   * 单元格点击事件
   * @event zane-table--cell-click
   * @param {Object} detail - 事件详情
   * @param {boolean} detail.altKey  - 是否按下Alt键
   * @param {Object} detail.column  - 列配置对象
   * @param {boolean} detail.ctrlKey  - 是否按下Ctrl键
   * @param {boolean} detail.metaKey  - 是否按下Meta键
   * @param {Object} detail.record  - 行数据对象
   * @param {boolean} detail.shiftKey  - 是否按下Shift键
   */
  @Event({ eventName: 'zane-table--cell-click' }) zaneCellClick: EventEmitter;

  /**
   * 分页变更事件
   * @event zane-table--page
   * @param {Object} detail - 事件详情
   * @param {number} detail.page  - 新页码
   * @param {number} detail.pageSize  - 新每页条数
   */
  @Event({ eventName: 'zane-table--page' }) zanePage: EventEmitter;

  /**
   * 选择变更事件
   * @event zane-table--selection-change
   * @param {Object} detail - 事件详情
   * @param {boolean} detail.isSelectAll  - 是否全选
   * @param {string[]} detail.value  - 选中行key数组
   */
  @Event({ eventName: 'zane-table--selection-change' })
  zaneSelectChange: EventEmitter;

  /**
   * 排序事件
   * @event zane-table--sort
   * @param {Object} detail - 事件详情
   * @param {string} detail.sortBy  - 排序字段
   * @param {'asc' | 'desc'} detail.sortOrder  - 排序方向
   */
  @Event({ eventName: 'zane-table--sort' }) zaneSort: EventEmitter;

  @State() private isHorizontallyScrolled: boolean = false;

  @State() private isSelectAll: boolean = false;

  @State() private isSelectAllIntermediate: boolean = false;

  // 获取数据总数（区分托管/非托管模式）
  getTotalItems() {
    let totalItems = this.totalItems;
    if (this.paginate && !this.managed) totalItems = this.data.length;
    return totalItems;
  }

  /**
   * 单元格点击事件处理
   * @param {Object} row - 行数据对象
   * @param {Object} col - 列配置对象
   * @param {MouseEvent} evt - 鼠标事件对象
   */
  onCellClick(row: any, col: any, evt: MouseEvent) {
    this.zaneCellClick.emit({
      altKey: evt.altKey,
      column: col,
      ctrlKey: evt.ctrlKey,
      metaKey: evt.metaKey,
      record: row,
      shiftKey: evt.shiftKey,
    });
  }

  /**
   * 行选择点击处理
   * @param {Object} row - 行数据对象
   * @desc 切换当前行的选中状态并触发选择变更事件
   */
  onRowSelectClick = (row) => {
    let selectedRowKeys = [...this.selectedRowKeys];
    if (selectedRowKeys.includes(row[this.keyField])) {
      this.isSelectAll = false;
      selectedRowKeys = selectedRowKeys.filter(
        (rowId) => rowId !== row[this.keyField],
      );
    } else {
      selectedRowKeys.push(row[this.keyField]);
    }
    this.onSelectChange(selectedRowKeys);
  };

  /**
   * 全选/取消全选处理
   * @desc 切换当前页全选状态并触发选择变更事件
   */
  onSelectAllClick = () => {
    let selectedRowKeys = [];
    this.isSelectAll = !this.isSelectAll;
    if (this.isSelectAll)
      selectedRowKeys = this.data
        .map((row) => row[this.keyField])
        .slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
    this.onSelectChange(selectedRowKeys);
  };

  /**
   * 选择状态变更处理
   * @param {string[]} selectedRowKeys - 新的选中行key数组
   */
  onSelectChange(selectedRowKeys: any) {
    this.selectedRowKeys = selectedRowKeys;
    this.zaneSelectChange.emit({
      isSelectAll: this.isSelectAll,
      value: this.selectedRowKeys,
    });
  }

  /**
   * 主渲染方法
   * @returns {JSX.Element} 组件JSX结构
   */
  render() {
    return (
      <Host>
        <div
          class={{
            'horizontal-scrolled': this.isHorizontallyScrolled,
            paginate: this.paginate,
            sortable: this.sortable,
            table: true,
          }}
        >
          <div
            class="table-scroll-container"
            onScroll={(event) => {
              this.isHorizontallyScrolled = !!(event.target as any).scrollLeft;
            }}
          >
            {this.renderHeader()}
            {this.data.length > 0 ? this.renderBody() : this.renderEmptyState()}
          </div>
          <div class="table-footer">{this.renderPagination()}</div>
        </div>
      </Host>
    );
  }

  /**
   * 渲染表格主体
   * @returns {JSX.Element} 表格行JSX结构
   * @desc 处理排序/分页逻辑，区分固定列和滚动列
   */
  renderBody() {
    const rows = [];

    let data = [...this.data];

    if (!this.managed) {
      if (this.sortable && this.sortBy) {
        data = data.sort((a, b) => {
          if (a[this.sortBy] < b[this.sortBy])
            return this.sortOrder === 'asc' ? -1 : 1;
          if (a[this.sortBy] > b[this.sortBy])
            return this.sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }
      if (this.paginate) {
        data = data.slice(
          (this.page - 1) * this.pageSize,
          this.page * this.pageSize,
        );
      }
    }

    data.forEach((row) => {
      const fixedCols = [];
      const scrollCols = [];

      if (this.selectionType === 'checkbox')
        fixedCols.push(
          <div class={{ center: true, col: true, 'col-checkbox': true }}>
            <div class="col-content">
              <zane-checkbox
                class="checkbox"
                layer={getNextLayer(this.layer)}
                onZane-checkbox--change={() => this.onRowSelectClick(row)}
                value={this.selectedRowKeys.includes(row[this.keyField])}
              />
            </div>
          </div>,
        );

      this.columns.forEach((column) => {
        let colWidth = DEFAULT_CELL_WIDTH;
        if (column.width) colWidth = Number.parseInt(column.width);
        const colEl = (
          <div
            class={{
              col: true,
              'col-hover':
                this.hoveredCell.row === row &&
                this.hoveredCell.column === column,
            }}
            onClick={(evt: MouseEvent) => {
              const selection = window.getSelection();
              if (selection.type !== 'Range')
                this.onCellClick(row, column, evt);
            }}
            onKeyDown={(event) => {
              if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
                const elem: any = event.target;
                window.navigator.clipboard.writeText(elem.innerText);
              }
            }}
            onMouseOver={() => {
              this.onCellMouseOver(row, column);
            }}
            style={{ width: `${colWidth}rem` }}
            tabindex="1"
          >
            <div class="col-content">
              {(() => {
                return column.template ? (
                  <div
                    class="col-template"
                    innerHTML={column.template(row, column)}
                  ></div>
                ) : (
                  <div class="col-text" title={row?.[column.name]}>
                    {row?.[column.name]}
                  </div>
                );
              })()}
            </div>
          </div>
        );

        column.fixed ? fixedCols.push(colEl) : scrollCols.push(colEl);
      });
      rows.push(
        <div class={{ row: true, 'row-hover': this.hoveredCell.row === row }}>
          <div class="fixed-columns columns-container">{fixedCols}</div>
          <div class="scrollable-columns columns-container">{scrollCols}</div>
        </div>,
      );
    });

    return <div class="body">{rows}</div>;
  }

  /**
   * 渲染表头
   * @returns {JSX.Element} 表头JSX结构
   * @desc 生成带排序按钮的表头列
   */
  renderHeader() {
    const fixedCols = [];
    const scrollCols = [];

    if (this.selectionType === 'checkbox') {
      fixedCols.push(
        <div class="col col-checkbox center">
          <div class="col-content">
            <zane-checkbox
              class="checkbox"
              intermediate={this.isSelectAllIntermediate}
              layer={'01'}
              onZane-checkbox--change={this.onSelectAllClick}
              value={this.isSelectAll}
            />
          </div>
        </div>,
      );
    }
    this.columns.forEach((col) => {
      let colWidth = DEFAULT_CELL_WIDTH;
      if (col.width) colWidth = Number.parseInt(col.width);
      const colEl = (
        <div
          class={{ col: true, sort: this.sortBy === col.name }}
          style={{ width: `${colWidth}rem` }}
        >
          <div class="col-content">
            <div class="col-text">{col.label}</div>
            <div class="col-actions">
              {(() => {
                if (!this.sortable) return;
                let icon = 'arrows--vertical';
                if (this.sortBy === col.name) {
                  icon = this.sortOrder === 'asc' ? 'arrow--up' : 'arrow--down';
                }
                return (
                  <zane-button
                    class="col-action"
                    color="secondary"
                    dark-mode-color="white"
                    icon={icon}
                    onClick={() => {
                      if (this.sortBy === col.name) {
                        if (this.sortOrder === 'asc') this.sortOrder = 'desc';
                        else this.sortBy = null;
                      } else {
                        this.sortBy = col.name;
                        this.sortOrder = 'asc';
                      }
                      this.zaneSort.emit({
                        sortBy: this.sortBy,
                        sortOrder: this.sortOrder,
                      });
                    }}
                    variant="ghost"
                  />
                );
              })()}
            </div>
          </div>
        </div>
      );
      col.fixed ? fixedCols.push(colEl) : scrollCols.push(colEl);
    });

    return (
      <div class="header">
        <div class="row">
          <div class="fixed-columns columns-container">{fixedCols}</div>
          <div class="scrollable-columns columns-container">{scrollCols}</div>
        </div>
      </div>
    );
  }

  /**
   * 渲染分页组件
   * @returns {JSX.Element | undefined} 分页器JSX结构
   * @desc 包含页大小选择器和页码导航
   */
  renderPagination() {
    if (this.paginate)
      return (
        <div class="pagination">
          <div class="page-sizes-select">
            <zane-select
              class="select"
              inline={true}
              items={SUPPORTED_PAGE_SIZES}
              label="Items per page:"
              layer={getNextLayer(this.layer)}
              onZane-select--change={(e) => {
                this.pageSize = e.detail.value;
                this.zanePage.emit({
                  page: this.page,
                  pageSize: this.pageSize,
                });
              }}
              placements="top-start"
              value={this.pageSize}
            />
          </div>
          <div class="pagination-item-count">
            <zane-text color="secondary" inline>
              {this.pageSize * (this.page - 1)} -{' '}
              {Math.min(this.pageSize * this.page, this.getTotalItems())} of{' '}
              {this.getTotalItems()} items
            </zane-text>
          </div>
          <div class="pagination-right">
            <div class="table-footer-right-content">
              <div class="table-footer-right-content-pagination">
                <zane-button
                  class="arrows"
                  color="secondary"
                  dark-mode-color="light"
                  disabled={this.page === 1}
                  icon="arrow--left"
                  onClick={() => {
                    this.page = this.page - 1;
                    this.zanePage.emit({
                      page: this.page,
                      pageSize: this.pageSize,
                    });
                  }}
                  variant="ghost"
                />
                <zane-button
                  class="arrows"
                  color="secondary"
                  dark-mode-color="light"
                  disabled={this.pageSize * this.page >= this.getTotalItems()}
                  icon="arrow--right"
                  onClick={() => {
                    this.page = this.page + 1;
                    this.zanePage.emit({
                      page: this.page,
                      pageSize: this.pageSize,
                    });
                  }}
                  variant="ghost"
                />
              </div>
            </div>
          </div>
        </div>
      );
  }

  /**
   * 渲染空状态
   * @returns {JSX.Element} 空状态JSX结构
   */
  private renderEmptyState() {
    return (
      <div class="empty-table">
        <zane-empty-state
          class="empty-state content-center"
          description={this.emptyStateDescription}
          headline={this.emptyStateHeadline}
        />
      </div>
    );
  }
}
