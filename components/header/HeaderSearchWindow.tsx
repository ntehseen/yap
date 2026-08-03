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
      className="relative mt-3 h-[min(375px,60vh)] w-full overflow-hidden rounded-md border border-border bg-card text-card-foreground shadow-lg"
    >
      <div className="flex h-full items-center justify-center">
        {loading || searchName === '' ? (
          <div className="h-8 w-8 ">
            <SpinnerSVG />
          </div>
        ) : (
          <div className="h-full w-full overflow-y-scroll py-3">
            {userDetails.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center">
                <div className="">No user with this name was found</div>
              </div>
            ) : (
              userDetails.map((details, index) => (
                // item will not be deleted or updated so it is okay to use index as a key
                 
                <Link href={`/${details.username}`} key={index}>
                  <div className="flex cursor-pointer items-center py-3 pl-5 hover:bg-[#f8f8f8] dark:hover:bg-[#131313]">
                    {' '}
                    {details.avatarURL ? (
                      <Image
                        className="h-11 w-11 rounded-full object-cover"
                        src={details.avatarURL}
                        alt="avatar"
                        width="44"
                        height="44"
                      />
                    ) : (
                      <div className="h-11 w-11">
                        <ProfilePicSVG strokeWidth="1" />
                      </div>
                    )}
                    <p className="ml-5">{details.username}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HeaderSearchWindow;
