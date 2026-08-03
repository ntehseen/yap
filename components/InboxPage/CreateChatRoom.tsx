import React from 'react';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { Search, X } from 'lucide-react';
import ProfilePicSVG from '../svgComps/ProfilePicSVG';
import atoms, { notificationTypes } from '../../util/atoms';
import handleCheckChatRoomExists from '../../util/handleCheckChatRoomExists';
import handleCreateChatRoom from '../../util/handleCreateChatRoom';
import { cn } from '@/lib/utils';

interface Props {
  setCreateChatRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreateChatRoom({ setCreateChatRoom }: Props) {
  const [userNotifications] = useAtom(atoms.userNotifications);

  const [search, setSearch] = React.useState('');
  const [error, setError] = React.useState('');
  const [searchedUser, setSearchedUser] = React.useState(false);
  const [ticked, setTicked] = React.useState(false);
  const [searchedUserData, setSearchedUserData] =
    React.useState<notificationTypes>({});

  function runSearch(e: React.SyntheticEvent) {
    handleCheckChatRoomExists({
      e,
      search,
      setError,
      setSearchedUser,
      setSearchedUserData,
      userNotifications,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center">
      <div className="w-full max-w-[400px] rounded-t-2xl border border-border bg-popover text-popover-foreground shadow-xl sm:rounded-2xl">
        <div className="flex h-[60px] items-center justify-between border-b border-white/[0.08] px-4">
          <button
            type="button"
            className="rounded-full p-1.5 text-foreground hover:bg-muted"
            onClick={() => setCreateChatRoom(false)}
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <p className="text-[15px] font-semibold">New message</p>
          <button
            type="button"
            className={cn(
              'text-[15px] font-semibold',
              ticked
                ? 'text-foreground'
                : 'pointer-events-none text-muted-foreground/40'
            )}
            onClick={() => {
              handleCreateChatRoom({
                userNotifications,
                searchedUserData,
                setCreateChatRoom,
                setError,
                setSearchedUser,
              });
            }}
          >
            Create
          </button>
        </div>

        <form
          className="flex items-center gap-2 border-b border-white/[0.08] px-4 py-3"
          onSubmit={(e) => {
            e.preventDefault();
            runSearch(e);
          }}
        >
          <span className="text-[15px] font-semibold text-foreground">To:</span>
          <input
            className="min-w-0 flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="rounded-full p-1.5 text-muted-foreground hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </form>

        <div className="min-h-[160px] p-3">
          {searchedUser ? (
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 hover:bg-muted"
              onClick={() => setTicked((v) => !v)}
            >
              {searchedUserData.avatarURL ? (
                <Image
                  className="h-11 w-11 rounded-full object-cover"
                  src={searchedUserData.avatarURL}
                  alt=""
                  width={44}
                  height={44}
                />
              ) : (
                <div className="h-11 w-11">
                  <ProfilePicSVG strokeWidth="1.5" />
                </div>
              )}
              <span className="flex-1 text-left text-[15px] font-semibold">
                {searchedUserData?.username}
              </span>
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full border',
                  ticked
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-muted-foreground'
                )}
              >
                {ticked ? '✓' : null}
              </span>
            </button>
          ) : error ? (
            <p className="px-2 py-3 text-[13px] text-destructive">{error}</p>
          ) : (
            <p className="px-2 py-3 text-[13px] text-muted-foreground">
              Search for a username to start chatting.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateChatRoom;
