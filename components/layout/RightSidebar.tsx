import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAtom } from 'jotai';
import atoms from '@/util/atoms';
import { Separator } from '@/components/ui/separator';
import ProfilePicSVG from '@/components/svgComps/ProfilePicSVG';

function RightSidebar() {
  const [userDetails] = useAtom(atoms.userDetails);
  const [spotlightUsers] = useAtom(atoms.spotlightUsers);
  const suggestions = spotlightUsers.slice(0, 5);

  return (
    <aside className="yap-right-sidebar">
      <Link
        href={userDetails.displayName ? `/${userDetails.displayName}` : '/'}
        className="mb-8 flex items-center gap-3"
      >
        {userDetails.photoURL ? (
          <Image
            className="h-10 w-10 rounded-full object-cover"
            src={userDetails.photoURL}
            alt=""
            width={40}
            height={40}
          />
        ) : (
          <div className="h-10 w-10">
            <ProfilePicSVG strokeWidth="1" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-foreground">
            {userDetails.displayName || 'You'}
          </p>
          <p className="text-sm text-muted-foreground">View profile</p>
        </div>
      </Link>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">
          Suggested players
        </h2>
        <Link
          href="/Explore"
          className="text-sm font-medium text-foreground hover:underline"
        >
          See all
        </Link>
      </div>

      {suggestions.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Players you might know will show up here.
        </p>
      ) : (
        <ul className="space-y-4">
          {suggestions.map((user) => {
            const meta = [user.xClash?.alliance, user.xClash?.role]
              .filter(Boolean)
              .join(' · ');

            return (
              <li key={user.userId || user.username}>
                <Link
                  href={`/${user.username}`}
                  className="flex items-center gap-3 hover:opacity-90"
                >
                  {user.avatarURL ? (
                    <Image
                      className="h-10 w-10 rounded-full object-cover"
                      src={user.avatarURL}
                      alt=""
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div className="h-10 w-10">
                      <ProfilePicSVG strokeWidth="1" />
                    </div>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {user.username}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {meta || `${user.followers?.length || 0} followers`}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <Separator className="my-6" />
      <p className="text-xs text-muted-foreground">
        Discover players by server and alliance on Explore.
      </p>
    </aside>
  );
}

export default RightSidebar;
