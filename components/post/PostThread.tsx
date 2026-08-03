import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { ArrowLeft } from 'lucide-react';
import { postType } from '@/util/atoms';
import formatRelativeTime from '@/util/formatRelativeTime';
import ProfilePicSVG from '@/components/svgComps/ProfilePicSVG';
import PostActions from './PostActions';
import YapTypeBadge from './YapTypeBadge';
import ReplyItem from './ReplyItem';
import ReplyComposer from './ReplyComposer';

interface Props {
  post: postType;
  username: string;
}

function formatFullDate(createdAt: { seconds?: number } | undefined) {
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
  const replyRef = React.useRef<HTMLDivElement>(null);

  const author = post.comments?.[0];
  const body = author?.text || '';
  const replies = (post.comments || []).slice(1).filter((c) => c.text);
  const hasImage = Boolean(post.imgURL);
  const relative = formatRelativeTime(post.createdAt);

  if (!author) {
    return (
      <p className="px-4 py-8 text-center text-sm text-muted-foreground">
        This yap has no content.
      </p>
    );
  }

  function focusReply() {
    replyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    const textarea = replyRef.current?.querySelector('textarea');
    textarea?.focus();
  }

  return (
    <div className="flex min-h-[70vh] flex-col">
      <header className="sticky top-0 z-10 flex h-[60px] items-center gap-3 border-b border-border bg-[hsl(var(--feed))]/95 px-3 backdrop-blur-md max-md:top-14 max-md:bg-background/95">
        <button
          type="button"
          className="rounded-full p-2 text-foreground hover:bg-muted"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <h1 className="text-[15px] font-semibold">Thread</h1>
      </header>

      <article className="border-b border-white/[0.08] px-[25px] py-4">
        <div className="flex gap-3">
          <Link href={`/${username}`} className="shrink-0">
            {author.avatarURL ? (
              <Image
                className="h-9 w-9 rounded-full object-cover"
                src={author.avatarURL}
                alt=""
                width={36}
                height={36}
              />
            ) : (
              <div className="h-9 w-9">
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
            <p className="text-[13px] text-muted-foreground">@{username}</p>
            <YapTypeBadge post={post} />
          </div>
        </div>

        {body ? (
          <p className="mt-3 whitespace-pre-wrap text-[17px] leading-snug text-foreground">
            {body}
          </p>
        ) : null}

        {hasImage ? (
          <div className="mt-3 overflow-hidden rounded-2xl border border-border">
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

        <time className="mt-3 block text-[13px] text-muted-foreground">
          {formatFullDate(post.createdAt)}
          {relative ? ` · ${relative}` : ''}
        </time>

        <div className="mt-3 flex items-center gap-5 border-y border-border py-3 text-[13px] text-muted-foreground">
          <span>
            <strong className="font-semibold text-foreground">
              {replies.length}
            </strong>{' '}
            replies
          </span>
          <span>
            <strong className="font-semibold text-foreground">
              {post.likes?.length || 0}
            </strong>{' '}
            likes
          </span>
          {(post.reposts?.length || 0) > 0 ? (
            <span>
              <strong className="font-semibold text-foreground">
                {post.reposts?.length}
              </strong>{' '}
              reposts
            </span>
          ) : null}
        </div>

        <PostActions
          post={post}
          author={author}
          replyCount={replies.length}
          onReply={focusReply}
        />
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

      <div ref={replyRef}>
        <ReplyComposer
          postInformation={post}
          postUserDetails={author}
          autoFocus
        />
      </div>
    </div>
  );
}
