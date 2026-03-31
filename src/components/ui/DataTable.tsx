import type { ReactNode } from "react";

type TableColumn = {
  key: string;
  title: ReactNode;
  align?: "left" | "center" | "right";
};

type TableRow = {
  key: string;
  cells: ReactNode[];
};

export function DataTable({
  columns,
  rows,
  caption,
  emptyState = "Sin datos disponibles",
}: {
  columns: TableColumn[];
  rows: TableRow[];
  caption?: ReactNode;
  emptyState?: ReactNode;
}) {
  const alignToText = (align?: "left" | "center" | "right") => {
    if (align === "center") return "center";
    if (align === "right") return "right";
    return "left";
  };

  return (
    <div className="data-table-shell">
      {caption ? (
        <div className="data-table__caption">
          {caption}
        </div>
      ) : null}
      <div className="data-table__scroll">
        <table className="data-table">
          <thead>
            <tr className="data-table__row">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="data-table__head"
                  data-align={column.align}
                  style={{ textAlign: alignToText(column.align) }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row) => (
                <tr key={row.key} className="data-table__row">
                  {row.cells.map((cell, index) => (
                    <td
                      key={`${row.key}-${columns[index]?.key ?? index}`}
                      className="data-table__cell"
                      data-align={columns[index]?.align}
                      style={{ textAlign: alignToText(columns[index]?.align) }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="data-table-empty"
                >
                  {emptyState}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
