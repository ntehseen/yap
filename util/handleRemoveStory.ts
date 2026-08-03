import React from 'react';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import app from './firbaseConfig';

interface Props {
  username: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAddPhoto: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function handleRemoveStory({
  username,
  setLoading,
  setAddPhoto,
}: Props) {
  setLoading(true);

  const db = getFirestore(app);
  const userRef = doc(db, 'users', username);

  // Clear story in Firestore. Cloudinary file is left in place on free unsigned uploads.
  updateDoc(userRef, {
    story: '',
    storyViews: [],
  })
    .then(() => {
      setLoading(false);
      setAddPhoto(false);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
      setAddPhoto(false);
    });
}
