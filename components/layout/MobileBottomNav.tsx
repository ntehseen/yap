import Link from 'next/link';
import { useAtom } from 'jotai';
import { Home, Compass, PlusSquare, MessageCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import atoms from '@/util/atoms';
import type { ShellPage } from './navItems';

interface MobileBottomNavProps {
  page: ShellPage;
  onCreate: () => void;
}

function MobileBottomNav({ page, onCreate }: MobileBottomNavProps) {
  const [userDetails] = useAtom(atoms.userDetails);
  const [newMessage] = useAtom(atoms.newMessage);

  const items = [
    { id: 'Home' as const, href: '/', icon: Home, label: 'Home' },
    { id: 'Explore' as const, href: '/Explore', icon: Compass, label: 'Explore' },
    { id: 'Create' as const, label: 'Create', icon: PlusSquare, action: true },
    {
      id: 'Inbox' as const,
      href: '/Inbox',
      icon: MessageCircle,
      label: 'Messages',
    },
    {
      id: 'Profile' as const,
      href: userDetails.displayName ? `/${userDetails.displayName}` : '/',
      icon: User,
      label: 'Profile',
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex h-14 items-center justify-around border-t border-border bg-shell-elevated px-2 pb-[env(safe-area-inset-bottom)] xl:hidden"
      aria-label="Mobile"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = page === item.id;

        if ('action' in item && item.action) {
          return (
            <button
              key={item.label}
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full text-foreground"
              onClick={onCreate}
              aria-label={item.label}
            >
              <Icon className="h-6 w-6" />
            </button>
          );
        }

        return (
          <Link key={item.label} href={item.href!} className={cn(
                'relative flex h-11 w-11 items-center justify-center rounded-full text-foreground',
                active && 'text-accent'
              )} aria-current={active ? 'page' : undefined}>
              <Icon className={cn('h-6 w-6', active && 'stroke-[2.5]')} />
              {item.id === 'Inbox' && newMessage ? (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
              ) : null}
            </Link>
        );
      })}
    </nav>
  );
}

export default MobileBottomNav;
