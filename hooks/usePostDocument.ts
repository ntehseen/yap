import React from 'react';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import app from '@/util/firbaseConfig';
import { postType } from '@/util/atoms';

interface Options {
  username?: string | string[];
  postId?: string | string[];
}

function asString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
}

/** Live Firestore listener for a single post document. */
export default function usePostDocument({ username, postId }: Options) {
  const owner = asString(username);
  const id = asString(postId);

  const [post, setPost] = React.useState<postType | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    if (!owner || !id) {
      setLoading(false);
      setNotFound(true);
      return undefined;
    }

    setLoading(true);
    setNotFound(false);

    const db = getFirestore(app);
    const ref = doc(db, `${owner}Posts`, id);

    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setPost(null);
          setNotFound(true);
          setLoading(false);
          return;
        }
        setPost(snap.data() as postType);
        setNotFound(false);
        setLoading(false);
      },
      () => {
        setPost(null);
        setNotFound(true);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [owner, id]);

  return { post, loading, notFound, username: owner, postId: id };
}
