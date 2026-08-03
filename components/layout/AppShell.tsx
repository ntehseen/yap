import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { Search } from 'lucide-react';
import atoms from '@/util/atoms';
import AddNewPost from '@/components/header/AddNewPost';
import HeaderSearchWindow from '@/components/header/HeaderSearchWindow';
import HeartNotificationsWindow from '@/components/header/HeartNotificationsWindow';
import DarkModeButton from '@/components/header/DarkModeButton';
import useCheckUserName from '@/hooks/useCheckUserName';
import useHandleSignOut from '@/hooks/useHandleSignOut';
import useHandleAvatarDropDown from '@/hooks/useHandleAvatarDropDown';
import useHandleHeartDropDown from '@/hooks/useHandleHeartDropDown';
import handleResetNewHearts from '@/util/handleResetNewHears';
import ProfilePicSVG from '@/components/svgComps/ProfilePicSVG';
import YappersLogo from '@/components/brand/YappersLogo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SideNav from './SideNav';
import MobileBottomNav from './MobileBottomNav';
import type { ShellPage } from './navItems';

interface AppShellProps {
  page: ShellPage;
  children: React.ReactNode;
  /** Kept for API compat — Threads home has no persistent right rail */
  showRightSidebar?: boolean;
  title?: string;
}

function AppShell({
  page,
  children,
  title = '',
}: AppShellProps) {
  const [userDetails] = useAtom(atoms.userDetails);
  const [newMessage] = useAtom(atoms.newMessage);
  const [userNotifications] = useAtom(atoms.userNotifications);

  const [avatarDropDown, setAvatarDropDown] = React.useState(false);
  const [addPost, setAddPost] = React.useState(false);
  const [nameSearch, setNameSearch] = React.useState('');
  const [searchWindow, setSearchWindow] = React.useState(false);
  const [signUserOut, setSignUserOut] = React.useState(false);
  const [showHeartNotifications, setShowHeartNotifications] =
    React.useState(false);

  const user = useCheckUserName({ nameSearch, queryCharacter: true });
  useHandleSignOut({ signUserOut });
  useHandleAvatarDropDown(setAvatarDropDown);
  useHandleHeartDropDown(setShowHeartNotifications);

  function openSearch() {
    setSearchWindow(true);
  }

  function openCreate() {
    setAddPost(true);
  }

  function openMore() {
    setAvatarDropDown(true);
  }

  function openNotifications() {
    setShowHeartNotifications(true);
    if (userDetails.displayName) {
      handleResetNewHearts(userDetails.displayName);
    }
  }

  return (
    <div className="relative min-h-dvh w-full bg-background text-foreground">
      <SideNav
        page={page}
        onSearch={openSearch}
        onCreate={openCreate}
        onNotifications={openNotifications}
        onMore={openMore}
        hasNewMessage={newMessage}
        hasNewHeart={Boolean(userNotifications.newHeart)}
      />

      {/* Mobile top bar — Threads uses bottom nav primarily; keep minimal top brand */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background px-4 md:hidden">
        <YappersLogo compact />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Search"
          onClick={openSearch}
        >
          <Search className="h-5 w-5" />
        </Button>
      </header>

      <div className="threads-feed-offset">
        <div className="threads-feed-column">
          {title ? (
            <div className="sticky top-0 z-10 flex h-[60px] items-center justify-center border-b border-border bg-[hsl(var(--feed))] max-md:top-14 max-md:bg-background">
              <h1 className="text-[15px] font-semibold">{title}</h1>
            </div>
          ) : null}
          {children}
        </div>
      </div>

      <MobileBottomNav
        page={page}
        onCreate={openCreate}
        onNotifications={openNotifications}
        onSearch={openSearch}
      />

      {searchWindow ? (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/50 md:justify-start md:pl-[76px]">
          <div className="relative h-full w-full max-w-[640px] bg-background p-4 shadow-xl md:bg-[hsl(var(--feed))] md:rounded-b-[24px]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Search</h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchWindow(false);
                  setNameSearch('');
                }}
              >
                Close
              </Button>
            </div>
            <Input
              type="text"
              placeholder="Search"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              autoFocus
              className="h-12 rounded-xl bg-muted text-base"
            />
            <HeaderSearchWindow
              loading={user.checkingUser}
              userDetails={user.queryNotificationsArray}
              searchName={nameSearch}
            />
          </div>
          <button
            type="button"
            className="hidden flex-1 md:block"
            aria-label="Close search"
            onClick={() => {
              setSearchWindow(false);
              setNameSearch('');
            }}
          />
        </div>
      ) : null}

      {showHeartNotifications ? (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/50 pt-16 md:justify-start md:pl-[90px] md:pt-8">
          <div className="relative">
            <HeartNotificationsWindow />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="absolute -top-10 right-0"
              onClick={() => setShowHeartNotifications(false)}
            >
              Close
            </Button>
          </div>
          <button
            type="button"
            className="absolute inset-0 -z-10"
            aria-label="Close notifications"
            onClick={() => setShowHeartNotifications(false)}
          />
        </div>
      ) : null}

      {avatarDropDown ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
          <div className="w-full max-w-sm rounded-t-2xl border border-border bg-popover p-2 text-popover-foreground shadow-lg sm:rounded-2xl">
            <div className="flex items-center justify-between px-3 py-2">
              <p className="text-sm font-semibold">More</p>
              <DarkModeButton />
            </div>
            <Link
              href={`/${userDetails.displayName}`}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-muted"
            >
              {userDetails.photoURL ? (
                <Image
                  className="h-8 w-8 rounded-full object-cover"
                  src={userDetails.photoURL}
                  alt=""
                  width={32}
                  height={32}
                />
              ) : (
                <div className="h-8 w-8">
                  <ProfilePicSVG strokeWidth="1.5" />
                </div>
              )}
              Profile
            </Link>
            <Link
              href="/Explore"
              className="block rounded-xl px-3 py-3 text-sm hover:bg-muted"
            >
              Explore players
            </Link>
            <button
              type="button"
              className="w-full rounded-xl px-3 py-3 text-left text-sm hover:bg-muted"
              onClick={() => setSignUserOut(true)}
            >
              Log out
            </button>
            <Button
              type="button"
              variant="ghost"
              className="mt-1 w-full rounded-xl"
              onClick={() => setAvatarDropDown(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      {addPost ? <AddNewPost setAddPost={setAddPost} /> : null}
    </div>
  );
}

export default AppShell;
