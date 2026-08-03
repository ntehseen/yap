import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useAtom } from 'jotai';
import atoms, { postCommentTypes, postType } from '@/util/atoms';
import handleSendPostMessage from '@/util/handleSendPostMessage';
import { Button } from '@/components/ui/button';
import ProfilePicSVG from '@/components/svgComps/ProfilePicSVG';
import Image from 'next/image';

interface Props {
  postInformation: postType;
  postUserDetails: postCommentTypes;
  autoFocus?: boolean;
}

export default function ReplyComposer({
  postInformation,
  postUserDetails,
  autoFocus = false,
}: Props) {
  const [userDetails] = useAtom(atoms.userDetails);
  const [commentText, setCommentText] = React.useState('');
  const [sending, setSending] = React.useState(false);

  const canSend = commentText.trim().length > 0 && !sending;

  async function submit(e: React.SyntheticEvent) {
    if (!canSend) return;
    setSending(true);
    try {
      handleSendPostMessage({
        e: { ...e, code: 'Enter', target: { id: 'sendMessage' } },
        postInformation,
        postUserDetails,
        userDetails,
        commentText: commentText.trim(),
        setCommentText,
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="sticky bottom-0 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
      <div className="flex gap-3">
        <div className="shrink-0 pt-1">
          {userDetails.photoURL ? (
            <Image
              className="h-9 w-9 rounded-full object-cover"
              src={userDetails.photoURL}
              alt=""
              width={36}
              height={36}
            />
          ) : (
            <div className="h-9 w-9">
              <ProfilePicSVG strokeWidth="1" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <TextareaAutosize
            className="w-full resize-none bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
            placeholder="Reply..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            minRows={1}
            maxRows={6}
            autoFocus={autoFocus}
            disabled={sending}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit(e);
              }
            }}
          />
          <div className="mt-2 flex justify-end">
            <Button
              type="button"
              size="sm"
              disabled={!canSend}
              onClick={submit}
            >
              {sending ? 'Sending…' : 'Reply'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
