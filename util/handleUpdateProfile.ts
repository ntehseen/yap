import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import app from './firbaseConfig';
import { xClashProfileTypes } from './atoms';
import handleCreateUsernameQueryArray from './handleCreateUsernameQueryArray';

export interface ProfileUpdateInput {
  username: string;
  bio: string;
  xClash: xClashProfileTypes;
}

/** Saves bio + nested X-Clash fields; refreshes usernameQuery for search. */
export default async function handleUpdateProfile({
  username,
  bio,
  xClash,
}: ProfileUpdateInput) {
  const db = getFirestore(app);
  const userRef = doc(db, 'users', username);

  await updateDoc(userRef, {
    bio: bio.trim().slice(0, 160),
    xClash: {
      server: (xClash.server || '').trim().slice(0, 40),
      alliance: (xClash.alliance || '').trim().slice(0, 40),
      castleLevel: (xClash.castleLevel || '').trim().slice(0, 10),
      combatPower: (xClash.combatPower || '').trim().slice(0, 20),
      role: (xClash.role || '').trim().slice(0, 40),
    },
    usernameQuery: handleCreateUsernameQueryArray(username),
  });
}
