import React from 'react';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { cn } from '@/lib/utils';
import YappersLogo from '@/components/brand/YappersLogo';
import atoms from '@/util/atoms';
import { Button } from '@/components/ui/button';
import {
  moreNavItem,
  primaryNavItems,
  profileNavItem,
  type ShellPage,
} from './navItems';

interface SideNavProps {
  page: ShellPage;
  onSearch: () => void;
  onCreate: () => void;
  onNotifications: () => void;
  onMore: () => void;
  hasNewMessage: boolean;
  hasNewHeart: boolean;
}

function SideNav({
  page,
  onSearch,
  onCreate,
  onNotifications,
  onMore,
  hasNewMessage,
  hasNewHeart,
}: SideNavProps) {
  const [userDetails] = useAtom(atoms.userDetails);
  const items = [...primaryNavItems, profileNavItem(userDetails.displayName)];

  function handleAction(action?: string) {
    if (action === 'search') onSearch();
    if (action === 'create') onCreate();
    if (action === 'notifications') onNotifications();
    if (action === 'more') onMore();
  }

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[244px] flex-col border-r border-border bg-shell-elevated px-3 py-4 xl:flex">
      <div className="mb-8 px-2 pt-2">
        <YappersLogo />
      </div>
      <nav className="flex flex-1 flex-col gap-1" aria-label="Primary">
        {items.map((item) => {
          const Icon = item.icon;
          const active = page === item.id;
          const content = (
            <>
              <span className="relative">
                <Icon
                  className={cn('h-6 w-6', active && 'stroke-[2.5]')}
                  aria-hidden
                />
                {item.id === 'Inbox' && hasNewMessage ? (
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-destructive" />
                ) : null}
                {item.action === 'notifications' && hasNewHeart ? (
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-destructive" />
                ) : null}
              </span>
              <span className="xl:inline">{item.label}</span>
            </>
          );

          if (item.href) {
            return (
              <Link key={item.label} href={item.href} className={cn(
                    'flex items-center gap-4 rounded-lg px-3 py-3 text-sm text-foreground transition-colors hover:bg-muted',
                    active && 'font-semibold'
                  )} aria-current={active ? 'page' : undefined}>
                  {content}
                </Link>
            );
          }

          return (
            <Button
              key={item.label}
              type="button"
              variant="ghost"
              className={cn(
                'h-auto justify-start gap-4 px-3 py-3 text-sm font-normal',
                active && 'font-semibold'
              )}
              onClick={() => handleAction(item.action)}
            >
              {content}
            </Button>
          );
        })}
      </nav>
      <Button
        type="button"
        variant="ghost"
        className="mt-auto h-auto justify-start gap-4 px-3 py-3 text-sm font-normal"
        onClick={() => handleAction(moreNavItem.action)}
      >
        <moreNavItem.icon className="h-6 w-6" aria-hidden />
        <span className="xl:inline">{moreNavItem.label}</span>
      </Button>
    </aside>
  );
}

export default SideNav;
