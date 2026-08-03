import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useAtom } from 'jotai';
import HomePagePost from '../components/homePage/HomePagePost';
import StoryBoard from '../components/homePage/StoryBoard';
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

  if (!userStatus) {
    return <LoadingPage checkingUserRoute={false} />;
  }

  return (
    <AppShell page="Home" showRightSidebar>
      <Head>
        <title>Home • Yap</title>
        <meta
          name="description"
          content="Yap — where the X-Clash community comes to yap."
        />
        <link rel="icon" href="/instagram.png" />
      </Head>

      <div className="sticky top-14 z-20 border-b border-border bg-background/90 backdrop-blur xl:top-0">
        <div className="flex">
          <button
            type="button"
            className={cn(
              'relative flex-1 py-3 text-sm font-medium text-muted-foreground hover:bg-muted/40',
              tab === 'forYou' && 'font-semibold text-foreground'
            )}
            onClick={() => setTab('forYou')}
          >
            For You
            {tab === 'forYou' ? (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full bg-accent" />
            ) : null}
          </button>
          <button
            type="button"
            className={cn(
              'relative flex-1 py-3 text-sm font-medium text-muted-foreground hover:bg-muted/40',
              tab === 'following' && 'font-semibold text-foreground'
            )}
            onClick={() => setTab('following')}
          >
            Following
            {tab === 'following' ? (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full bg-accent" />
            ) : null}
          </button>
        </div>
      </div>

      <FeedComposer />

      <div className="border-b border-border">
        <StoryBoard />
      </div>

      <div
        className={`${postsLoading ? 'fixed opacity-0' : ''}`}
        onLoad={() => setPostsLoading(false)}
      >
        {followingArrayStatus ? (
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
      </div>
      {postsLoading ? <LoadingPosts /> : null}
    </AppShell>
  );
};

export default Home;
