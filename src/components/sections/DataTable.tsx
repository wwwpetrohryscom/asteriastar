import type { ReactNode } from "react";

export interface DataTableColumn<Row extends Record<string, ReactNode>> {
  key: keyof Row;
  header: ReactNode;
}

export function DataTable<Row extends Record<string, ReactNode>>({
  columns,
  rows,
  caption,
  className = "",
}: {
  columns: DataTableColumn<Row>[];
  rows: Row[];
  caption?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`scientific-card overflow-x-auto ${className}`}>
      <table className="scientific-table min-w-full">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={String(column.key)}>{row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
