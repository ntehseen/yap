 
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
import RightSidebar from './RightSidebar';
import type { ShellPage } from './navItems';

interface AppShellProps {
  page: ShellPage;
  children: React.ReactNode;
  showRightSidebar?: boolean;
  title?: string;
}

function AppShell({
  page,
  children,
  showRightSidebar = false,
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
    <div className="min-h-screen bg-background text-foreground dark:[color-scheme:dark]">
      <SideNav
        page={page}
        onSearch={openSearch}
        onCreate={openCreate}
        onNotifications={openNotifications}
        onMore={openMore}
        hasNewMessage={newMessage}
        hasNewHeart={Boolean(userNotifications.newHeart)}
      />

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-shell-elevated px-4 xl:hidden">
        <YappersLogo compact />
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Search"
            onClick={openSearch}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            onClick={openNotifications}
          >
            <span className="relative">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-none stroke-current stroke-2"
                aria-hidden
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {userNotifications.newHeart ? (
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-destructive" />
              ) : null}
            </span>
          </Button>
        </div>
      </header>

      <div className="xl:pl-[244px]">
        <div className="mx-auto flex w-full max-w-[1200px] justify-center gap-0 px-0 pb-20 xl:pb-6">
          <main className="w-full min-w-0 max-w-feed flex-1">
            {title ? (
              <div className="hidden border-b border-border px-4 py-3 xl:block">
                <h1 className="text-xl font-semibold">{title}</h1>
              </div>
            ) : null}
            {children}
          </main>
          {showRightSidebar ? <RightSidebar /> : null}
        </div>
      </div>

      <MobileBottomNav page={page} onCreate={openCreate} />

      {searchWindow ? (
        <div className="fixed inset-0 z-50 flex justify-start bg-black/40">
          <div className="relative h-full w-full max-w-md border-r border-border bg-shell-elevated p-4 shadow-xl xl:ml-[244px]">
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
            <div className="relative">
              <Input
                type="text"
                placeholder="Search users"
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                 
                autoFocus
              />
              <HeaderSearchWindow
                loading={user.checkingUser}
                userDetails={user.queryNotificationsArray}
                searchName={nameSearch}
              />
            </div>
          </div>
          <button
            type="button"
            className="flex-1"
            aria-label="Close search"
            onClick={() => {
              setSearchWindow(false);
              setNameSearch('');
            }}
          />
        </div>
      ) : null}

      {showHeartNotifications ? (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/40 pt-16 xl:justify-start xl:pl-[280px] xl:pt-8">
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
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="w-full max-w-sm rounded-t-xl border border-border bg-popover p-2 text-popover-foreground shadow-lg sm:rounded-xl">
            <div className="flex items-center justify-between px-3 py-2">
              <p className="text-sm font-semibold">More</p>
              <DarkModeButton />
            </div>
            <Link href={`/${userDetails.displayName}`} className="flex items-center gap-3 rounded-md px-3 py-3 text-sm hover:bg-muted">
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
            <Link href="/Explore" className="block rounded-md px-3 py-3 text-sm hover:bg-muted">
                Explore players
              </Link>
            <button
              type="button"
              className="w-full rounded-md px-3 py-3 text-left text-sm hover:bg-muted"
              onClick={() => setSignUserOut(true)}
            >
              Log out
            </button>
            <Button
              type="button"
              variant="ghost"
              className="mt-1 w-full"
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
