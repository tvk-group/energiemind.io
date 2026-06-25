"use client";

interface ChartBar {
  label: string;
  value: number;
}

export default function SimpleBarChart({
  data,
  label,
  unit = "",
  color = "var(--color-accent)",
}: {
  data: ChartBar[];
  label: string;
  unit?: string;
  color?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="panel-chart">
      <h3 className="panel-chart-title">{label}</h3>
      <div className="panel-chart-bars">
        {data.map((d, i) => (
          <div key={i} className="panel-chart-bar-group">
            <div
              className="panel-chart-bar"
              style={{
                height: `${(d.value / max) * 100}%`,
                background: color,
              }}
              title={`${d.label}: ${d.value}${unit}`}
            />
            <span className="panel-chart-label">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
