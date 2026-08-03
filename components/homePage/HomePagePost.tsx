import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { Heart, MessageCircle } from 'lucide-react';
import handleLikePost from '../../util/handleLikePost';
import atoms from '../../util/atoms';
import ProfilePicSVG from '../svgComps/ProfilePicSVG';
import NoPostsFiller from './NoPostsFiller';
import { cn } from '@/lib/utils';

interface Props {
  username: string;
  index: number;
}

function formatPostDate(createdAt: { seconds?: number } | undefined) {
  if (!createdAt?.seconds) return '';
  return new Date(createdAt.seconds * 1000).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

const HomePagePost = ({ username, index }: Props) => {
  const router = useRouter();
  const [userDetails] = useAtom(atoms.userDetails);
  const [homePagePosts] = useAtom(atoms.homePagePosts);
  const [userPosts] = useAtom(atoms.userPosts);
  const [userNotifications] = useAtom(atoms.userNotifications);

  const isSelf = username === userDetails.displayName;
  const postDetails =
    homePagePosts[username] || (isSelf ? userPosts[0] : undefined);

  if (username === 'null') {
    return <NoPostsFiller />;
  }

  if (!postDetails?.comments) {
    if (isSelf) return null;
    return (
      <picture>
        <img
          className="h-0 w-0 opacity-0"
          src="/instagramLoading.png"
          alt=""
        />
      </picture>
    );
  }

  const author = postDetails.comments[0];
  const body = author?.text || '';
  const replyCount = Math.max(postDetails.comments.length - 1, 0);
  const liked = userNotifications.likedPosts?.includes(postDetails.postID);
  const hasImage = Boolean(postDetails.imgURL);
  const threadHref = `/post/${username}/${postDetails.postID}`;

  function openThread() {
    router.push(threadHref);
  }

  return (
    <article className="border-b border-border px-4 py-4 transition-colors hover:bg-muted/30">
      <div className="flex gap-3">
        <Link href={`/${username}`} className="shrink-0">
          {author.avatarURL ? (
            <Image
              className="h-10 w-10 rounded-full object-cover"
              src={author.avatarURL}
              alt=""
              width={40}
              height={40}
            />
          ) : (
            <div className="h-10 w-10">
              <ProfilePicSVG strokeWidth="1" />
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <Link
              href={`/${username}`}
              className="text-sm font-semibold text-foreground hover:underline"
            >
              {author.username}
            </Link>
            <span className="text-sm text-muted-foreground">@{username}</span>
            <span className="text-sm text-muted-foreground">·</span>
            <Link
              href={threadHref}
              className="text-sm text-muted-foreground hover:underline"
            >
              <time>{formatPostDate(postDetails.createdAt)}</time>
            </Link>
          </div>

          {body ? (
            <button
              type="button"
              className="mt-1 w-full text-left text-[15px] leading-relaxed text-foreground"
              onClick={openThread}
            >
              {body}
            </button>
          ) : null}

          {hasImage ? (
            <button
              type="button"
              className="mt-3 block w-full overflow-hidden rounded-2xl border border-border"
              onClick={openThread}
            >
              <Image
                className="h-auto max-h-[520px] w-full object-cover"
                src={postDetails.imgURL}
                alt=""
                width={0}
                height={0}
                sizes="100vw"
                priority={index === 0}
              />
            </button>
          ) : null}

          <div className="mt-3 flex max-w-xs items-center justify-between text-muted-foreground">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm hover:bg-muted hover:text-foreground"
              onClick={openThread}
              aria-label="View replies"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{replyCount}</span>
            </button>

            <button
              type="button"
              id={liked ? 'unlike' : 'like'}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm hover:bg-muted',
                liked ? 'text-destructive' : 'hover:text-foreground'
              )}
              onClick={(e) =>
                handleLikePost({
                  e,
                  userDetails,
                  postUserDetails: author,
                  postInformation: postDetails,
                })
              }
              aria-label={liked ? 'Unlike' : 'Like'}
            >
              <Heart className={cn('h-4 w-4', liked && 'fill-current')} />
              <span>{postDetails.likes?.length || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default HomePagePost;
