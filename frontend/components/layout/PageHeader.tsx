"use client";

interface PageHeaderProps {
  section: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ section, title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <span className="badge-command mb-4 inline-block">{section}</span>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-serif font-bold tracking-tight mb-2">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}