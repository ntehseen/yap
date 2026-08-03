import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TextareaAutosize from 'react-textarea-autosize';
import { useAtom } from 'jotai';
import { ArrowLeft, Smile } from 'lucide-react';
import EmojiSelector from '../EmojiSelector';
import ProfilePicSVG from '../svgComps/ProfilePicSVG';
import atoms from '../../util/atoms';
import useHandleEmojiPopUp from '../../hooks/useHandleEmojiPopUp';
import sendChatRoomMessage from '../../util/handleSendChatRoomMessage';
import { cn } from '@/lib/utils';

interface Props {
  chatRoomID: string;
  userID: string;
  activeChat: string;
  activeChatId: string;
  mode: 'list' | 'thread';
  onBack?: () => void;
}

function ChatRoom({
  chatRoomID,
  userID,
  activeChat,
  activeChatId,
  mode,
  onBack,
}: Props) {
  const [allChatRoomMessages] = useAtom(atoms.allChatRoomMessages);

  const [inputText, setInputText] = React.useState('');
  const [displayEmojiSelector, setDisplayEmojiSelector] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const room = allChatRoomMessages[chatRoomID];
  const messages = room?.slice(0, -1) || [];
  const meta = room?.slice(-1)[0];
  const chatName = meta?.[`${userID}ChatName`] as string | undefined;
  const avatarURL = chatName
    ? (meta?.[`${chatName}Avatar`] as string | undefined)
    : undefined;
  const newMessage = Boolean(meta?.[`${userID}NewMessage`]);
  const isActive = activeChat === activeChatId;
  const lastMessage = messages[0];

  useHandleEmojiPopUp({ setDisplayEmojiSelector });

  React.useEffect(() => {
    if (mode === 'thread' && isActive) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, mode, isActive]);

  if (!chatName) {
    return (
      <div className="flex items-center gap-3 px-[25px] py-3">
        <div className="h-11 w-11 animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (mode === 'list') {
    return (
      <div
        className={cn(
          'flex w-full items-center gap-3 px-[25px] py-3 transition-colors hover:bg-white/[0.03]',
          isActive && 'bg-white/[0.04]'
        )}
      >
        {avatarURL ? (
          <Image
            className="h-11 w-11 shrink-0 rounded-full object-cover"
            src={avatarURL}
            alt=""
            width={44}
            height={44}
          />
        ) : (
          <div className="h-11 w-11 shrink-0">
            <ProfilePicSVG strokeWidth="1" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p
              className={cn(
                'truncate text-[15px] leading-[21px] text-foreground',
                newMessage ? 'font-semibold' : 'font-medium'
              )}
            >
              {chatName}
            </p>
            {newMessage ? (
              <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
            ) : null}
          </div>
          {lastMessage?.text ? (
            <p
              className={cn(
                'truncate text-[13px] leading-[18px] text-muted-foreground',
                newMessage && 'font-medium text-foreground'
              )}
            >
              {lastMessage.name === userID ? 'You: ' : ''}
              {lastMessage.text}
            </p>
          ) : (
            <p className="text-[13px] text-muted-foreground">No messages yet</p>
          )}
        </div>
      </div>
    );
  }

  // Thread view
  return (
    <div className="flex h-full min-h-[calc(100dvh-3.5rem-60px)] flex-col md:min-h-[calc(100dvh-60px)]">
      <div className="flex h-[60px] items-center gap-2 border-b border-white/[0.08] px-3">
        <button
          type="button"
          className="rounded-full p-2 text-foreground hover:bg-muted md:hidden"
          onClick={onBack}
          aria-label="Back to messages"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <Link href={`/${chatName}`} className="flex min-w-0 items-center gap-3">
          {avatarURL ? (
            <Image
              className="h-9 w-9 rounded-full object-cover"
              src={avatarURL}
              alt=""
              width={36}
              height={36}
            />
          ) : (
            <div className="h-9 w-9">
              <ProfilePicSVG strokeWidth="1.5" />
            </div>
          )}
          <span className="truncate text-[15px] font-semibold text-foreground hover:underline">
            {chatName}
          </span>
        </Link>
      </div>

      <div className="flex min-h-0 flex-1 flex-col-reverse gap-3 overflow-y-auto px-[25px] py-4">
        <div ref={messagesEndRef} />
        {messages.map((message, index) => {
          const mine = message.name === userID;
          return (
            <div
              key={`${message.name}-${index}-${message.text?.slice(0, 12)}`}
              className={cn('flex items-end gap-2', mine && 'justify-end')}
            >
              {!mine ? (
                <ChatIcon photoURL={avatarURL || ''} chatName={chatName} />
              ) : null}
              <p
                className={cn(
                  'max-w-[80%] rounded-2xl px-3.5 py-2 text-[15px] leading-[21px]',
                  mine
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                )}
              >
                {message.text}
              </p>
            </div>
          );
        })}
      </div>

      <div className="relative border-t border-white/[0.08] px-3 py-3">
        <div className="flex items-end gap-2 rounded-[20px] border border-white/[0.12] bg-muted/40 px-2 py-1.5">
          <button
            type="button"
            className="mb-0.5 rounded-full p-1.5 text-muted-foreground hover:text-foreground"
            onClick={() => setDisplayEmojiSelector((v) => !v)}
            aria-label="Emoji"
          >
            <Smile className="h-5 w-5" strokeWidth={1.75} id="emoji" />
          </button>
          <TextareaAutosize
            className="my-1.5 max-h-28 w-full resize-none bg-transparent text-[15px] leading-[21px] text-foreground placeholder:text-muted-foreground focus:outline-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Message..."
            maxRows={4}
            minRows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatRoomMessage({
                  e: { ...e, code: 'Enter', target: { id: 'sendMessage' } },
                  chatRoomID,
                  inputText,
                  userID,
                  setInputText,
                  username: chatName,
                });
              }
            }}
          />
          <button
            id="sendMessage"
            type="button"
            className={cn(
              'mb-0.5 shrink-0 px-2 py-1.5 text-[15px] font-semibold',
              inputText.trim()
                ? 'text-foreground'
                : 'pointer-events-none text-muted-foreground/40'
            )}
            onClick={(e) =>
              sendChatRoomMessage({
                e,
                chatRoomID,
                inputText,
                userID,
                setInputText,
                username: chatName,
              })
            }
          >
            Send
          </button>
        </div>
        {displayEmojiSelector ? (
          <div id="emojiSelector" className="absolute bottom-16 left-3 z-20">
            <EmojiSelector setInputText={setInputText} inputText={inputText} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ChatIcon({
  photoURL,
  chatName,
}: {
  photoURL: string;
  chatName: string;
}) {
  return (
    <div className="h-7 w-7 shrink-0">
      {!photoURL ? (
        <div className="h-7 w-7">
          <ProfilePicSVG strokeWidth="1.3" />
        </div>
      ) : (
        <Link href={`/${chatName}`}>
          <Image
            className="h-7 w-7 rounded-full object-cover"
            src={photoURL}
            alt=""
            height={28}
            width={28}
          />
        </Link>
      )}
    </div>
  );
}

export default ChatRoom;
