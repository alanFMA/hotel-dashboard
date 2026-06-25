export interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface p-12 text-center">
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="text-sm text-muted">{description}</p>
    </div>
  );
}
