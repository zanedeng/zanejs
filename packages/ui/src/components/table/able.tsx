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

const DEFAULT_CELL_WIDTH = 16; // in rem
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

/**
 * @name Table
 * @description A configurable component for displaying tabular data.
 * @category Data Display
 * @img /assets/img/table.webp
 * @imgDark /assets/img/table-dark.webp
 */
@Component({
  shadow: true,
  styleUrl: 'table.scss',
  tag: 'zane-table',
})
export class Table {
  /**
   * Grid columns configuration.
   * [
   * {
   *   "name":"name",
   *   "label":"Name",
   *   "width":300,
   *   "fixed":true,
   *   "template": function(row, column) { return row[column.name];}
   *  },
   * {
   *   "name":"age",
   *   "label":"Age"
   * }
   * ]
   */
  @Prop() columns: any[] = [];

  /**
   * Grid data to display on table
   * [{
   *  'id': '5e7118ddce4b3d577956457f',
   *  'age': 21,
   *  'name': 'John',
   *  'company': 'India',
   *  'email': 'john@example.com',
   *  'phone': '+1 (839) 560-3581',
   *  'address': '326 Irving Street, Grimsley, Texas, 4048'
   *  }]
   */
  @Prop() data: any[] = [];

  @Element() elm!: HTMLElement;

  @Prop({ mutable: true }) emptyStateDescription: string =
    'There are no items to display';

  @Prop({ mutable: true }) emptyStateHeadline: string = 'No items';

  @Prop() keyField: string = 'id';

  @Prop({ reflect: true }) layer?: '01' | '02' | 'background';

  @Prop() managed: boolean = false;

  @State() private hoveredCell: any = {};

  onCellMouseOver = throttle((row: any, column: any) => {
    this.hoveredCell = { column, row };
  }, 30);

  @Prop() page: number = 1;

  @Prop() pageSize: number = 10;

  @Prop() paginate: boolean = true;

  @Prop({ mutable: true }) selectedRowKeys: string[] = [];

  @Prop() selectionType: 'checkbox' | undefined;

  @Prop() sortable: boolean = true;

  @Prop({ mutable: true }) sortBy: string;

  @Prop({ mutable: true }) sortOrder: 'asc' | 'desc' = 'asc';
  @Prop({ mutable: true }) totalItems;
  /**
   * Emitted when a table cell is clicked.
   */
  @Event({ eventName: 'zane-table--cell-click' }) zaneCellClick: EventEmitter;
  /**
   * Emitted when the page changes.
   */
  @Event({ eventName: 'zane-table--page' }) zanePage: EventEmitter;

  /**
   * Emitted when the selection changes.
   */
  @Event({ eventName: 'zane-table--selection-change' })
  zaneSelectChange: EventEmitter;

  /**
   * Emitted when the table is sorted.
   */
  @Event({ eventName: 'zane-table--sort' }) zaneSort: EventEmitter;

  @State() private isHorizontallyScrolled: boolean = false;

  @State() private isSelectAll: boolean = false;

  @State() private isSelectAllIntermediate: boolean = false;

  getTotalItems() {
    let totalItems = this.totalItems;
    if (this.paginate && !this.managed) totalItems = this.data.length;
    return totalItems;
  }

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

  onSelectAllClick = () => {
    let selectedRowKeys = [];
    this.isSelectAll = !this.isSelectAll;
    if (this.isSelectAll)
      selectedRowKeys = this.data
        .map((row) => row[this.keyField])
        .slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
    this.onSelectChange(selectedRowKeys);
  };

  onSelectChange(selectedRowKeys: any) {
    this.selectedRowKeys = selectedRowKeys;
    this.zaneSelectChange.emit({
      isSelectAll: this.isSelectAll,
      value: this.selectedRowKeys,
    });
  }

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
