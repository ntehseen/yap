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
    <Link href={href} className={cn(
          'inline-flex items-baseline gap-1 font-semibold tracking-tight text-foreground no-underline',
          className
        )} aria-label="Yap home">
        <span className="text-xl text-accent sm:text-2xl">Yap</span>
        {!compact ? (
          <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
            pers
          </span>
        ) : null}
      </Link>
  );
}

export default YappersLogo;
