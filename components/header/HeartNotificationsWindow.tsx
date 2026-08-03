import React from 'react';
import { useAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import atoms from '../../util/atoms';
import LoadingHeartPosts from '../loadingComps/LoadingHeartPosts';
import ProfilePicSVG from '../svgComps/ProfilePicSVG';

export default function HeartNotificationsWindow() {
  const [userNotifications] = useAtom(atoms.userNotifications);
  const [userDetails] = useAtom(atoms.userDetails);

  const owner = userDetails.displayName;
  const items = userNotifications.heartNotifications;

  if (!items) {
    return <LoadingHeartPosts />;
  }

  return (
    <div className="w-[min(100vw-2rem,380px)] overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl">
      <div className="border-b border-white/[0.08] px-4 py-3">
        <p className="text-[15px] font-semibold">Activity</p>
      </div>
      <div className="scrollbarDark scrollbar max-h-[360px] overflow-y-auto">
        {items.length === 0 ? (
          <p className="px-4 py-10 text-center text-[13px] text-muted-foreground">
            No activity yet.
          </p>
        ) : (
          [...items].reverse().map((details, index) => {
            const threadHref =
              owner && details.postId
                ? `/post/${owner}/${details.postId}`
                : details.username
                  ? `/${details.username}`
                  : '/';

            return (
              <div
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03]"
                key={`hearts${index}-${details.username}-${details.postId}`}
              >
                <Link href={`/${details.username!}`} className="shrink-0">
                  {details.userPhoto ? (
                    <Image
                      className="h-10 w-10 rounded-full object-cover"
                      src={details.userPhoto}
                      alt=""
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div className="h-10 w-10">
                      <ProfilePicSVG strokeWidth="1.5" />
                    </div>
                  )}
                </Link>
                <div className="min-w-0 flex-1 text-[13px] leading-[18px]">
                  <Link
                    href={`/${details.username!}`}
                    className="font-semibold text-foreground hover:underline"
                  >
                    {details.username}
                  </Link>{' '}
                  <span className="text-muted-foreground">{details.text}</span>
                </div>
                <Link href={threadHref} className="shrink-0">
                  {details.postURL ? (
                    <Image
                      className="h-10 w-10 rounded-md object-cover"
                      src={details.postURL}
                      alt=""
                      width={40}
                      height={40}
                    />
                  ) : (
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-muted text-[11px] font-medium text-muted-foreground">
                      Yap
                    </span>
                  )}
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
