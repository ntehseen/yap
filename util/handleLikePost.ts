import { User } from 'firebase/auth';
import {
  getFirestore,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { postCommentTypes, postType, userDetailTypes } from './atoms';
import app from './firbaseConfig';
import handleUpdateHeartNotifcation from './handleUpdateHeartNotification';

interface Props {
  e: any;
  userDetails: userDetailTypes | User;
  postUserDetails: postCommentTypes;
  postInformation: postType;
}

function handleLikePost({
  e,
  userDetails,
  postUserDetails,
  postInformation,
}: Props) {
  const db = getFirestore(app);
  const postDocRef = doc(
    db,
    `${postUserDetails.username}Posts`,
    postInformation.postID
  );
  const userRef = doc(db, 'users', userDetails.displayName!);

  const action =
    (e.currentTarget as HTMLElement | undefined)?.id ||
    (e.target as HTMLElement | undefined)?.id;

  if (action === 'like') {
    updateDoc(postDocRef, {
      likes: arrayUnion(userDetails.displayName),
    });
    updateDoc(userRef, {
      likedPosts: arrayUnion(postInformation.postID),
    });
    handleUpdateHeartNotifcation({
      postUserDetails,
      userDetails,
      postInformation,
      heartType: 'like',
    });
  } else if (action === 'unlike') {
    updateDoc(postDocRef, {
      likes: arrayRemove(userDetails.displayName),
    });
    updateDoc(userRef, {
      likedPosts: arrayRemove(postInformation.postID),
    });
  }
}

export default handleLikePost;
