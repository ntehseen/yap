import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, MessageCircle, UserPlus, UserCheck } from 'lucide-react';
import { notificationTypes, userDetailTypes } from '@/util/atoms';
import ProfilePicSVG from '@/components/svgComps/ProfilePicSVG';
import XClashBadgeRow from './XClashBadgeRow';
import FollowerFollowingDisplay from './FollowerFollowingDisplay';
import { Button } from '@/components/ui/button';
import { User } from 'firebase/auth';

interface Props {
  isOwnProfile: boolean;
  username: string;
  avatarURL?: string;
  profileNotifications: notificationTypes;
  profileDetails: userDetailTypes | User | Record<string, never>;
  showFollowers: boolean;
  showFollowing: boolean;
  setShowFollowers: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFollowing: React.Dispatch<React.SetStateAction<boolean>>;
  onEditPhoto: () => void;
  onEditProfile: () => void;
  onFollow: () => void;
  onUnfollow: () => void;
  isFollowing: boolean;
}

export default function ProfileHeader({
  isOwnProfile,
  username,
  avatarURL,
  profileNotifications,
  profileDetails,
  showFollowers,
  showFollowing,
  setShowFollowers,
  setShowFollowing,
  onEditPhoto,
  onEditProfile,
  onFollow,
  onUnfollow,
  isFollowing,
}: Props) {
  const displayName =
    ('displayName' in profileDetails && profileDetails.displayName) ||
    profileNotifications.username ||
    username;
  const photo =
    ('photoURL' in profileDetails && profileDetails.photoURL) ||
    avatarURL ||
    profileNotifications.avatarURL;

  return (
    <header className="border-b border-border px-4 pb-5 pt-4">
      <div className="flex gap-4 sm:gap-6">
        <button
          type="button"
          className="relative shrink-0"
          onClick={() => (isOwnProfile ? onEditPhoto() : undefined)}
          aria-label={isOwnProfile ? 'Change profile photo' : 'Profile photo'}
        >
          {photo ? (
            <Image
              className="h-20 w-20 rounded-full object-cover sm:h-28 sm:w-28"
              src={photo}
              alt=""
              width={112}
              height={112}
            />
          ) : (
            <div className="h-20 w-20 sm:h-28 sm:w-28">
              <ProfilePicSVG strokeWidth="1" />
            </div>
          )}
          {isOwnProfile ? (
            <span className="absolute bottom-0 right-0 rounded-full border border-border bg-card p-1.5 text-foreground shadow-sm">
              <Camera className="h-3.5 w-3.5" />
            </span>
          ) : null}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
                {displayName}
              </h1>
              <p className="text-sm text-muted-foreground">@{username}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {isOwnProfile ? (
                <Button type="button" variant="outline" size="sm" onClick={onEditProfile}>
                  Edit profile
                </Button>
              ) : (
                <>
                  <Button type="button" variant="outline" size="sm" asChild>
                    <Link href="/Inbox">
                      <MessageCircle className="h-4 w-4" />
                      Message
                    </Link>
                  </Button>
                  {isFollowing ? (
                    <Button type="button" variant="secondary" size="sm" onClick={onUnfollow}>
                      <UserCheck className="h-4 w-4" />
                      Following
                    </Button>
                  ) : (
                    <Button type="button" size="sm" onClick={onFollow}>
                      <UserPlus className="h-4 w-4" />
                      Follow
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {profileNotifications.userId ? (
            <div className="mt-4">
              <FollowerFollowingDisplay
                showFollowers={showFollowers}
                showFollowing={showFollowing}
                profileNotifications={profileNotifications}
                setShowFollowers={setShowFollowers}
                setShowFollowing={setShowFollowing}
              />
            </div>
          ) : (
            <div className="mt-4 h-5 w-48 animate-pulse rounded bg-muted" />
          )}

          {profileNotifications.bio ? (
            <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
              {profileNotifications.bio}
            </p>
          ) : isOwnProfile ? (
            <button
              type="button"
              className="mt-4 text-sm text-muted-foreground hover:text-foreground"
              onClick={onEditProfile}
            >
              Add a bio…
            </button>
          ) : null}

          <XClashBadgeRow xClash={profileNotifications.xClash} />
        </div>
      </div>
    </header>
  );
}
