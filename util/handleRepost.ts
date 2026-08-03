import { User } from 'firebase/auth';
import {
  arrayRemove,
  arrayUnion,
  doc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';
import { postCommentTypes, postType, userDetailTypes } from './atoms';
import app from './firbaseConfig';

interface Props {
  userDetails: userDetailTypes | User;
  postUserDetails: postCommentTypes;
  postInformation: postType & { reposts?: string[] };
  reposted: boolean;
}

/** Toggle a repost on the post document (`reposts` username array). */
export default async function handleRepost({
  userDetails,
  postUserDetails,
  postInformation,
  reposted,
}: Props) {
  if (!userDetails.displayName || !postUserDetails.username) return;

  const db = getFirestore(app);
  const postDocRef = doc(
    db,
    `${postUserDetails.username}Posts`,
    postInformation.postID
  );

  await updateDoc(postDocRef, {
    reposts: reposted
      ? arrayRemove(userDetails.displayName)
      : arrayUnion(userDetails.displayName),
  });
}
