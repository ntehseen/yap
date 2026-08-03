import Link from 'next/link';
import { useAtom } from 'jotai';
import { Home, Search, PlusSquare, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import atoms from '@/util/atoms';
import type { ShellPage } from './navItems';

interface MobileBottomNavProps {
  page: ShellPage;
  onCreate: () => void;
  onNotifications: () => void;
  onSearch: () => void;
}

function MobileBottomNav({
  page,
  onCreate,
  onNotifications,
  onSearch,
}: MobileBottomNavProps) {
  const [userDetails] = useAtom(atoms.userDetails);
  const [userNotifications] = useAtom(atoms.userNotifications);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex h-14 items-center justify-around border-t border-border bg-background px-2 pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Mobile"
    >
      <Link
        href="/"
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground',
          page === 'Home' && 'text-foreground'
        )}
        aria-label="Home"
        aria-current={page === 'Home' ? 'page' : undefined}
      >
        <Home className={cn('h-6 w-6', page === 'Home' && 'stroke-[2.5]')} />
      </Link>

      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground"
        aria-label="Search"
        onClick={onSearch}
      >
        <Search className="h-6 w-6" />
      </button>

      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground"
        onClick={onCreate}
        aria-label="Create"
      >
        <PlusSquare className="h-6 w-6" />
      </button>

      <button
        type="button"
        className="relative flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground"
        aria-label="Activity"
        onClick={onNotifications}
      >
        <Heart className="h-6 w-6" />
        {userNotifications.newHeart ? (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
        ) : null}
      </button>

      <Link
        href={userDetails.displayName ? `/${userDetails.displayName}` : '/'}
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground',
          page === 'Profile' && 'text-foreground'
        )}
        aria-label="Profile"
        aria-current={page === 'Profile' ? 'page' : undefined}
      >
        <User
          className={cn('h-6 w-6', page === 'Profile' && 'stroke-[2.5]')}
        />
      </Link>
    </nav>
  );
}

export default MobileBottomNav;
