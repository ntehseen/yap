import Link from 'next/link';
import Image from 'next/image';
import { notificationTypes } from '../../util/atoms';
import ProfilePicSVG from '../svgComps/ProfilePicSVG';
import SpinnerSVG from '../svgComps/SpinnerSVG';

function HeaderSearchWindow({
  loading,
  userDetails,
  searchName,
}: {
  loading: boolean;
  userDetails: notificationTypes[];
  searchName: string;
}) {
  return (
    <div
      id="headerSearchWindow"
      className="relative mt-3 h-[min(375px,60vh)] w-full overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-lg"
    >
      <div className="flex h-full items-center justify-center">
        {loading || searchName === '' ? (
          <div className="h-8 w-8">
            <SpinnerSVG />
          </div>
        ) : (
          <div className="h-full w-full overflow-y-auto py-2">
            {userDetails.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
                No players match “{searchName}”
              </div>
            ) : (
              userDetails.map((details, index) => {
                const meta = [
                  details.xClash?.alliance,
                  details.xClash?.server
                    ? `S${details.xClash.server}`
                    : '',
                ]
                  .filter(Boolean)
                  .join(' · ');

                return (
                  <Link
                    href={`/${details.username}`}
                    key={details.userId || details.username || index}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50"
                  >
                    {details.avatarURL ? (
                      <Image
                        className="h-11 w-11 rounded-full object-cover"
                        src={details.avatarURL}
                        alt=""
                        width="44"
                        height="44"
                      />
                    ) : (
                      <div className="h-11 w-11">
                        <ProfilePicSVG strokeWidth="1" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {details.username}
                      </p>
                      {details.bio ? (
                        <p className="truncate text-xs text-muted-foreground">
                          {details.bio}
                        </p>
                      ) : meta ? (
                        <p className="truncate text-xs text-muted-foreground">
                          {meta}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          {details.followers?.length || 0} followers
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HeaderSearchWindow;
