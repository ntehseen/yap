import { User, updateProfile } from 'firebase/auth';
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import app from './firbaseConfig';
import handleCreateUsernameQueryArray from './handleCreateUsernameQueryArray';

function sanitizeUsername(raw: string) {
  const cleaned = raw
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, '')
    .replace(/^[._]+|[._]+$/g, '')
    .slice(0, 20);

  return cleaned || 'yapper';
}

function baseUsernameFromUser(user: User) {
  if (user.displayName) {
    const compact = user.displayName.replace(/\s+/g, '');
    if (/^[a-zA-Z0-9._]{3,20}$/.test(compact)) {
      return sanitizeUsername(compact);
    }
  }

  const emailPrefix = user.email?.split('@')[0] || 'yapper';
  return sanitizeUsername(emailPrefix);
}

async function resolveAvailableUsername(base: string, uid: string) {
  const db = getFirestore(app);
  let candidate = base;
  let attempt = 0;

  while (attempt < 30) {
    const snap = await getDoc(doc(db, 'users', candidate));
    if (!snap.exists()) {
      return candidate;
    }
    if (snap.data()?.userId === uid) {
      return candidate;
    }
    attempt += 1;
    candidate = `${base}${attempt}`;
  }

  return `${base}_${uid.slice(0, 6)}`;
}

/**
 * Ensures Auth displayName + Firestore profile docs exist for this user.
 * Required for Google sign-in because Yap keys profiles by username.
 */
export async function ensureUserProfile(user: User) {
  const db = getFirestore(app);

  if (user.displayName) {
    const existing = await getDoc(doc(db, 'users', user.displayName));
    if (existing.exists() && existing.data()?.userId === user.uid) {
      if (user.photoURL && existing.data()?.avatarURL !== user.photoURL) {
        await setDoc(
          doc(db, 'users', user.displayName),
          { avatarURL: user.photoURL },
          { merge: true }
        );
      }
      return user.displayName;
    }
  }

  const username = await resolveAvailableUsername(
    baseUsernameFromUser(user),
    user.uid
  );

  const userDoc = await getDoc(doc(db, 'users', username));
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'userList', username), {});
    await setDoc(doc(db, `${username}Posts`, 'userPosts'), {
      createdAt: serverTimestamp(),
      postsListArray: [],
    });
    await setDoc(doc(db, 'users', username), {
      userId: user.uid,
      avatarURL: user.photoURL || '',
      bio: '',
      chatRoomIds: [],
      messageCount: 0,
      likes: false,
      likedPosts: [],
      username,
      postCount: 0,
      followers: [],
      following: [],
      story: '',
      storyViews: [],
      heartNotifications: [],
      newHeart: false,
      usernameQuery: handleCreateUsernameQueryArray(username),
      xClash: {
        server: '',
        alliance: '',
        castleLevel: '',
        combatPower: '',
        role: '',
      },
    });
  }

  await updateProfile(user, {
    displayName: username,
    ...(user.photoURL ? { photoURL: user.photoURL } : {}),
  });

  return username;
}
