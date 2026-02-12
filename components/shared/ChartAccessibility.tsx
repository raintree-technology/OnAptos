import type React from "react";

interface ChartColumn {
  key: string;
  header: string;
}

interface ChartAccessibilityProps {
  children: React.ReactNode;
  label: string;
  data: Array<Record<string, string | number>>;
  columns: ChartColumn[];
  summary?: string;
}

export function ChartAccessibility({
  children,
  label,
  data,
  columns,
  summary,
}: ChartAccessibilityProps) {
  return (
    <div role="img" aria-label={label}>
      {children}
      <div className="sr-only">
        {summary && <p>{summary}</p>}
        <table>
          <caption>{label}</caption>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key}>{row[col.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
