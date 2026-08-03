import React from 'react';
import handleGetFollowersOrFollowings from '../../util/handleGetFollowersOrFollowings';
import FollowingFollowerDropDown from './FollowingFollowerDropDown';
import {
  followingFollowerInfo,
  notificationTypes,
} from '../../util/atoms';

interface Props {
  showFollowers: boolean;
  showFollowing: boolean;
  profileNotifications: notificationTypes;
  setShowFollowers: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFollowing: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FollowerFollowingDisplay({
  showFollowers,
  showFollowing,
  profileNotifications,
  setShowFollowers,
  setShowFollowing,
}: Props) {
  const [followersInfo, setFollowersInfo] = React.useState<
    followingFollowerInfo[]
  >([]);
  const [followingInfo, setFollowingInfo] = React.useState<
    followingFollowerInfo[]
  >([]);

  return (
    <div className="flex flex-wrap gap-5 text-sm">
      <p className="text-muted-foreground">
        <span className="font-semibold text-foreground">
          {profileNotifications.postCount || 0}
        </span>{' '}
        posts
      </p>
      <button
        id="followingFollowerDropDown"
        className="relative text-muted-foreground"
        type="button"
        onClick={() => {
          setShowFollowers(!showFollowers);
          setShowFollowing(false);
          handleGetFollowersOrFollowings({
            setArray: setFollowersInfo,
            userListArray: profileNotifications.followers || [],
          });
        }}
      >
        <FollowingFollowerDropDown
          count={profileNotifications.followers?.length || 0}
          dropDownName="followers"
          showDropDown={showFollowers}
          usersInfo={followersInfo}
        />
      </button>
      <button
        id="followingFollowerDropDown"
        className="relative text-muted-foreground"
        type="button"
        onClick={() => {
          setShowFollowing(!showFollowing);
          setShowFollowers(false);
          handleGetFollowersOrFollowings({
            setArray: setFollowingInfo,
            userListArray: profileNotifications.following || [],
          });
        }}
      >
        <FollowingFollowerDropDown
          count={profileNotifications.following?.length || 0}
          dropDownName="following"
          showDropDown={showFollowing}
          usersInfo={followingInfo}
        />
      </button>
    </div>
  );
}
