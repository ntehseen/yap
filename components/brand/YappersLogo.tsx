import Link from 'next/link';
import { cn } from '@/lib/utils';

function YappersLogo({
  href = '/',
  className = '',
  compact = false,
}: {
  href?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-baseline gap-0.5 font-semibold tracking-tight text-foreground no-underline',
        className
      )}
      aria-label="Yap home"
    >
      <span
        className={cn(
          'leading-none text-foreground',
          compact ? 'text-[28px]' : 'text-[28px] sm:text-[32px]'
        )}
      >
        Yap
      </span>
      {!compact ? (
        <span className="hidden text-base font-medium text-muted-foreground sm:inline">
          pers
        </span>
      ) : null}
    </Link>
  );
}

export default YappersLogo;
