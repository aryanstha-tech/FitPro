import { ReactNode } from "react";

export interface DataTableColumn<T> {
  header: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyLabel?: string;
}

export function DataTable<T>({ columns, rows, rowKey, emptyLabel = "No records yet." }: DataTableProps<T>) {
  if (rows.length === 0) {
    return <p className="py-12 text-center text-sm text-ink-muted">{emptyLabel}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-card border border-base-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-base-border text-ink-muted">
            {columns.map((col) => (
              <th key={col.header} className="px-5 py-3 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b border-base-border last:border-0">
              {columns.map((col) => (
                <td key={col.header} className="px-5 py-4 text-ink">
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
