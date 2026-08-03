import { useAtom } from 'jotai';
import { NextPage } from 'next';
import Image from 'next/image';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import LoadingPage from '../components/loadingComps/LoadingPage';
import atoms, { notificationTypes } from '../util/atoms';
import useExploreUsers from '../hooks/useExploreUsers';
import useCheckUserName from '../hooks/useCheckUserName';
import ProfilePicSVG from '../components/svgComps/ProfilePicSVG';
import AppShell from '../components/layout/AppShell';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function matchesXClashFilter(
  user: notificationTypes,
  serverFilter: string,
  allianceFilter: string
) {
  const serverQ = serverFilter.trim().toLowerCase();
  const allianceQ = allianceFilter.trim().toLowerCase();
  if (serverQ) {
    const s = (user.xClash?.server || '').toLowerCase();
    if (!s.includes(serverQ)) return false;
  }
  if (allianceQ) {
    const a = (user.xClash?.alliance || '').toLowerCase();
    if (!a.includes(allianceQ)) return false;
  }
  return true;
}

function PlayerRow({
  userDocs,
  currentUsername,
}: {
  userDocs: notificationTypes;
  currentUsername?: string;
}) {
  const meta = [
    userDocs.xClash?.alliance,
    userDocs.xClash?.server ? `Server ${userDocs.xClash.server}` : '',
    userDocs.xClash?.role,
  ]
    .filter(Boolean)
    .join(' · ');

  const followsYou = Boolean(
    currentUsername && userDocs.followers?.includes(currentUsername)
  );

  return (
    <div className="flex items-center gap-3 border-b border-white/[0.08] px-[25px] py-4 last:border-b-0">
      <Link href={`/${userDocs.username}`} className="shrink-0">
        {userDocs.avatarURL ? (
          <Image
            className="h-12 w-12 rounded-full object-cover"
            src={userDocs.avatarURL}
            alt=""
            width="48"
            height="48"
          />
        ) : (
          <div className="h-12 w-12">
            <ProfilePicSVG strokeWidth="1" />
          </div>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={`/${userDocs.username}`}
          className="text-[15px] font-semibold text-foreground hover:underline"
        >
          {userDocs.username}
        </Link>
        {userDocs.bio ? (
          <p className="truncate text-[13px] text-muted-foreground">
            {userDocs.bio}
          </p>
        ) : meta ? (
          <p className="truncate text-[13px] text-muted-foreground">{meta}</p>
        ) : (
          <p className="text-[13px] text-muted-foreground">
            {userDocs.followers?.length || 0} followers
            {followsYou ? ' · follows you' : ''}
          </p>
        )}
      </div>
      <Button asChild size="sm" variant="outline">
        <Link href={`/${userDocs.username}`}>View</Link>
      </Button>
    </div>
  );
}

const Explore: NextPage = () => {
  const [userStatus] = useAtom(atoms.userStatus);
  const [userDetails] = useAtom(atoms.userDetails);
  const [userNotifications] = useAtom(atoms.userNotifications);

  const [requestMoreUsers, setRequestMoreUsers] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [serverFilter, setServerFilter] = React.useState('');
  const [allianceFilter, setAllianceFilter] = React.useState('');

  const userExploreArray = useExploreUsers(requestMoreUsers);
  const searchResults = useCheckUserName({
    nameSearch: search,
    queryCharacter: true,
  });

  const searching = search.trim().length > 0;
  const myServer = userNotifications.xClash?.server?.trim();

  const filteredSearch = searchResults.queryNotificationsArray.filter(
    (u) =>
      u.username !== userDetails.displayName &&
      matchesXClashFilter(u, serverFilter, allianceFilter)
  );

  const filteredDiscover = userExploreArray.usersArray.filter(
    (u) =>
      u.username !== userDetails.displayName &&
      matchesXClashFilter(u, serverFilter, allianceFilter)
  );

  if (!userStatus) {
    return <LoadingPage checkingUserRoute={false} />;
  }

  if (userStatus && userExploreArray.firstFetch) {
    return <LoadingPage checkingUserRoute />;
  }

  return (
    <AppShell page="Explore" title="Explore">
      <Head>
        <title>Explore • Yap</title>
        <meta
          name="description"
          content="Explore players on Yap — the X-Clash community."
        />
        <link rel="icon" href="/instagram.png" />
      </Head>

      <div className="space-y-3 border-b border-white/[0.08] px-[25px] py-4">
        <Input
          type="search"
          placeholder="Search players by username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-muted"
        />
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={serverFilter}
            onChange={(e) => setServerFilter(e.target.value)}
            placeholder="Filter server"
            className="h-8 w-[110px] rounded-[10px] border border-white/[0.12] bg-transparent px-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <input
            type="text"
            value={allianceFilter}
            onChange={(e) => setAllianceFilter(e.target.value)}
            placeholder="Filter alliance"
            className="h-8 min-w-[130px] flex-1 rounded-[10px] border border-white/[0.12] bg-transparent px-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {myServer ? (
            <button
              type="button"
              className={cn(
                'h-8 rounded-full px-3 text-[12px] font-medium',
                serverFilter.toLowerCase() === myServer.toLowerCase()
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
              onClick={() =>
                setServerFilter((prev) =>
                  prev.toLowerCase() === myServer.toLowerCase() ? '' : myServer
                )
              }
            >
              My server ({myServer})
            </button>
          ) : null}
        </div>
      </div>

      {searching ? (
        <div>
          <p className="px-[25px] py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Search results
          </p>
          {searchResults.checkingUser ? (
            <p className="px-[25px] py-8 text-center text-[13px] text-muted-foreground">
              Searching…
            </p>
          ) : filteredSearch.length === 0 ? (
            <p className="px-[25px] py-8 text-center text-[13px] text-muted-foreground">
              No players match these filters
            </p>
          ) : (
            filteredSearch.map((userDocs) => (
              <PlayerRow
                key={userDocs.userId || userDocs.username}
                userDocs={userDocs}
                currentUsername={userDetails.displayName || undefined}
              />
            ))
          )}
        </div>
      ) : (
        <div>
          <p className="px-[25px] py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Discover players
          </p>
          {filteredDiscover.length === 0 ? (
            <p className="px-[25px] py-8 text-center text-[13px] text-muted-foreground">
              No players match these filters
            </p>
          ) : (
            filteredDiscover.map((userDocs) => (
              <PlayerRow
                key={userDocs.userId || userDocs.username}
                userDocs={userDocs}
                currentUsername={userDetails.displayName || undefined}
              />
            ))
          )}
          {!userExploreArray.moreUsers ? (
            <p className="px-[25px] py-6 text-center text-[13px] text-muted-foreground">
              You&apos;ve reached the end of the list.
            </p>
          ) : (
            <div className="flex justify-center py-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setRequestMoreUsers(!requestMoreUsers)}
              >
                Load more
              </Button>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
};

export default Explore;
