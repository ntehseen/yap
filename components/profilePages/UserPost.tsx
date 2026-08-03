import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';
import { postType } from '../../util/atoms';

function UserPost({
  postInformation,
  postUserDetails,
}: {
  postInformation: postType;
  postUserDetails: any;
}) {
  const [hovered, setHovered] = React.useState(false);
  const username = postUserDetails?.username as string | undefined;
  const href =
    username && postInformation.postID
      ? `/post/${username}/${postInformation.postID}`
      : '#';
  const hasImage = Boolean(postInformation.imgURL);
  const previewText = postInformation.comments?.[0]?.text || '';
  const replyCount = Math.max((postInformation.comments?.length || 1) - 1, 0);

  return (
    <Link
      href={href}
      className="relative aspect-square overflow-hidden bg-muted"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hasImage ? (
        <Image
          className="h-full w-full select-none object-cover"
          src={postInformation.imgURL}
          alt=""
          width={0}
          height={0}
          sizes="33vw"
        />
      ) : (
        <div className="flex h-full w-full items-end bg-shell-elevated p-3">
          <p className="line-clamp-5 text-left text-xs leading-snug text-foreground sm:text-sm">
            {previewText || 'Yap'}
          </p>
        </div>
      )}

      {hovered ? (
        <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/45 text-white">
          <span className="inline-flex items-center gap-1 text-sm font-semibold">
            <Heart className="h-4 w-4 fill-current" />
            {postInformation.likes?.length || 0}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold">
            <MessageCircle className="h-4 w-4" />
            {replyCount}
          </span>
        </div>
      ) : null}
    </Link>
  );
}

export default UserPost;
