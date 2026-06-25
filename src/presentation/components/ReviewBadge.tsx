export interface ReviewBadgeProps {
  score: number;
}

export function ReviewBadge({ score }: ReviewBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-premium-surface px-2 py-1 text-xs font-bold text-premium">
      ★ {score.toFixed(1)}
    </span>
  );
}
