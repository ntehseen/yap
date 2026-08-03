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
    <div className="flex items-center gap-3 border-b border-border px-4 py-4 last:border-b-0">
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
          className="text-sm font-semibold text-foreground hover:underline"
        >
          {userDocs.username}
        </Link>
        {userDocs.bio ? (
          <p className="truncate text-xs text-muted-foreground">{userDocs.bio}</p>
        ) : meta ? (
          <p className="truncate text-xs text-muted-foreground">{meta}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
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

  const [requestMoreUsers, setRequestMoreUsers] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const userExploreArray = useExploreUsers(requestMoreUsers);
  const searchResults = useCheckUserName({
    nameSearch: search,
    queryCharacter: true,
  });

  const searching = search.trim().length > 0;

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

      <div className="border-b border-border px-4 py-4">
        <Input
          type="search"
          placeholder="Search players by username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-muted"
        />
      </div>

      {searching ? (
        <div>
          <p className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Search results
          </p>
          {searchResults.checkingUser ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Searching…
            </p>
          ) : searchResults.queryNotificationsArray.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              No players match “{search.trim()}”
            </p>
          ) : (
            searchResults.queryNotificationsArray
              .filter((u) => u.username !== userDetails.displayName)
              .map((userDocs) => (
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
          <p className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Discover players
          </p>
          {userExploreArray.usersArray.map((userDocs) => (
            <PlayerRow
              key={userDocs.userId || userDocs.username}
              userDocs={userDocs}
              currentUsername={userDetails.displayName || undefined}
            />
          ))}
          {!userExploreArray.moreUsers ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
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
