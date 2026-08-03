import React from 'react';
import { useAtom } from 'jotai';
import { Heart, MessageCircle, Repeat2, Send } from 'lucide-react';
import atoms, { postCommentTypes, postType } from '@/util/atoms';
import handleLikePost from '@/util/handleLikePost';
import handleRepost from '@/util/handleRepost';
import handleSharePost from '@/util/handleSharePost';
import { cn } from '@/lib/utils';

interface Props {
  post: postType;
  author: postCommentTypes;
  replyCount: number;
  onReply?: () => void;
}

/** Threads action row: 20px icons, 13px counts, 36px hit targets, left-aligned. */
export default function PostActions({
  post,
  author,
  replyCount,
  onReply,
}: Props) {
  const [userDetails] = useAtom(atoms.userDetails);
  const [userNotifications] = useAtom(atoms.userNotifications);

  const liked = userNotifications.likedPosts?.includes(post.postID);
  const reposted = Boolean(
    userDetails.displayName &&
      post.reposts?.includes(userDetails.displayName)
  );
  const likeCount = post.likes?.length || 0;
  const repostCount = post.reposts?.length || 0;

  async function onRepost() {
    if (!userDetails.displayName) return;
    await handleRepost({
      userDetails,
      postUserDetails: author,
      postInformation: post,
      reposted,
    });
  }

  async function onShare() {
    await handleSharePost({
      username: author.username,
      postId: post.postID,
      text: author.text,
    });
  }

  return (
    <div className="-ml-3 mt-1 flex items-center text-[hsl(var(--icon))]">
      <button
        type="button"
        id={liked ? 'unlike' : 'like'}
        className={cn(
          'threads-action',
          liked && 'text-[#ff3040] hover:text-[#ff3040]'
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
        <Heart className={cn('h-5 w-5', liked && 'fill-current')} strokeWidth={1.75} />
        {likeCount > 0 ? <span>{likeCount}</span> : null}
      </button>

      <button
        type="button"
        className="threads-action"
        onClick={onReply}
        aria-label="Reply"
      >
        <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
        {replyCount > 0 ? <span>{replyCount}</span> : null}
      </button>

      <button
        type="button"
        className={cn(
          'threads-action',
          reposted && 'text-emerald-500 hover:text-emerald-500'
        )}
        onClick={onRepost}
        aria-label={reposted ? 'Remove repost' : 'Repost'}
      >
        <Repeat2 className="h-5 w-5" strokeWidth={1.75} />
        {repostCount > 0 ? <span>{repostCount}</span> : null}
      </button>

      <button
        type="button"
        className="threads-action"
        onClick={onShare}
        aria-label="Share"
      >
        <Send className="h-5 w-5" strokeWidth={1.75} />
      </button>
    </div>
  );
}
