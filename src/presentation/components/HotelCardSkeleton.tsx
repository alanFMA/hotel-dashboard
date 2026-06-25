export function HotelCardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando hotel"
      className="animate-pulse overflow-hidden rounded-lg border border-border bg-surface shadow-card"
    >
      <div className="aspect-video w-full bg-slate-200 dark:bg-slate-700" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-6 w-1/4 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}
