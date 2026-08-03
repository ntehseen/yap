import React from 'react';
import { useAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import atoms from '../../util/atoms';
import LoadingHeartPosts from '../loadingComps/LoadingHeartPosts';
import ProfilePicSVG from '../svgComps/ProfilePicSVG';
import useScrollToLatestMessage from '../../hooks/useScrollToLatestMessage';

export default function HeartNotificationsWindow() {
  const [userNotifications] = useAtom(atoms.userNotifications);
  const [userDetails] = useAtom(atoms.userDetails);
  const [darkMode] = useAtom(atoms.darkMode);
  const [loading, setLoading] = React.useState(true);

  const upperRef = React.useRef<HTMLDivElement>(null);

  useScrollToLatestMessage({ messages: null, latestMessageRef: upperRef });

  if (!userNotifications.heartNotifications) {
    return <LoadingHeartPosts />;
  }

  const owner = userDetails.displayName;

  return (
    <div className="relative">
      <div
        id="close"
        className="fixed top-0 left-0 h-screen w-screen cursor-default"
      />
      <div className="absolute top-2 right-[-80px] h-[280px] w-[270px] cursor-default text-foreground sm:right-[-12px] sm:w-[440px]">
        <div className="ml-auto mr-[84px] flex h-4 w-4 items-center justify-center overflow-hidden sm:mr-4">
          <div className="mt-5 h-4 w-4 rotate-45 bg-card dark:bg-[#131313]" />
        </div>
        <div className="rounded-md border border-border bg-card py-4 shadow-lg dark:bg-[#131313]">
          <div className={loading ? 'opacity-0' : ''}>
            <p className="pl-6 text-sm font-semibold">New notifications</p>
            <div
              className={`${
                darkMode ? 'scrollbarDark' : 'scrollbarLight'
              } scrollbar flex max-h-[300px] flex-col-reverse overflow-y-auto`}
              onLoad={() => setLoading(false)}
            >
              {userNotifications.heartNotifications!.map((details, index) => {
                const threadHref =
                  owner && details.postId
                    ? `/post/${owner}/${details.postId}`
                    : details.username
                      ? `/${details.username}`
                      : '/';

                return (
                  <div
                    className="flex items-center gap-2 px-2 py-4 text-sm sm:px-6"
                    key={`hearts${index}`}
                  >
                    <Link href={`/${details.username!}`}>
                      {details.userPhoto ? (
                        <Image
                          className="mr-2 h-11 w-11 cursor-pointer select-none rounded-full object-cover"
                          src={details.userPhoto}
                          alt=""
                          width="44"
                          height="44"
                        />
                      ) : (
                        <div className="mr-2 h-11 w-11">
                          <ProfilePicSVG strokeWidth="1.5" />
                        </div>
                      )}
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:flex-wrap sm:items-baseline">
                      <Link href={`/${details.username!}`}>
                        <p className="font-semibold">{details.username}</p>
                      </Link>
                      <p className="text-xs text-muted-foreground sm:pl-1 sm:text-sm">
                        {details.text}
                      </p>
                    </div>
                    <Link href={threadHref} className="ml-auto shrink-0">
                      {details.postURL ? (
                        <Image
                          className="h-10 w-10 select-none object-cover"
                          src={details.postURL}
                          alt="Open yap"
                          width="80"
                          height="80"
                          priority
                        />
                      ) : (
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                          Yap
                        </span>
                      )}
                    </Link>
                  </div>
                );
              })}
              <div ref={upperRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
