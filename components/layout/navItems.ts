import { Home, Search, PlusSquare, Heart, User, Menu, Compass, MessageCircle, type LucideIcon } from 'lucide-react';

export type ShellPage =
  | 'Home'
  | 'Explore'
  | 'Inbox'
  | 'Profile'
  | 'Search'
  | 'Notifications'
  | 'Create'
  | '';

export interface NavItem {
  id: ShellPage;
  label: string;
  href?: string;
  icon: LucideIcon;
  action?: 'search' | 'create' | 'notifications' | 'more';
}

/** Threads-primary order: Home → Search → Create → Activity → Profile */
export const primaryNavItems: NavItem[] = [
  { id: 'Home', label: 'Home', href: '/', icon: Home },
  { id: 'Search', label: 'Search', icon: Search, action: 'search' },
  { id: 'Create', label: 'Create', icon: PlusSquare, action: 'create' },
  {
    id: 'Notifications',
    label: 'Activity',
    icon: Heart,
    action: 'notifications',
  },
];

export const secondaryNavItems: NavItem[] = [
  { id: 'Explore', label: 'Explore', href: '/Explore', icon: Compass },
  { id: 'Inbox', label: 'Messages', href: '/Inbox', icon: MessageCircle },
];

export const moreNavItem: NavItem = {
  id: '',
  label: 'More',
  icon: Menu,
  action: 'more',
};

export function profileNavItem(username?: string | null): NavItem {
  return {
    id: 'Profile',
    label: 'Profile',
    href: username ? `/${username}` : '/',
    icon: User,
  };
}
