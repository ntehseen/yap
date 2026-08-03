import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useAtom } from 'jotai';
import React from 'react';
import Head from 'next/head';
import useGetUserDetailsOnAuth from '../hooks/useGetUserDetailsOnAuth';
import useShuffleFollowingArray from '../hooks/useShuffleFollowingArray';
import useExtractStoriesArray from '../hooks/useExtractStoriesArray';
import useGetSpotlightUsers from '../hooks/useGetSpotlightUsers';
import atoms from '../util/atoms';
import useSetUserDarkModePreference from '../hooks/useSetUserDarkModePreference';
import useCheckNewMessages from '../hooks/useCheckNewMessages';

function MyApp({ Component, pageProps }: AppProps) {
  const [darkMode] = useAtom(atoms.darkMode);

  useGetUserDetailsOnAuth();
  useShuffleFollowingArray();
  useExtractStoriesArray();
  useGetSpotlightUsers();
  useSetUserDarkModePreference();
  useCheckNewMessages();

  // Keep tokens on <html> so Safari body/overscroll and fixed chrome match theme.
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', darkMode);
    root.style.colorScheme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
