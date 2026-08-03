/** Threads-style relative timestamps (e.g. 12h, 3d). */
export default function formatRelativeTime(
  createdAt: { seconds?: number } | string | undefined
): string {
  let ms: number | null = null;

  if (createdAt && typeof createdAt === 'object' && createdAt.seconds) {
    ms = createdAt.seconds * 1000;
  } else if (typeof createdAt === 'string' && createdAt) {
    const parsed = Date.parse(createdAt);
    if (!Number.isNaN(parsed)) ms = parsed;
  }

  if (!ms) return '';

  const diffSec = Math.max(0, Math.floor((Date.now() - ms) / 1000));
  if (diffSec < 60) return `${diffSec || 1}s`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d`;
  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 5) return `${diffWeek}w`;
  return new Date(ms).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}
