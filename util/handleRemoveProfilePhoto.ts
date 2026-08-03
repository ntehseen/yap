import React from 'react';
import { getFirestore, updateDoc, doc } from 'firebase/firestore';
import { getAuth, updateProfile } from 'firebase/auth';
import app from './firbaseConfig';

interface Props {
  username: string;
  chatRoomIds: string[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAddPhoto: React.Dispatch<React.SetStateAction<boolean>>;
}

async function handleRemoveProfilePhoto({
  username,
  chatRoomIds,
  setLoading,
  setAddPhoto,
}: Props) {
  const auth = getAuth();
  const db = getFirestore(app);
  const countRef = doc(db, 'users', username);

  setLoading(true);

  try {
    // Clear avatar references in Firestore + Auth.
    // Cloudinary assets are left in place (unsigned client uploads can't delete securely).
    await Promise.all(
      chatRoomIds.map((element: string) =>
        updateDoc(doc(db, element, 'users'), {
          [`${username}Avatar`]: '',
        })
      )
    );

    await updateDoc(countRef, {
      avatarURL: '',
    });

    await updateProfile(auth.currentUser!, {
      photoURL: '',
    });

    setLoading(false);
    setAddPhoto(false);
  } catch (error) {
    console.log(error);
    setLoading(false);
  }
}

export default handleRemoveProfilePhoto;
