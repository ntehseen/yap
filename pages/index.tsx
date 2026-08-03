import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useAtom } from 'jotai';
import HomePagePost from '../components/homePage/HomePagePost';
import LoadingPage from '../components/loadingComps/LoadingPage';
import atoms from '../util/atoms';
import LoadingPosts from '../components/loadingComps/LoadingPosts';
import AppShell from '../components/layout/AppShell';
import FeedComposer from '../components/homePage/FeedComposer';
import { cn } from '@/lib/utils';

type FeedTab = 'forYou' | 'following';

const Home: NextPage = () => {
  const [userStatus] = useAtom(atoms.userStatus);
  const [userDetails] = useAtom(atoms.userDetails);
  const [followingArray] = useAtom(atoms.followingArray);
  const [followingArrayStatus] = useAtom(atoms.followingArrayStatus);
  const [postsLoading, setPostsLoading] = useAtom(atoms.postsLoading);
  const [tab, setTab] = React.useState<FeedTab>('forYou');

  // Until a global/For You query exists, For You = you + people you follow.
  const feedUsernames = React.useMemo(() => {
    const following = followingArray.filter((name) => name && name !== 'null');
    if (tab === 'following') {
      return following.length ? following : ['null'];
    }
    const self = userDetails.displayName;
    if (self && !following.includes(self)) {
      return [self, ...following];
    }
    return following.length ? following : self ? [self] : ['null'];
  }, [followingArray, tab, userDetails.displayName]);

  // Avoid the old `fixed opacity-0` image preload hack — it breaks Safari layout.
  React.useEffect(() => {
    if (followingArrayStatus) {
      setPostsLoading(false);
    }
  }, [followingArrayStatus, setPostsLoading]);

  if (!userStatus) {
    return <LoadingPage checkingUserRoute={false} />;
  }

  return (
    <AppShell page="Home">
      <Head>
        <title>Home • Yap</title>
        <meta
          name="description"
          content="Yap — where the X-Clash community comes to yap."
        />
        <link rel="icon" href="/instagram.png" />
      </Head>

      <div className="sticky top-0 z-20 bg-[hsl(var(--feed))] max-md:top-14 max-md:bg-background">
        <div className="flex h-[60px] items-stretch border-b border-white/[0.08]">
          <button
            type="button"
            className={cn(
              'relative flex flex-1 items-center justify-center text-[15px] font-medium text-muted-foreground transition-colors hover:bg-white/[0.03]',
              tab === 'forYou' && 'font-semibold text-foreground'
            )}
            onClick={() => setTab('forYou')}
          >
            For you
            {tab === 'forYou' ? (
              <span className="absolute bottom-0 left-1/2 h-[1.5px] w-14 -translate-x-1/2 bg-foreground" />
            ) : null}
          </button>
          <button
            type="button"
            className={cn(
              'relative flex flex-1 items-center justify-center text-[15px] font-medium text-muted-foreground transition-colors hover:bg-white/[0.03]',
              tab === 'following' && 'font-semibold text-foreground'
            )}
            onClick={() => setTab('following')}
          >
            Following
            {tab === 'following' ? (
              <span className="absolute bottom-0 left-1/2 h-[1.5px] w-16 -translate-x-1/2 bg-foreground" />
            ) : null}
          </button>
        </div>
      </div>

      <FeedComposer />

      {postsLoading || !followingArrayStatus ? <LoadingPosts /> : null}

      {!postsLoading && followingArrayStatus ? (
        <div>
          {feedUsernames.map((username, index) => (
            <HomePagePost
              username={username}
              index={index}
              key={`${tab}-${username}-${index}`}
            />
          ))}
        </div>
      ) : null}
    </AppShell>
  );
};

export default Home;
