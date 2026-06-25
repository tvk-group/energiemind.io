interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

export default function DataTable<T extends object>({
  columns,
  data,
  emptyMessage = "No data available",
}: {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}) {
  if (data.length === 0) {
    return <div className="panel-empty">{emptyMessage}</div>;
  }

  return (
    <div className="panel-table-wrap">
      <table className="panel-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={String(col.key)}>
                  {col.render
                    ? col.render(row)
                    : String(row[col.key as keyof T] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
