import { Home, Compass, Search, PlusSquare, Heart, MessageCircle, User, MoreHorizontal, type LucideIcon } from 'lucide-react';

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

export const primaryNavItems: NavItem[] = [
  { id: 'Home', label: 'Home', href: '/', icon: Home },
  { id: 'Explore', label: 'Explore', href: '/Explore', icon: Compass },
  { id: 'Search', label: 'Search', icon: Search, action: 'search' },
  { id: 'Create', label: 'Create', icon: PlusSquare, action: 'create' },
  {
    id: 'Notifications',
    label: 'Notifications',
    icon: Heart,
    action: 'notifications',
  },
  { id: 'Inbox', label: 'Messages', href: '/Inbox', icon: MessageCircle },
];

export const moreNavItem: NavItem = {
  id: '',
  label: 'More',
  icon: MoreHorizontal,
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
