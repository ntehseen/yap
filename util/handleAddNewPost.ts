import React from 'react';
import imageCompression from 'browser-image-compression';
import {
  getFirestore,
  updateDoc,
  doc,
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import app from './firbaseConfig';
import {
  notificationTypes,
  postXClashContext,
  userDetailTypes,
  YapPostKind,
} from './atoms';
import { uploadToCloudinary } from './uploadToCloudinary';
import { normalizeTags } from './yapTypes';

interface selectedImageProps {
  e: React.ChangeEvent<HTMLInputElement>;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | undefined>>;
  setImageSelected: React.Dispatch<React.SetStateAction<boolean>>;
}

export function handleSelectedImage({
  e,
  setSelectedImage,
  setImageSelected,
}: selectedImageProps) {
  const file = e.target.files?.[0];
  if (!file) return;

  const fileType = file.type;

  if (
    fileType === 'image/png' ||
    fileType === 'image/jpg' ||
    fileType === 'image/jpeg'
  ) {
    setSelectedImage(file);
    setImageSelected(true);
  } else {
    console.log('please only use .png, .jpg, .jpeg file types');
  }
}

interface PublishProps {
  userNotifications: notificationTypes;
  userDetails: userDetailTypes | User;
  caption: string;
  selectedImage?: File;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onDone?: () => void;
  yapType?: YapPostKind;
  xClashContext?: postXClashContext;
  tags?: string[];
}

async function handleSubmitToDB({
  url,
  userNotifications,
  userDetails,
  caption,
  yapType = 'yap',
  xClashContext,
  tags,
}: {
  url: string;
  userNotifications: notificationTypes;
  userDetails: userDetailTypes | User;
  caption: string;
  yapType?: YapPostKind;
  xClashContext?: postXClashContext;
  tags?: string[];
}) {
  const db = getFirestore(app);
  const userRef = doc(db, 'users', userNotifications.username!);
  const userPostDocRef = doc(
    db,
    `${userNotifications.username}Posts`,
    'userPosts'
  );

  updateDoc(userRef, {
    postCount: userNotifications.postCount! + 1,
  });

  const postCaption = {
    text: caption,
    avatarURL: userDetails.photoURL || '',
    username: userDetails.displayName,
    createdAt: new Date().toLocaleDateString(),
  };

  const context: postXClashContext = {
    server: (xClashContext?.server || '').trim().slice(0, 40),
    alliance: (xClashContext?.alliance || '').trim().slice(0, 40),
  };
  const cleanTags = normalizeTags(tags);

  await addDoc(collection(db, `${userNotifications.username}Posts`), {
    createdAt: serverTimestamp(),
    imgURL: url,
    likeCount: 0,
    comments: [postCaption],
    postID: '',
    likes: [],
    reposts: [],
    yapType: yapType || 'yap',
    xClashContext: context,
    ...(cleanTags.length ? { tags: cleanTags } : {}),
  });

  const q = query(
    collection(db, `${userNotifications.username}Posts`),
    orderBy('createdAt', 'desc'),
    limit(1)
  );
  let latestPostId: string;
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((latestPost: any) => {
    latestPostId = latestPost.id;
  });

  updateDoc(userPostDocRef, {
    postsListArray: arrayUnion(latestPostId!),
  });

  const docRef = doc(db, `${userNotifications.username!}Posts`, latestPostId!);
  updateDoc(docRef, {
    postID: latestPostId!,
  });
}

/** Text-first publish: image optional. */
export async function publishYap({
  userNotifications,
  userDetails,
  caption,
  selectedImage,
  setLoading,
  onDone,
  yapType = 'yap',
  xClashContext,
  tags,
}: PublishProps) {
  const trimmed = caption.trim();
  if (!trimmed && !selectedImage) {
    return;
  }

  setLoading(true);

  try {
    let url = '';
    if (selectedImage) {
      const compressedFile = await imageCompression(selectedImage, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      });
      url = await uploadToCloudinary(compressedFile, {
        folder: 'yap/posts',
        publicId: `${userDetails.displayName}_post_${
          (userNotifications.postCount || 0) + 1
        }_${Date.now()}`,
      });
    }

    await handleSubmitToDB({
      url,
      userNotifications,
      userDetails,
      caption: trimmed,
      yapType,
      xClashContext,
      tags,
    });
    onDone?.();
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
}

interface submitProps {
  userNotifications: notificationTypes;
  userDetails: userDetailTypes | User;
  caption: string;
  selectedImage: File;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAddPost: React.Dispatch<React.SetStateAction<boolean>>;
  yapType?: YapPostKind;
  xClashContext?: postXClashContext;
}

/** Legacy modal submit — still image-required for AddNewPost dialog. */
export async function handleSubmit({
  userNotifications,
  userDetails,
  caption,
  selectedImage,
  setLoading,
  setAddPost,
  yapType,
  xClashContext,
}: submitProps) {
  await publishYap({
    userNotifications,
    userDetails,
    caption,
    selectedImage,
    setLoading,
    onDone: () => setAddPost(false),
    yapType,
    xClashContext,
  });
}
