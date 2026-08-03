import React from 'react';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
} from 'firebase/auth';
import app from './firbaseConfig';
import { ensureUserProfile } from './ensureUserProfile';

interface Props {
  listeners: Array<() => void>;
  setIsSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

async function handleGoogleSignIn({
  listeners,
  setIsSubmit,
  setError,
  setLoading,
}: Props) {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  setError('');
  setLoading?.(true);

  // Clear prior realtime listeners before auth switches users
  listeners.forEach((unsubscribe) => unsubscribe());

  try {
    const result = await signInWithPopup(auth, provider);
    await ensureUserProfile(result.user);
    setIsSubmit(true);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Google sign-in failed';

    // User closed the popup — not a hard failure to shout about
    if (
      typeof error === 'object' &&
      error &&
      'code' in error &&
      (error as { code: string }).code === 'auth/popup-closed-by-user'
    ) {
      setError('');
    } else if (
      typeof error === 'object' &&
      error &&
      'code' in error &&
      (error as { code: string }).code === 'auth/operation-not-allowed'
    ) {
      setError(
        'Google sign-in is not enabled in Firebase. Enable it under Authentication → Sign-in method.'
      );
    } else {
      setError(message);
    }
  } finally {
    setLoading?.(false);
  }
}

export default handleGoogleSignIn;
