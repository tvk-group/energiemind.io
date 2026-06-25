interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: string;
}

export default function StatCard({ label, value, change, trend, icon }: StatCardProps) {
  return (
    <div className="panel-stat-card">
      <div className="panel-stat-header">
        <span className="panel-stat-label">{label}</span>
        {icon && <span className="panel-stat-icon">{icon}</span>}
      </div>
      <div className="panel-stat-value">{value}</div>
      {change && (
        <div className={`panel-stat-change trend-${trend || "neutral"}`}>
          {change}
        </div>
      )}
    </div>
  );
}
