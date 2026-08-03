import React from 'react';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { cn } from '@/lib/utils';
import YappersLogo from '@/components/brand/YappersLogo';
import atoms from '@/util/atoms';
import {
  moreNavItem,
  primaryNavItems,
  profileNavItem,
  type ShellPage,
  type NavItem,
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

/** Threads desktop rail: 76px, icon-only, vertically centered cluster. */
function SideNav({
  page,
  onSearch,
  onCreate,
  onNotifications,
  onMore,
  hasNewHeart,
}: SideNavProps) {
  const [userDetails] = useAtom(atoms.userDetails);
  const items: NavItem[] = [
    ...primaryNavItems,
    profileNavItem(userDetails.displayName),
  ];

  function handleAction(action?: string) {
    if (action === 'search') onSearch();
    if (action === 'create') onCreate();
    if (action === 'notifications') onNotifications();
    if (action === 'more') onMore();
  }

  function renderItem(item: NavItem) {
    const Icon = item.icon;
    const active = page === item.id;
    const isCreate = item.action === 'create';

    const inner = (
      <span className="relative flex items-center justify-center">
        {isCreate ? (
          <span className="threads-nav-create-box">
            <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </span>
        ) : (
          <Icon
            className={cn('h-6 w-6', active && 'stroke-[2.25]')}
            strokeWidth={active ? 2.25 : 1.75}
            aria-hidden
          />
        )}
        {item.action === 'notifications' && hasNewHeart ? (
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-destructive" />
        ) : null}
      </span>
    );

    const className = cn(
      'threads-nav-btn',
      isCreate && 'threads-nav-create'
    );

    if (item.href) {
      return (
        <Link
          key={item.label}
          href={item.href}
          className={className}
          data-active={active}
          aria-label={item.label}
          aria-current={active ? 'page' : undefined}
          title={item.label}
        >
          {inner}
        </Link>
      );
    }

    return (
      <button
        key={item.label}
        type="button"
        className={className}
        data-active={active}
        onClick={() => handleAction(item.action)}
        aria-label={item.label}
        title={item.label}
      >
        {inner}
      </button>
    );
  }

  return (
    <aside className="threads-rail" aria-label="Primary">
      <div className="flex h-[60px] w-full items-center justify-center pt-1">
        <YappersLogo compact className="scale-90" />
      </div>

      <nav className="flex flex-1 flex-col items-center justify-center gap-1">
        {items.map(renderItem)}
      </nav>

      <div className="flex w-full flex-col items-center pb-3">
        <button
          type="button"
          className="threads-nav-btn"
          onClick={() => handleAction(moreNavItem.action)}
          aria-label={moreNavItem.label}
          title={moreNavItem.label}
        >
          <moreNavItem.icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
        </button>
      </div>
    </aside>
  );
}

export default SideNav;
