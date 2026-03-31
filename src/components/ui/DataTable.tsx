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
    <div
      style={{
        overflow: "hidden",
        borderRadius: "1.25rem",
        border: "1px solid hsl(var(--border-default))",
        background: "hsl(var(--bg-surface))",
        boxShadow: "0 18px 40px hsl(var(--shadow-color) / 0.06)",
      }}
    >
      {caption ? (
        <div
          style={{
            padding: "1rem 1.1rem 0.8rem 1.1rem",
            borderBottom: "1px solid hsl(var(--border-default))",
            color: "hsl(var(--text-secondary))",
            fontSize: "0.88rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {caption}
        </div>
      ) : null}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
          }}
        >
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    background: "hsl(var(--bg-surface))",
                    borderBottom: "1px solid hsl(var(--border-default))",
                    padding: "0.95rem 1rem",
                    color: "hsl(var(--text-secondary))",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    textAlign: alignToText(column.align),
                    whiteSpace: "nowrap",
                  }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row) => (
                <tr key={row.key}>
                  {row.cells.map((cell, index) => (
                    <td
                      key={`${row.key}-${columns[index]?.key ?? index}`}
                      style={{
                        borderBottom: "1px solid hsl(var(--border-default) / 0.75)",
                        padding: "0.9rem 1rem",
                        color: "hsl(var(--text-primary))",
                        textAlign: alignToText(columns[index]?.align),
                        verticalAlign: "middle",
                      }}
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
                  style={{
                    padding: "1.5rem 1rem",
                    textAlign: "center",
                    color: "hsl(var(--text-muted))",
                  }}
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
