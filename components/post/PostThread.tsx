import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import atoms, { postType } from '@/util/atoms';
import handleLikePost from '@/util/handleLikePost';
import ProfilePicSVG from '@/components/svgComps/ProfilePicSVG';
import ReplyItem from './ReplyItem';
import ReplyComposer from './ReplyComposer';
import { cn } from '@/lib/utils';

interface Props {
  post: postType;
  username: string;
}

function formatPostDate(createdAt: { seconds?: number } | undefined) {
  if (!createdAt?.seconds) return '';
  return new Date(createdAt.seconds * 1000).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Full conversation view: original yap + flat replies. */
export default function PostThread({ post, username }: Props) {
  const router = useRouter();
  const [userDetails] = useAtom(atoms.userDetails);
  const [userNotifications] = useAtom(atoms.userNotifications);

  const author = post.comments?.[0];
  const body = author?.text || '';
  const replies = (post.comments || []).slice(1).filter((c) => c.text);
  const liked = userNotifications.likedPosts?.includes(post.postID);
  const hasImage = Boolean(post.imgURL);

  if (!author) {
    return (
      <p className="px-4 py-8 text-center text-sm text-muted-foreground">
        This yap has no content.
      </p>
    );
  }

  return (
    <div className="flex min-h-[70vh] flex-col">
      <header className="sticky top-14 z-10 flex items-center gap-3 border-b border-border bg-background/90 px-3 py-3 backdrop-blur xl:top-0">
        <button
          type="button"
          className="rounded-full p-2 text-foreground hover:bg-muted"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold">Thread</h1>
      </header>

      <article className="border-b border-border px-4 py-4">
        <div className="flex gap-3">
          <Link href={`/${username}`} className="shrink-0">
            {author.avatarURL ? (
              <Image
                className="h-11 w-11 rounded-full object-cover"
                src={author.avatarURL}
                alt=""
                width={44}
                height={44}
              />
            ) : (
              <div className="h-11 w-11">
                <ProfilePicSVG strokeWidth="1" />
              </div>
            )}
          </Link>
          <div className="min-w-0 flex-1">
            <Link
              href={`/${username}`}
              className="text-[15px] font-semibold text-foreground hover:underline"
            >
              {author.username}
            </Link>
            <p className="text-sm text-muted-foreground">@{username}</p>
          </div>
        </div>

        {body ? (
          <p className="mt-3 whitespace-pre-wrap text-xl leading-snug text-foreground">
            {body}
          </p>
        ) : null}

        {hasImage ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-border">
            <Image
              className="h-auto max-h-[640px] w-full object-cover"
              src={post.imgURL}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              priority
            />
          </div>
        ) : null}

        <time className="mt-4 block text-sm text-muted-foreground">
          {formatPostDate(post.createdAt)}
        </time>

        <div className="mt-3 flex items-center gap-6 border-y border-border py-3 text-sm text-muted-foreground">
          <span>
            <strong className="text-foreground">{replies.length}</strong> replies
          </span>
          <span>
            <strong className="text-foreground">{post.likes?.length || 0}</strong>{' '}
            likes
          </span>
        </div>

        <div className="mt-1 flex max-w-xs items-center justify-between text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-2 text-sm">
            <MessageCircle className="h-5 w-5" />
            <span>{replies.length}</span>
          </span>
          <button
            type="button"
            id={liked ? 'unlike' : 'like'}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2 py-2 text-sm hover:bg-muted',
              liked ? 'text-destructive' : 'hover:text-foreground'
            )}
            onClick={(e) =>
              handleLikePost({
                e,
                userDetails,
                postUserDetails: author,
                postInformation: post,
              })
            }
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <Heart className={cn('h-5 w-5', liked && 'fill-current')} />
            <span>{post.likes?.length || 0}</span>
          </button>
        </div>
      </article>

      <section className="flex-1">
        {replies.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No replies yet. Start the conversation.
          </p>
        ) : (
          replies.map((reply, index) => (
            <ReplyItem
              key={`${reply.username}-${reply.createdAt}-${index}`}
              reply={reply}
            />
          ))
        )}
      </section>

      <ReplyComposer
        postInformation={post}
        postUserDetails={author}
        autoFocus
      />
    </div>
  );
}
