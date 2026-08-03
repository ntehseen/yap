 
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

const Home: NextPage = () => {
  const [userStatus] = useAtom(atoms.userStatus);
  const [followingArray] = useAtom(atoms.followingArray);
  const [followingArrayStatus] = useAtom(atoms.followingArrayStatus);
  const [postsLoading, setPostsLoading] = useAtom(atoms.postsLoading);

  if (!userStatus) {
    return <LoadingPage checkingUserRoute={false} />;
  }

  return (
    <AppShell page="Home" showRightSidebar title="Home">
      <Head>
        <title>Home • Yap</title>
        <meta
          name="description"
          content="Yap — where the X-Clash community comes to yap."
        />
        <link rel="icon" href="/instagram.png" />
      </Head>
      <div className="w-full">
        <StoryBoard />
        <div
          className={`${postsLoading ? 'fixed opacity-0' : ''}`}
          onLoad={() => setPostsLoading(false)}
        >
          {followingArrayStatus ? (
            <div>
              {followingArray.map((username, index) => (
                <HomePagePost
                  username={username}
                  index={index}
                  key={username + index}
                />
              ))}
            </div>
          ) : (
            ''
          )}
        </div>
        {postsLoading ? <LoadingPosts /> : ''}
      </div>
    </AppShell>
  );
};

export default Home;
