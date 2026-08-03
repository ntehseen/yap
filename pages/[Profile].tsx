import Head from 'next/head';
import React from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import type { NextPage } from 'next';
import UnfollowUser from '../components/profilePages/UnfollowUser';
import AddProfilePhoto from '../components/profilePages/AddProfilePhoto';
import handleFollowUser from '../util/handleFollowUser';
import useCheckUserName from '../hooks/useCheckUserName';
import LoadingPage from '../components/loadingComps/LoadingPage';
import UserPost from '../components/profilePages/UserPost';
import useGetOtherUserPosts from '../hooks/useGetOtherUserPosts';
import atoms, { postType } from '../util/atoms';
import LoadingUserPosts from '../components/loadingComps/LoadingUserPosts';
import useHandleFollowerFollowingDropDown from '../hooks/useHandleFollowerFollowingDropDown';
import UserDoesNotExist from '../components/profilePages/UserDoesNotExist';
import AppShell from '../components/layout/AppShell';
import ProfileHeader from '../components/profilePages/ProfileHeader';
import ProfileTabs, {
  ProfileTab,
} from '../components/profilePages/ProfileTabs';
import EditProfileModal from '../components/profilePages/EditProfileModal';

function isRenderablePost(post: postType | undefined): post is postType {
  return Boolean(post?.postID && post?.comments);
}

const Profile: NextPage = () => {
  const router = useRouter();
  const nameSearch = router.query.Profile;
  const username =
    typeof nameSearch === 'string' ? nameSearch : nameSearch?.[0] || '';

  const [userStatus] = useAtom(atoms.userStatus);
  const [userPosts] = useAtom(atoms.userPosts);
  const [userDetails] = useAtom(atoms.userDetails);
  const [userNotifications] = useAtom(atoms.userNotifications);
  const [userPorfileLoading, setUserPorfileLoading] = useAtom(
    atoms.userPorfileLoading
  );

  const [addPhoto, setAddPhoto] = React.useState(false);
  const [editProfile, setEditProfile] = React.useState(false);
  const [unfollow, setUnfollow] = React.useState(false);
  const [showFollowing, setShowFollowing] = React.useState(false);
  const [showFollowers, setShowFollowers] = React.useState(false);
  const [tab, setTab] = React.useState<ProfileTab>('posts');

  useHandleFollowerFollowingDropDown({ setShowFollowing, setShowFollowers });

  const user = useCheckUserName({ nameSearch, queryCharacter: false });

  const otherUser = useGetOtherUserPosts({
    user,
    nameSearch,
    limitSearch: false,
  });

  const profilePosts = user.otherUser ? otherUser.profilePosts : userPosts;
  const profileDetails = user.otherUser ? {} : userDetails;
  const profileNotifications = user.otherUser
    ? user.otherUserNotifications
    : userNotifications;

  const isOwnProfile = username === userDetails.displayName;
  const isFollowing = Boolean(
    userNotifications.following?.includes(profileNotifications.username || '')
  );

  const posts = React.useMemo(
    () => profilePosts.filter(isRenderablePost),
    [profilePosts]
  );
  const mediaPosts = React.useMemo(
    () => posts.filter((p) => Boolean(p.imgURL)),
    [posts]
  );
  const visiblePosts = tab === 'media' ? mediaPosts : posts;

  React.useEffect(() => {
    if (profileNotifications.userId) {
      setUserPorfileLoading(false);
    }
  }, [profileNotifications.userId, posts.length, setUserPorfileLoading]);

  if (!userStatus) {
    return <LoadingPage checkingUserRoute={false} />;
  }
  if (user.checkingUser && nameSearch !== userDetails.displayName) {
    return <LoadingPage checkingUserRoute />;
  }
  if (!user.userExists && !user.checkingUser) {
    return <UserDoesNotExist search={nameSearch} />;
  }

  return (
    <AppShell page="Profile">
      <Head>
        <title>{username || 'Profile'} • Yap</title>
        <meta name="description" content="Yapper profile on Yap." />
        <link rel="icon" href="/instagram.png" />
      </Head>

      {addPhoto ? <AddProfilePhoto setAddPhoto={setAddPhoto} /> : null}
      {editProfile ? (
        <EditProfileModal
          profile={profileNotifications}
          onClose={() => setEditProfile(false)}
        />
      ) : null}
      {unfollow ? (
        <UnfollowUser
          setUnfollow={setUnfollow}
          imgURL={profileNotifications.avatarURL!}
          username={profileNotifications.username!}
          userNotifications={userNotifications}
          profileNotifications={profileNotifications}
        />
      ) : null}

      <div className="mx-auto w-full">
        <ProfileHeader
          isOwnProfile={isOwnProfile}
          username={username}
          avatarURL={profileNotifications.avatarURL}
          profileNotifications={profileNotifications}
          profileDetails={profileDetails}
          showFollowers={showFollowers}
          showFollowing={showFollowing}
          setShowFollowers={setShowFollowers}
          setShowFollowing={setShowFollowing}
          onEditPhoto={() => setAddPhoto(true)}
          onEditProfile={() => setEditProfile(true)}
          onFollow={() =>
            handleFollowUser({
              userName: userNotifications.username!,
              otherUserName: profileNotifications.username!,
            })
          }
          onUnfollow={() => {
            setUnfollow(true);
            document.body.style.overflow = 'hidden';
          }}
          isFollowing={isFollowing}
        />

        <ProfileTabs
          tab={tab}
          onChange={setTab}
          postsCount={posts.length}
          mediaCount={mediaPosts.length}
        />

        {userPorfileLoading ? <LoadingUserPosts /> : null}

        {!userPorfileLoading ? (
          <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
            {visiblePosts.map((postInformation, index) => (
              <UserPost
                key={postInformation.postID || `post${index}`}
                postInformation={postInformation}
                postUserDetails={profileNotifications}
              />
            ))}
          </div>
        ) : null}

        {!userPorfileLoading && visiblePosts.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-muted-foreground">
            {tab === 'media' ? 'No media yaps yet.' : 'No yaps yet.'}
          </p>
        ) : null}
      </div>
    </AppShell>
  );
};

export default Profile;
