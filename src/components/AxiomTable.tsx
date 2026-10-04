import React, { useMemo, useState } from 'react';
import { Pause, Play, Search, X } from 'lucide-react';

export interface AxiomTableColumn<T> {
  key: string;
  header: React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render: (item: T, index: number) => React.ReactNode;
}

export interface AxiomTableBulkAction<T> {
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'warning' | 'danger' | 'default';
  onClick: (selectedItems: T[], clearSelection: () => void) => void;
}

export interface AxiomTableProps<T> {
  data: T[];
  columns: AxiomTableColumn<T>[];
  keyExtractor: (item: T) => string;
  searchFilterPlaceholder?: string;
  filterPredicate?: (item: T, searchFilter: string) => boolean;
  onRowClick?: (item: T) => void;
  enableSelection?: boolean;
  bulkActions?: AxiomTableBulkAction<T>[];
  onRunSelected?: (selectedItems: T[], clearSelection: () => void) => void;
  onPauseSelected?: (selectedItems: T[], clearSelection: () => void) => void;
  emptyMessage?: string;
  className?: string;
}

export function AxiomTable<T>({
  data,
  columns,
  keyExtractor,
  searchFilterPlaceholder = 'Search & filter rows by name or status...',
  filterPredicate,
  onRowClick,
  enableSelection = true,
  bulkActions,
  onRunSelected,
  onPauseSelected,
  emptyMessage,
  className = '',
}: AxiomTableProps<T>): React.ReactElement {
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    if (!searchFilter.trim()) return data;
    const query = searchFilter.toLowerCase().trim();
    if (filterPredicate) {
      return data.filter((item) => filterPredicate(item, query));
    }
    // Default fallback search across all primitive values
    return data.filter((item) => {
      const serialized = JSON.stringify(item).toLowerCase();
      return serialized.includes(query);
    });
  }, [data, searchFilter, filterPredicate]);

  const isAllSelected =
    filteredData.length > 0 &&
    filteredData.every((item) => selectedIds.includes(keyExtractor(item)));

  const isPartiallySelected =
    selectedIds.length > 0 && !isAllSelected;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(keyExtractor));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const clearSelection = () => setSelectedIds([]);

  const selectedItems = useMemo(() => {
    const set = new Set(selectedIds);
    return data.filter((item) => set.has(keyExtractor(item)));
  }, [data, selectedIds, keyExtractor]);

  return (
    <div className={`axiom-table-container ${className}`}>
      {/* Top Filter and Bulk Operations Bar */}
      <div className="axiom-table-toolbar">
        <div className="axiom-table-filter">
          <Search size={13} className="absolute left-2.5 text-[#5E6975]" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={searchFilterPlaceholder}
            aria-label="Filter table contents"
          />
          {searchFilter && (
            <button
              type="button"
              onClick={() => setSearchFilter('')}
              className="absolute right-2 text-[#5E6975] hover:text-[#182536]"
              title="Clear search filter"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {selectedIds.length > 0 ? (
          <div className="axiom-bulk-bar">
            <span>
              <b>{selectedIds.length}</b> selected
            </span>

            {onRunSelected && (
              <button
                type="button"
                onClick={() => onRunSelected(selectedItems, clearSelection)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#08795F] hover:bg-[#065b48] text-white text-[10px] font-semibold rounded-[2px] transition-colors cursor-pointer"
              >
                <Play size={10} />
                <span>Run Selected</span>
              </button>
            )}

            {onPauseSelected && (
              <button
                type="button"
                onClick={() => onPauseSelected(selectedItems, clearSelection)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#9A6900] hover:bg-[#7a5300] text-white text-[10px] font-semibold rounded-[2px] transition-colors cursor-pointer"
              >
                <Pause size={10} />
                <span>Pause Selected</span>
              </button>
            )}

            {bulkActions?.map((action, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => action.onClick(selectedItems, clearSelection)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#334256] hover:bg-[#182536] text-white text-[10px] font-semibold rounded-[2px] transition-colors cursor-pointer"
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}

            <button
              type="button"
              onClick={clearSelection}
              className="text-slate-300 hover:text-white underline text-[10px] ml-1 cursor-pointer"
            >
              Clear
            </button>
          </div>
        ) : (
          <div className="text-xs font-mono text-[#5E6975]">
            {filteredData.length} of {data.length} records matching
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="axiom-table">
          <thead>
            <tr>
              {enableSelection && (
                <th className="w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isPartiallySelected;
                    }}
                    onChange={handleToggleSelectAll}
                    aria-label="Select all table rows"
                    className="rounded-[2px] border-[#D5D5CE] text-[#182536] focus:ring-0 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={
                    col.align === 'center'
                      ? 'text-center'
                      : col.align === 'right'
                      ? 'text-right'
                      : 'text-left'
                  }
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (enableSelection ? 1 : 0)}
                  className="text-center py-8 text-xs text-[#5E6975] font-mono"
                >
                  {emptyMessage || `No matching records found for "${searchFilter}".`}
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => {
                const id = keyExtractor(item);
                const isSelected = selectedIds.includes(id);

                return (
                  <tr
                    key={id}
                    onClick={() => {
                      if (onRowClick) onRowClick(item);
                      else if (enableSelection) handleToggleSelectRow(id);
                    }}
                    className={`${onRowClick || enableSelection ? 'cursor-pointer' : ''} ${
                      isSelected ? 'is-selected' : ''
                    }`}
                  >
                    {enableSelection && (
                      <td
                        className="text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(id)}
                          aria-label={`Select row ${id}`}
                          className="rounded-[2px] border-[#D5D5CE] text-[#182536] focus:ring-0 cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={
                          col.align === 'center'
                            ? 'text-center'
                            : col.align === 'right'
                            ? 'text-right'
                            : 'text-left'
                        }
                      >
                        {col.render(item, index)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
