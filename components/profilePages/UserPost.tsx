import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CommentSVG from '../svgComps/CommentSVG';
import HeartSVG from '../svgComps/HeartSVG';
import { postType } from '../../util/atoms';

function UserPost({
  postInformation,
  postUserDetails,
}: {
  postInformation: postType;
  postUserDetails: any;
}) {
  const [postInfo, setPostInfo] = React.useState(false);
  const username = postUserDetails?.username as string | undefined;
  const href =
    username && postInformation.postID
      ? `/post/${username}/${postInformation.postID}`
      : '#';
  const hasImage = Boolean(postInformation.imgURL);
  const previewText = postInformation.comments?.[0]?.text || '';

  return (
    <Link href={href} className="relative block overflow-hidden">
      {hasImage ? (
        <Image
          className="h-[175px] w-[300px] select-none bg-[#ebebeb] object-cover dark:bg-[#313131] sm:h-[300px]"
          src={postInformation.imgURL}
          alt="user post"
          width="0"
          height="0"
          sizes="100vw"
          priority
        />
      ) : (
        <div className="flex h-[175px] w-full items-end bg-muted p-3 sm:h-[300px]">
          <p className="line-clamp-6 text-sm text-foreground">{previewText}</p>
        </div>
      )}
      <div
        className="absolute top-0 left-0 flex h-full w-full cursor-pointer items-center justify-center hover:bg-[#00000049]"
        onMouseEnter={() => setPostInfo(true)}
        onMouseLeave={() => setPostInfo(false)}
      >
        {postInfo ? (
          <div className="flex items-center gap-2 text-white sm:gap-5">
            <div className="flex items-center">
              <HeartSVG fillColor="white" height="20" width="20" />
              <p className="pl-1 text-lg font-semibold">
                {postInformation.likes.length}
              </p>
            </div>
            <div className="flex items-center">
              <CommentSVG outline="white" height="20" width="20" fill="white" />
              <p className="pl-1 text-lg font-semibold">
                {Math.max(postInformation.comments.length - 1, 0)}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </Link>
  );
}

export default UserPost;
