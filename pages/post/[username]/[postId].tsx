import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import atoms from '@/util/atoms';
import AppShell from '@/components/layout/AppShell';
import LoadingPage from '@/components/loadingComps/LoadingPage';
import usePostDocument from '@/hooks/usePostDocument';
import PostThread from '@/components/post/PostThread';
import { Skeleton } from '@/components/ui/skeleton';

const PostDetail: NextPage = () => {
  const router = useRouter();
  const [userStatus] = useAtom(atoms.userStatus);

  const { post, loading, notFound, username } = usePostDocument({
    username: router.query.username,
    postId: router.query.postId,
  });

  if (!userStatus) {
    return <LoadingPage checkingUserRoute={false} />;
  }

  return (
    <AppShell page="Home">
      <Head>
        <title>
          {post?.comments?.[0]?.text
            ? `${post.comments[0].text.slice(0, 48)} • Yap`
            : 'Thread • Yap'}
        </title>
        <meta name="description" content="Conversation thread on Yap" />
        <link rel="icon" href="/instagram.png" />
      </Head>

      {loading ? (
        <div className="space-y-4 px-4 py-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : null}

      {!loading && notFound ? (
        <div className="px-4 py-16 text-center">
          <p className="text-lg font-semibold text-foreground">Yap not found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            This post may have been deleted or the link is invalid.
          </p>
          <button
            type="button"
            className="mt-6 text-sm font-medium text-foreground hover:underline"
            onClick={() => router.push('/')}
          >
            Back to Home
          </button>
        </div>
      ) : null}

      {!loading && post && username ? (
        <PostThread post={post} username={username} />
      ) : null}
    </AppShell>
  );
};

export default PostDetail;
