import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { postCommentTypes } from '@/util/atoms';
import ProfilePicSVG from '@/components/svgComps/ProfilePicSVG';

interface Props {
  reply: postCommentTypes;
}

/** First-level reply row in a conversation thread. */
export default function ReplyItem({ reply }: Props) {
  if (!reply.text) return null;

  return (
    <div className="flex gap-3 border-b border-border px-4 py-4">
      <Link href={`/${reply.username}`} className="shrink-0">
        {reply.avatarURL ? (
          <Image
            className="h-9 w-9 rounded-full object-cover"
            src={reply.avatarURL}
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
        <div className="flex flex-wrap items-baseline gap-x-2">
          <Link
            href={`/${reply.username}`}
            className="text-sm font-semibold text-foreground hover:underline"
          >
            {reply.username}
          </Link>
          <span className="text-sm text-muted-foreground">
            @{reply.username}
          </span>
          {reply.createdAt ? (
            <>
              <span className="text-sm text-muted-foreground">·</span>
              <time className="text-sm text-muted-foreground">
                {reply.createdAt}
              </time>
            </>
          ) : null}
        </div>
        <p className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
          {reply.text}
        </p>
      </div>
    </div>
  );
}
