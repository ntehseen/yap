import { postType } from '@/util/atoms';
import { yapTypeLabel } from '@/util/yapTypes';

interface Props {
  post: Pick<postType, 'yapType' | 'xClashContext' | 'tags'>;
  compact?: boolean;
}

/** Type badge + optional server/alliance chips for feed and thread. */
export default function YapTypeBadge({ post, compact = false }: Props) {
  const typeLabel = yapTypeLabel(post.yapType);
  const server = post.xClashContext?.server?.trim();
  const alliance = post.xClashContext?.alliance?.trim();
  const tags = post.tags?.filter(Boolean) || [];

  if (!typeLabel && !server && !alliance && tags.length === 0) {
    return null;
  }

  const chip = compact
    ? 'rounded px-1.5 py-0.5 text-[10px] font-medium'
    : 'rounded-full px-2 py-0.5 text-[11px] font-medium';

  return (
    <div className="mt-1 flex flex-wrap items-center gap-1.5">
      {typeLabel ? (
        <span className={`${chip} bg-muted text-foreground`}>{typeLabel}</span>
      ) : null}
      {server ? (
        <span className={`${chip} bg-muted/70 text-muted-foreground`}>
          S{server}
        </span>
      ) : null}
      {alliance ? (
        <span className={`${chip} bg-muted/70 text-muted-foreground`}>
          {alliance}
        </span>
      ) : null}
      {!compact
        ? tags.map((tag) => (
            <span
              key={tag}
              className={`${chip} bg-muted/50 text-muted-foreground`}
            >
              #{tag}
            </span>
          ))
        : null}
    </div>
  );
}
