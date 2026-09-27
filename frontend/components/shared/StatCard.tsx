"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, unit, sublabel, icon }: StatCardProps) {
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="micro-label">{label}</span>
        {icon}
      </div>
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-3xl font-mono font-semibold tracking-tight data-value">
          {value}
        </span>
        {unit && <span className="text-sm text-muted-foreground font-mono">{unit}</span>}
      </div>
      {sublabel && <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>}
    </div>
  );
}